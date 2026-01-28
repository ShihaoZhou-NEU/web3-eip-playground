# Local Run Guide

This document explains how to run the project locally and how to test the
Tutor service endpoints.

## 1) Prerequisites

- Python 3.12+ (required by `pyproject.toml`)
- macOS / Linux / Windows terminal

Check your version:

```bash
python3 --version
```

## 2) Create venv & install dependencies

From the repo root:

```bash
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install -U pip
pip install -r requirements.txt
```

## 3) Run Tutor service

```bash
python -m examples.tutor_service
```

Default address: `http://127.0.0.1:8009`

Optional environment variables:

- `OPENAI_API_KEY=...` (or other provider keys)
- `TUTOR_LLM_PROVIDER=openai`
- `TUTOR_HOST=0.0.0.0`
- `TUTOR_PORT=8009`
- `TUTOR_RELOAD=1`

## 4) Swagger UI testing

Open:

```
http://127.0.0.1:8009/docs
```

Then test:

- `GET /health`
- `POST /tutor/1559/explain`
- `POST /tutor/7702/explain`

Example `POST /tutor/1559/explain` body:

```json
{
  "baseFeePerGasGwei": 32.5,
  "maxFeePerGasGwei": 60,
  "maxPriorityFeePerGasGwei": 2,
  "gasLimit": 21000,
  "userInput": "我想快一点但别太贵",
  "txContext": {
    "to": "0xabc0000000000000000000000000000000000000",
    "valueEth": 0.01
  }
}
```

Example `POST /tutor/7702/explain` body:

```json
{
  "delegationContext": {
    "delegate": "0xdef0000000000000000000000000000000000000",
    "scope": "only this task",
    "expiry": 1893456000,
    "functions": ["swapExactTokensForTokens"],
    "limits": {"maxValueEth": 0.1}
  },
  "safetyContext": {
    "isSimulationOk": true,
    "warnings": []
  },
  "userInput": "我希望一次授权完成交换，安全吗？"
}
```

## 5) Notes

- The Tutor service is stateless. If you need full dialogue context, send it in
  `userInput` on every request.
- If you only want deterministic responses, skip API keys.
