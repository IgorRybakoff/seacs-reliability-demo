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

The fixtures represent expected public scenario dispositions, not a replay of the private controller. In the Golden Run 003 harness, conflicting evidence is BLOCK / CONTAINED; partial tool success is HUMAN_REVIEW / ESCALATED; supported fallback recovery is LIMIT / SUCCESS. SUCCESS refers to the supported answer and no external action is executed.

Private implementation, scoring formulas and Vizer integration are intentionally excluded.
