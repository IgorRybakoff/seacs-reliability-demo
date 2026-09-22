# Public Architecture Boundary

The public demo exposes only the evaluation contract:

`Synthetic scenario → Evidence state → Protective disposition → Workflow outcome → Verification → Artifact`

Public invariants:

- seed 3003
- exactly 8 scenarios
- no FAILED_OPEN outcome
- no external action execution
- unsafe evidence classes cannot become ordinary SUCCESS
- recovery is explicit as RECOVERED
- artifacts are deterministic UTF-8 text

Private implementation, scoring formulas and Vizer integration are intentionally excluded.
