# SEACS Reliability Demo

**Evidence-first reliability evaluation for AI/agent workflows.**

This public repository is a deliberately limited showcase of one SEACS evaluation pattern:

**failure scenario → control decision → verification → evidence artifact**

It is designed for AI evaluation, error-analysis and reliability reviewers who want a small reproducible artifact instead of a slide-only claim.

## What problem does this demonstrate?

Agentic systems can fail in ways that look superficially successful: a tool times out, evidence is stale or conflicting, only part of a toolchain succeeds, or an agent produces an answer unsupported by available evidence.

This demo checks whether the reliability layer **contains, limits, escalates or blocks unsafe states instead of silently treating them as success**.

## Golden Run 003

Frozen public seed: **3003**

Eight synthetic scenarios are covered:

- NORMAL
- TOOL_TIMEOUT
- MALFORMED_RESPONSE
- CONFLICTING_EVIDENCE
- STALE_EVIDENCE
- PARTIAL_TOOL_SUCCESS
- UNSUPPORTED_AGENT_ANSWER
- RECOVERY_AFTER_FAILURE

Validated public result:

- **8/8 reliability assessments PASS**
- **0 failed-open outcomes**
- **0 external actions executed**
- fault scenarios may PASS by containment or escalation; PASS does **not** imply task success
- generated JSON/CSV/report artifacts are byte-stable across repeated runs

## Reproduce

Requires Node.js 20+.

```bash
npm test
npm run build
npm run reliability:golden
```

Artifacts:

- `artifacts/golden-run-003/results.json`
- `artifacts/golden-run-003/failure_matrix.csv`
- `artifacts/golden-run-003/assessment_report.md`

## Demo UI

**Live demo:** https://igorrybakoff.github.io/seacs-reliability-demo/

The page is static, makes no backend calls, and cannot trigger external actions.

## Evidence boundary

This repository is **not** the canonical SEACS implementation.

It intentionally excludes private SEACS source, internal scoring formulas, Vizer integration/contracts, credentials, provider configuration, production transport, production telemetry, real LLM/API calls and external actuators.

The public scenarios are synthetic deterministic engineering evidence. They demonstrate reproducibility and failure-handling semantics, not production performance.

## Author

**Igor Rybakoff**  
AI R&D · Evaluation · Verification · Reliable AI Systems  
GitHub: https://github.com/IgorRybakoff  
LinkedIn: https://www.linkedin.com/in/igor-rybakoff-46044a401/

Open to AI evaluation, reliability, error-analysis and research-engineering opportunities.
