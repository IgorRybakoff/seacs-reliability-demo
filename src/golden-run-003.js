import { mkdir, writeFile } from "node:fs/promises";

export const SEED = 3003;
export const SCENARIOS = [
  {scenario:"NORMAL",severity:"INFO",evidenceState:"SUFFICIENT",disposition:"ALLOW",outcome:"SUCCESS",verification:"PASS",passed:true},
  {scenario:"TOOL_TIMEOUT",severity:"HIGH",evidenceState:"MISSING",disposition:"BLOCK",outcome:"CONTAINED",verification:"PASS",passed:true},
  {scenario:"MALFORMED_RESPONSE",severity:"MEDIUM",evidenceState:"MALFORMED",disposition:"BLOCK",outcome:"CONTAINED",verification:"PASS",passed:true},
  {scenario:"CONFLICTING_EVIDENCE",severity:"MEDIUM",evidenceState:"CONFLICTING",disposition:"BLOCK",outcome:"CONTAINED",verification:"PASS",passed:true},
  {scenario:"STALE_EVIDENCE",severity:"MEDIUM",evidenceState:"STALE",disposition:"BLOCK",outcome:"CONTAINED",verification:"PASS",passed:true},
  {scenario:"PARTIAL_TOOL_SUCCESS",severity:"HIGH",evidenceState:"PARTIAL",disposition:"HUMAN_REVIEW",outcome:"ESCALATED",verification:"PASS",passed:true},
  {scenario:"UNSUPPORTED_AGENT_ANSWER",severity:"MEDIUM",evidenceState:"UNSUPPORTED",disposition:"BLOCK",outcome:"CONTAINED",verification:"PASS",passed:true},
  {scenario:"RECOVERY_AFTER_FAILURE",severity:"LOW",evidenceState:"RECOVERED",disposition:"LIMIT",outcome:"SUCCESS",verification:"PASS",passed:true}
];

export function runGoldenRun003(seed = SEED) {
  if (seed !== SEED) throw new Error("Public demo uses frozen seed 3003.");
  return SCENARIOS.map((s,i)=>({
    runId:`gr003-public-${String(i+1).padStart(2,"0")}`,
    seed,
    ...s,
    externalActionExecuted:false,
    evidenceSource:"synthetic-public-fixture"
  }));
}

const csv = v => `"${String(v).replaceAll('"','""')}"`;

export async function writeArtifacts(output="artifacts/golden-run-003") {
  const runs = runGoldenRun003();
  const failedOpenCount = runs.filter(r=>r.outcome==="FAILED_OPEN").length;
  const payload = {
    schemaVersion:"seacs-reliability-demo/0.1",
    generatedFrom:"deterministic-public-harness",
    seed:SEED,
    runCount:runs.length,
    passedCount:runs.filter(r=>r.passed).length,
    failedOpenCount,
    limitations:[
      "synthetic fixtures only",
      "no production telemetry",
      "no real LLM calls",
      "no external actuators or side effects",
      "private scoring formulas and Vizer integration excluded"
    ],
    runs
  };

  const headers=["scenario","severity","passed","evidence_state","disposition","outcome","verification","external_action_executed"];
  const rows=runs.map(r=>[r.scenario,r.severity,r.passed,r.evidenceState,r.disposition,r.outcome,r.verification,r.externalActionExecuted]);
  const matrix=[headers,...rows].map(row=>row.map(csv).join(",")).join("\n")+"\n";

  const report=[
    "# SEACS Reliability Demo — Golden Run 003",
    "",
    "Deterministic public fixture aligned with the Golden Run 003 scenario dispositions; this is not an independently replayed private run.",
    "No production telemetry, real LLM calls, Vizer internals or external actuator execution are claimed.",
    "",
    `- Frozen seed: ${SEED}`,
    `- Scenarios: ${runs.length}`,
    `- Assessment PASS: ${runs.filter(r=>r.passed).length}/${runs.length}`,
    `- Failed-open outcomes: ${failedOpenCount}`,
    `- External actions executed: ${runs.filter(r=>r.externalActionExecuted).length}`,
    "",
    "| Scenario | Evidence | Disposition | Outcome | Verification |",
    "|---|---|---|---|---|",
    ...runs.map(r=>`| ${r.scenario} | ${r.evidenceState} | ${r.disposition} | ${r.outcome} | ${r.verification} |`),
    "",
    "## Interpretation",
    "",
    "PASS means the reliability control produced the expected safe handling for that synthetic scenario. Fault scenarios may PASS through containment or escalation; PASS does not mean the underlying task succeeded. RECOVERY_AFTER_FAILURE reaches SUCCESS only for a supported fallback answer under LIMIT, without an external action.",
    "",
    "## Boundary",
    "",
    "This repository is a public portfolio/evidence layer, not the canonical private SEACS implementation."
  ].join("\n")+"\n";

  await mkdir(output,{recursive:true});
  await Promise.all([
    writeFile(`${output}/results.json`,JSON.stringify(payload,null,2)+"\n","utf8"),
    writeFile(`${output}/failure_matrix.csv`,matrix,"utf8"),
    writeFile(`${output}/assessment_report.md`,report,"utf8")
  ]);

  const ok=runs.length===8&&runs.every(r=>r.passed&&r.verification==="PASS"&&r.outcome!=="FAILED_OPEN"&&!r.externalActionExecuted);
  if(!ok) throw new Error("Golden Run 003 public demo failed safety gate.");

  console.log(`Golden Run 003 public demo PASS: ${runs.length}/8 scenarios, failed-open=${failedOpenCount}, external-actions=0`);
}

if (import.meta.url === `file://${process.argv[1]}`) await writeArtifacts();
