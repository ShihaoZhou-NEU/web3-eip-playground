# Tutor Service (Hackathon Demo)

This is a minimal Spoon-powered Tutor service intended for a 3-day demo.

It exposes:
- `GET /health`
- `POST /tutor/1559/explain`
- `POST /tutor/7702/explain`

The service is implemented in `spoon_ai/tutor/service.py` and started via
`examples/tutor_service.py`.

## 1) Run It

From the repo root:

```bash
python -m examples.tutor_service
```

By default it listens on `0.0.0.0:8009`.

## 2) Environment Variables

These are optional but useful:

- `OPENAI_API_KEY=sk-proj-REPLACE_ME`
  - If present, the Tutor Agent will add a short extra note.
  - If missing, the service still works in deterministic mode.
- `TUTOR_LLM_PROVIDER=openai`
  - Provider name for `ChatBot(...)`.
- `TUTOR_CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000`
  - Comma-separated list.
  - Use `*` to allow all origins (default).
- `TUTOR_HOST=0.0.0.0`
- `TUTOR_PORT=8009`
- `TUTOR_RELOAD=1`

## 2.1 Stateless Chat (Frontend Responsibility)

The service is **stateless** and does not store conversation history. If you
want continuous dialogue, the frontend should send the full conversation (or a
compressed summary) in `userInput` on every request. The backend will only use
`userInput` for the optional tutor agent note.

## 3) Frontend Contract (Stable JSON Shapes)

### 3.1 EIP-1559 Explain

Endpoint:

- `POST /tutor/1559/explain`

Example request:

```json
{
  "chainId": 1, 
  "baseFeePerGasGwei": 32.5,
  "maxFeePerGasGwei": 60,
  "maxPriorityFeePerGasGwei": 2,
  "gasLimit": 21000,
  "userInput": "我想快一点但别太贵",
  "valueEth": 0.01,
  "userIntent": "fast but not too expensive",
  "txContext": {
    "to": "0xabc...",
    "valueEth": 0.01
  }
}
```

Example response shape:

```json
{
  "summary": "...",
  "bullets": ["...", "..."],
  "nextSteps": ["...", "..."],
  "derived": {
    "inclusionLikely": true,
    "effectiveGasPriceGwei": 34.5,
    "effectivePriorityFeeGwei": 2,
    "priorityFeeCapGwei": 27.5,
    "tipIsCapped": false,
    "maxBaseFeeSupportedGwei": 58,
    "baseFeeBufferGwei": 25.5,
    "maxFeeMinusBaseFeeGwei": 27.5,
    "expectedFeeEth": 0.0007245,
    "worstCaseFeeEth": 0.00126,
    "burnedBaseFeeEth": 0.0006825,
    "priorityFeeEth": 0.000042,
    "gasLimit": 21000
  },
  "meta": {
    "standard": "EIP-1559",
    "agentNoteAdded": false
  }
}
```

### 3.2 EIP-7702 Explain

Endpoint:

- `POST /tutor/7702/explain`

Example request:

```json
{
  "chainId": 1,
  "userInput": "帮我解释下这个授权能不能用",
  "userIntent": "one-click flow",
  "delegationContext": {
    "delegate": "0xDelegate",
    "scope": "only this task",
    "expiry": 1738000000,
    "functions": ["swapExactTokensForTokens"]
  },
  "safetyContext": {
    "isSimulationOk": true,
    "warnings": []
  }
}
```

## 4) Networking Notes (Most Common Demo Pitfall)

If the frontend runs on a different machine:

1. Keep `TUTOR_HOST=0.0.0.0`.
2. Find your laptop IP on the same network.
3. Frontend should call `http://<your-ip>:8009/...`.
4. Set:
   - `TUTOR_CORS_ORIGINS=http://<frontend-host>:<port>`

For quick public demos, you can also tunnel the service (for example, with a
TCP/HTTP tunnel) and point the frontend at the tunnel URL.
