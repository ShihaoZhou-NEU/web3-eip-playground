from __future__ import annotations

import json
import os
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from spoon_ai.agents import SpoonReactAI
from spoon_ai.chat import ChatBot
from spoon_ai.prompts.spoon_react import NEXT_STEP_PROMPT_TEMPLATE, SYSTEM_PROMPT
from spoon_ai.tools.tool_manager import ToolManager


# Load .env automatically for local/demo usage, matching README guidance.
load_dotenv(override=True)


# ----------------------------
# Models
# ----------------------------


class TxContext(BaseModel):
    """Lightweight transaction context for better explanations."""

    to: Optional[str] = None
    value_eth: Optional[float] = Field(default=None, alias="valueEth")
    data: Optional[str] = None
    note: Optional[str] = None

    model_config = {"populate_by_name": True}


class Tutor1559ExplainRequest(BaseModel):
    """Inputs for EIP-1559 tutoring."""

    base_fee_per_gas_gwei: float = Field(alias="baseFeePerGasGwei")
    max_fee_per_gas_gwei: float = Field(alias="maxFeePerGasGwei")
    max_priority_fee_per_gas_gwei: float = Field(alias="maxPriorityFeePerGasGwei")
    gas_limit: int = Field(default=21_000, alias="gasLimit")
    user_input: Optional[str] = Field(default=None, alias="userInput")
    tx_context: Optional[TxContext] = Field(default=None, alias="txContext")

    model_config = {"populate_by_name": True}


class DelegationContext(BaseModel):
    """Minimal delegation/authorization context for EIP-7702."""

    delegate: Optional[str] = None
    scope: Optional[str] = None
    expiry: Optional[int] = None
    functions: List[str] = Field(default_factory=list)
    limits: Dict[str, Any] = Field(default_factory=dict)


class SafetyContext(BaseModel):
    """Safety signals provided by the DApp (e.g., simulation results)."""

    is_simulation_ok: Optional[bool] = Field(default=None, alias="isSimulationOk")
    warnings: List[str] = Field(default_factory=list)
    risk_hints: List[str] = Field(default_factory=list, alias="riskHints")

    model_config = {"populate_by_name": True}


class Tutor7702ExplainRequest(BaseModel):
    """Inputs for EIP-7702 tutoring."""

    delegation_context: DelegationContext = Field(alias="delegationContext")
    safety_context: SafetyContext = Field(default_factory=SafetyContext, alias="safetyContext")
    user_input: Optional[str] = Field(default=None, alias="userInput")
    tx_context: Optional[TxContext] = Field(default=None, alias="txContext")

    model_config = {"populate_by_name": True}


class TutorExplainResponse(BaseModel):
    """Stable response shape for frontend rendering."""

    summary: str
    bullets: List[str]
    next_steps: List[str] = Field(alias="nextSteps")
    derived: Dict[str, Any]
    meta: Dict[str, Any] = Field(default_factory=dict)

    model_config = {"populate_by_name": True}


# ----------------------------
# EIP-1559 derived calculations
# ----------------------------


def _gas_fee_eth(gwei_per_gas: float, gas_limit: int) -> float:
    """
    Convert a gas price in gwei into ETH cost for a given gas limit.

    1 ETH = 1e9 gwei, so:
      fee_eth = (gwei_per_gas * gas_limit) / 1e9
    """
    return (gwei_per_gas * float(gas_limit)) / 1_000_000_000.0


def compute_eip1559_derived(req: Tutor1559ExplainRequest) -> Dict[str, Any]:
    """
    Compute the most useful EIP-1559 derived metrics for tutoring.

    Key formulas:
    - effectiveGasPrice = min(maxFeePerGas, baseFeePerGas + maxPriorityFeePerGas)
    - effectivePriorityFee = min(maxPriorityFeePerGas, maxFeePerGas - baseFeePerGas)
    - maxBaseFeeSupported = maxFeePerGas - maxPriorityFeePerGas
    """
    base_fee = max(req.base_fee_per_gas_gwei, 0.0)
    max_fee = max(req.max_fee_per_gas_gwei, 0.0)
    max_priority = max(req.max_priority_fee_per_gas_gwei, 0.0)
    gas_limit = max(int(req.gas_limit), 0)

    # Inclusion requires maxFeePerGas >= baseFeePerGas.
    inclusion_likely = max_fee >= base_fee

    # Effective gas price and tip capping behavior under EIP-1559.
    effective_gas_price = min(max_fee, base_fee + max_priority)
    priority_fee_cap = max(max_fee - base_fee, 0.0)
    effective_priority_fee = min(max_priority, priority_fee_cap)
    tip_is_capped = max_priority > priority_fee_cap + 1e-9

    # Headroom against rising base fee.
    max_base_fee_supported = max(max_fee - max_priority, 0.0)
    base_fee_buffer = max_base_fee_supported - base_fee
    max_fee_minus_base = max_fee - base_fee

    derived: Dict[str, Any] = {
        "inclusionLikely": inclusion_likely,
        "effectiveGasPriceGwei": round(effective_gas_price, 6),
        "effectivePriorityFeeGwei": round(effective_priority_fee, 6),
        "priorityFeeCapGwei": round(priority_fee_cap, 6),
        "tipIsCapped": tip_is_capped,
        "maxBaseFeeSupportedGwei": round(max_base_fee_supported, 6),
        "baseFeeBufferGwei": round(base_fee_buffer, 6),
        "maxFeeMinusBaseFeeGwei": round(max_fee_minus_base, 6),
        "expectedFeeEth": round(_gas_fee_eth(effective_gas_price, gas_limit), 12),
        "worstCaseFeeEth": round(_gas_fee_eth(max_fee, gas_limit), 12),
        "burnedBaseFeeEth": round(_gas_fee_eth(base_fee, gas_limit), 12) if inclusion_likely else None,
        "priorityFeeEth": round(_gas_fee_eth(effective_priority_fee, gas_limit), 12),
        "gasLimit": gas_limit,
    }

    return derived


def _explain_1559(req: Tutor1559ExplainRequest, derived: Dict[str, Any]) -> TutorExplainResponse:
    inclusion_likely = bool(derived["inclusionLikely"])
    max_fee_headroom = float(derived["maxFeeMinusBaseFeeGwei"])
    tip_is_capped = bool(derived["tipIsCapped"])

    if not inclusion_likely:
        summary = "这笔交易当前无法进入区块，因为 maxFeePerGas 低于 baseFeePerGas。"
    elif max_fee_headroom < 1.0:
        summary = "这笔交易虽然能进块，但 maxFeePerGas 只比 baseFeePerGas 高一点点，容易被波动卡住。"
    else:
        summary = "这组 1559 参数总体合理：既能进块，也保留了一定缓冲。"

    bullets: List[str] = [
        (
            "有效 gas 价 = min(maxFeePerGas, baseFeePerGas + maxPriorityFeePerGas)，"
            f"当前约为 {derived['effectiveGasPriceGwei']} gwei。"
        ),
        (
            "最坏手续费按 maxFeePerGas 计算，"
            f"约为 {derived['worstCaseFeeEth']} ETH（不含转账 value）。"
        ),
        (
            "其中 base fee 会被销毁（burn），"
            f"本次预计销毁约 {derived['burnedBaseFeeEth']} ETH。"
            if derived.get("burnedBaseFeeEth") is not None
            else "由于 maxFeePerGas < baseFeePerGas，本次不会产生有效的 base fee burn。"
        ),
    ]

    if tip_is_capped:
        bullets.append(
            "你的 maxPriorityFeePerGas 高于可支付上限（maxFee - baseFee），实际小费会被截断。"
        )

    next_steps: List[str] = []

    if not inclusion_likely:
        suggested_max_fee = round(req.base_fee_per_gas_gwei + req.max_priority_fee_per_gas_gwei + 1.0, 3)
        next_steps.append(f"把 maxFeePerGas 至少提高到 ~{suggested_max_fee} gwei（高于 baseFee + priority）。")
    else:
        if max_fee_headroom < 1.0:
            next_steps.append("为了避免 base fee 小幅上涨就卡住，建议适度提高 maxFeePerGas。")
        if tip_is_capped:
            next_steps.append("要让小费真正生效，需要同时提高 maxFeePerGas 或降低 maxPriorityFeePerGas。")

    if not next_steps:
        next_steps.append("可以把这组参数作为“默认模板”，再根据是否拥堵做微调。")

    return TutorExplainResponse(
        summary=summary,
        bullets=bullets,
        nextSteps=next_steps,
        derived=derived,
        meta={"standard": "EIP-1559"},
    )


# ----------------------------
# EIP-7702 derived heuristics
# ----------------------------


def _now_ts() -> int:
    return int(datetime.now(tz=timezone.utc).timestamp())


def _derive_7702(req: Tutor7702ExplainRequest) -> Dict[str, Any]:
    now_ts = _now_ts()
    expiry = req.delegation_context.expiry
    expiry_in_seconds: Optional[int] = None
    is_expired = False

    if expiry is not None:
        expiry_in_seconds = int(expiry) - now_ts
        is_expired = expiry_in_seconds <= 0

    scope_text = (req.delegation_context.scope or "").lower()
    scope_is_broad = any(k in scope_text for k in ["unlimited", "any", "all", "broad", "full"])

    warnings = list(req.safety_context.warnings or [])
    simulation_ok = req.safety_context.is_simulation_ok

    if is_expired:
        risk_level = "high"
    elif simulation_ok is False or warnings:
        risk_level = "high"
    elif scope_is_broad or (expiry_in_seconds is not None and expiry_in_seconds > 7 * 24 * 3600):
        risk_level = "medium"
    else:
        risk_level = "low"

    derived: Dict[str, Any] = {
        "nowTs": now_ts,
        "expiryTs": expiry,
        "expiryInSeconds": expiry_in_seconds,
        "isExpired": is_expired,
        "scopeIsBroad": scope_is_broad,
        "simulationOk": simulation_ok,
        "warningsCount": len(warnings),
        "riskLevel": risk_level,
        "functionsCount": len(req.delegation_context.functions or []),
    }

    if expiry_in_seconds is not None:
        derived["expiryInMinutes"] = round(expiry_in_seconds / 60.0, 2)
        derived["expiryInHours"] = round(expiry_in_seconds / 3600.0, 2)

    return derived


def _explain_7702(req: Tutor7702ExplainRequest, derived: Dict[str, Any]) -> TutorExplainResponse:
    risk_level = str(derived["riskLevel"])
    is_expired = bool(derived["isExpired"])
    scope_is_broad = bool(derived["scopeIsBroad"])

    if is_expired:
        summary = "这个 7702 授权已经过期（或即将过期），当前不应继续执行。"
    elif risk_level == "high":
        summary = "这个 7702 授权存在明显风险信号，建议先收敛权限或修复告警。"
    elif risk_level == "medium":
        summary = "这个 7702 授权能用，但权限或时长偏大，建议更精细化。"
    else:
        summary = "这个 7702 授权相对克制，适合作为教学示例。"

    bullets: List[str] = [
        "EIP-7702 的教学重点可以放在：‘把一次复杂操作压缩为更顺滑的用户体验，但必须明确权限边界’。",
        f"当前风险等级评估为 {risk_level}（基于 scope、expiry、simulation 与 warnings）。",
        (
            f"授权剩余时间约 {derived.get('expiryInHours')} 小时。"
            if derived.get("expiryInHours") is not None
            else "本次没有提供 expiry，前端应提醒用户授权的持续时间与撤销方式。"
        ),
    ]

    if scope_is_broad:
        bullets.append("scope 描述偏‘全权/无限制’，这是最值得在 UI 上高亮解释的风险点。")
    if (req.safety_context.warnings or []) and risk_level == "high":
        bullets.append("前端传入了 warnings，Tutor 应该逐条解释这些告警意味着什么。")

    next_steps: List[str] = []
    if is_expired:
        next_steps.append("重新生成一个更短期的授权（例如仅本次任务有效）。")
    else:
        if scope_is_broad:
            next_steps.append("把 scope 收敛为‘仅本次任务/仅这些函数/仅这些额度’。")
        if derived.get("expiryInHours") is None or float(derived.get("expiryInHours") or 0) > 24:
            next_steps.append("给授权加上明确的 expiry（例如 10 分钟或 1 小时）。")
        if req.safety_context.is_simulation_ok is False:
            next_steps.append("先修复 simulation 失败原因，再引导用户签名。")
        if req.safety_context.warnings:
            next_steps.append("把 warnings 作为可展开的‘风险解释卡片’，逐条说明影响与缓解办法。")

    if not next_steps:
        next_steps.append("在教学场景里，建议同时展示‘如何撤销授权/如何限制授权范围’的操作入口。")

    return TutorExplainResponse(
        summary=summary,
        bullets=bullets,
        nextSteps=next_steps,
        derived=derived,
        meta={"standard": "EIP-7702"},
    )


# ----------------------------
# Optional Spoon agent runtime
# ----------------------------


TUTOR_SYSTEM_PROMPT = (
    "You are a Tutor Agent embedded in a Web3 teaching game.\n"
    "- Your job is to explain the CURRENT action, not give generic theory.\n"
    "- Be concise, concrete, and tie explanations to provided numbers.\n"
    "- Prefer actionable advice over abstract definitions.\n"
)


class TutorAgent(SpoonReactAI):
    """
    Spoon agent with a tutor-specific prompt that survives prompt refreshes.

    SpoonReactAI rebuilds system prompts dynamically from tools, so we
    override _refresh_prompts to inject tutor instructions every run.
    """

    tutor_prompt: str = TUTOR_SYSTEM_PROMPT

    def _refresh_prompts(self) -> None:  # type: ignore[override]
        tool_list = self._build_tool_list()
        self.system_prompt = (
            f"{SYSTEM_PROMPT}\n\n"
            "Tutor instructions:\n"
            f"{self.tutor_prompt}\n\n"
            "Available tools:\n"
            f"{tool_list}"
        )
        self.next_step_prompt = NEXT_STEP_PROMPT_TEMPLATE.format(tool_list=tool_list)


def _has_any_llm_key() -> bool:
    key_envs = [
        "OPENAI_API_KEY",
        "ANTHROPIC_API_KEY",
        "DEEPSEEK_API_KEY",
        "GEMINI_API_KEY",
        "OPENROUTER_API_KEY",
    ]
    return any(os.getenv(k, "").strip() for k in key_envs)


@dataclass
class TutorAgentRuntime:
    agent: Optional[SpoonReactAI] = None
    agent_error: Optional[str] = None

    async def get_agent(self) -> Optional[SpoonReactAI]:
        if self.agent or self.agent_error:
            return self.agent

        if not _has_any_llm_key():
            self.agent_error = "No LLM API key detected; running in deterministic-only mode."
            return None

        try:
            provider = os.getenv("TUTOR_LLM_PROVIDER", "").strip() or None
            chatbot = ChatBot(llm_provider=provider) if provider else ChatBot()
            agent = TutorAgent(
                name="tutor_agent",
                description="Teaching-focused tutor agent",
                available_tools=ToolManager([]),
                llm=chatbot,
                x402_enabled=False,
            )
            await agent.initialize()
            self.agent = agent
        except Exception as exc:  # pragma: no cover - defensive fallback
            self.agent_error = f"Failed to initialize tutor agent: {exc}"
            self.agent = None

        return self.agent

    async def tutor_note(self, standard: str, payload: Dict[str, Any]) -> Optional[str]:
        agent = await self.get_agent()
        if not agent:
            return None

        # Keep server responses stateless: clear previous conversation context.
        agent.memory.clear()

        prompt = (
            f"You are helping explain {standard} inside a teaching game.\n"
            "Write 1 short paragraph that references the numbers and ends with 1 actionable suggestion.\n\n"
            f"Context JSON:\n{json.dumps(payload, ensure_ascii=False)}"
        )

        try:
            note = await agent.run(prompt)
        except Exception:
            return None

        return note.strip() if isinstance(note, str) else None


runtime = TutorAgentRuntime()


# ----------------------------
# FastAPI app and endpoints
# ----------------------------


app = FastAPI(title="Spoon Tutor Service", version="0.1.0")


def _configure_cors(application: FastAPI) -> None:
    raw_origins = os.getenv("TUTOR_CORS_ORIGINS", "*")
    origins = [o.strip() for o in raw_origins.split(",") if o.strip()] or ["*"]
    allow_credentials = origins != ["*"]

    application.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=allow_credentials,
        allow_methods=["*"],
        allow_headers=["*"],
    )


_configure_cors(app)


@app.get("/health")
def health() -> Dict[str, Any]:
    return {"ok": True, "service": "spoon-tutor", "time": datetime.utcnow().isoformat()}


@app.post("/tutor/1559/explain", response_model=TutorExplainResponse)
async def tutor_1559_explain(req: Tutor1559ExplainRequest) -> TutorExplainResponse:
    derived = compute_eip1559_derived(req)
    response = _explain_1559(req, derived)

    payload = {
        "standard": "EIP-1559",
        "inputs": req.model_dump(by_alias=True),
        "derived": derived,
        "responseDraft": response.model_dump(by_alias=True),
    }
    note = await runtime.tutor_note("EIP-1559", payload)
    if note:
        response.bullets.append(f"Tutor Agent 补充：{note}")
        response.meta["agentNoteAdded"] = True
    else:
        response.meta["agentNoteAdded"] = False
        if runtime.agent_error:
            response.meta["agentError"] = runtime.agent_error

    return response


@app.post("/tutor/7702/explain", response_model=TutorExplainResponse)
async def tutor_7702_explain(req: Tutor7702ExplainRequest) -> TutorExplainResponse:
    derived = _derive_7702(req)
    response = _explain_7702(req, derived)

    payload = {
        "standard": "EIP-7702",
        "inputs": req.model_dump(by_alias=True),
        "derived": derived,
        "responseDraft": response.model_dump(by_alias=True),
    }
    note = await runtime.tutor_note("EIP-7702", payload)
    if note:
        response.bullets.append(f"Tutor Agent 补充：{note}")
        response.meta["agentNoteAdded"] = True
    else:
        response.meta["agentNoteAdded"] = False
        if runtime.agent_error:
            response.meta["agentError"] = runtime.agent_error

    return response
