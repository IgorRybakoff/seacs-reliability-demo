# SEACS Reliability Demo — Golden Run 003

Deterministic public engineering demonstration derived from validated Golden Run 003 behavior.

No production telemetry, real LLM calls, Vizer internals or external actuator execution are claimed.

- Frozen seed: 3003
- Scenarios: 8
- Assessment PASS: 8/8
- Failed-open outcomes: 0
- External actions executed: 0

| Scenario | Evidence | Disposition | Outcome | Verification |
|---|---|---|---|---|
| NORMAL | SUFFICIENT | ALLOW | SUCCESS | PASS |
| TOOL_TIMEOUT | MISSING | SAFE_HOLD | CONTAINED | PASS |
| MALFORMED_RESPONSE | MALFORMED | BLOCK | CONTAINED | PASS |
| CONFLICTING_EVIDENCE | CONFLICTING | HUMAN_REVIEW | ESCALATED | PASS |
| STALE_EVIDENCE | STALE | SAFE_HOLD | CONTAINED | PASS |
| PARTIAL_TOOL_SUCCESS | PARTIAL | LIMIT | CONTAINED | PASS |
| UNSUPPORTED_AGENT_ANSWER | UNSUPPORTED | BLOCK | CONTAINED | PASS |
| RECOVERY_AFTER_FAILURE | RECOVERED | ALLOW | SUCCESS | PASS |

## Interpretation

PASS means the reliability control produced the expected safe handling for that synthetic scenario. Fault scenarios may PASS through containment or escalation; PASS does not mean the underlying task succeeded.

## Boundary

This repository is a public portfolio/evidence layer, not the canonical private SEACS implementation.
