import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runGoldenRun003, writeArtifacts } from "../src/golden-run-003.js";

test("frozen run is deterministic and covers 8 scenarios",()=> {
  assert.deepEqual(runGoldenRun003(3003),runGoldenRun003(3003));
  assert.equal(runGoldenRun003(3003).length,8);
});

test("unsafe evidence never becomes ordinary success",()=> {
  const unsafe=new Set(["STALE_EVIDENCE","PARTIAL_TOOL_SUCCESS","UNSUPPORTED_AGENT_ANSWER"]);
  for(const r of runGoldenRun003().filter(x=>unsafe.has(x.scenario))) {
    assert.notEqual(r.outcome,"SUCCESS");
    assert.equal(r.verification,"PASS");
    assert.equal(r.externalActionExecuted,false);
  }
});

test("recovery is explicit and verified",()=> {
  const r=runGoldenRun003().find(x=>x.scenario==="RECOVERY_AFTER_FAILURE");
  assert.equal(r.evidenceState,"RECOVERED");
  assert.equal(r.outcome,"SUCCESS");
  assert.equal(r.verification,"PASS");
});

test("artifacts are byte-stable",async()=> {
  const d=await mkdtemp(join(tmpdir(),"seacs-demo-"));
  try {
    await writeArtifacts(d);
    const names=["results.json","failure_matrix.csv","assessment_report.md"];
    const a=await Promise.all(names.map(n=>readFile(join(d,n),"utf8")));
    await writeArtifacts(d);
    const b=await Promise.all(names.map(n=>readFile(join(d,n),"utf8")));
    assert.deepEqual(a,b);
    const p=JSON.parse(a[0]);
    assert.equal(p.runCount,8);
    assert.equal(p.passedCount,8);
    assert.equal(p.failedOpenCount,0);
  } finally {
    await rm(d,{recursive:true,force:true});
  }
});
