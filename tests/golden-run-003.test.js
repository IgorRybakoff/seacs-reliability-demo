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
  assert.equal(r.disposition,"LIMIT");
  assert.equal(r.outcome,"SUCCESS");
  assert.equal(r.verification,"PASS");
});

test("fault dispositions match the Golden Run 003 policy outcomes",()=> {
  const cases={
    TOOL_TIMEOUT:["BLOCK","CONTAINED"],
    CONFLICTING_EVIDENCE:["BLOCK","CONTAINED"],
    STALE_EVIDENCE:["BLOCK","CONTAINED"],
    PARTIAL_TOOL_SUCCESS:["HUMAN_REVIEW","ESCALATED"],
    RECOVERY_AFTER_FAILURE:["LIMIT","SUCCESS"]
  };
  for(const r of runGoldenRun003().filter(x=>x.scenario in cases)) {
    assert.deepEqual([r.disposition,r.outcome],cases[r.scenario]);
    assert.equal(r.externalActionExecuted,false);
  }
});

test("static demo displays exactly the frozen public fixture",async()=> {
  const html=await readFile(new URL("../index.html",import.meta.url),"utf8");
  const match=html.match(/const data=(\[[^;]+\]);/);
  assert.ok(match,"static data array is present");
  assert.deepEqual(JSON.parse(match[1]),runGoldenRun003());
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
