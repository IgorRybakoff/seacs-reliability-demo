import { readFile } from "node:fs/promises";

for (const f of ["README.md","index.html","src/golden-run-003.js","tests/golden-run-003.test.js"]) {
  const s = await readFile(f, "utf8");
  if (!s.trim()) throw new Error(`Empty required file: ${f}`);
}

console.log("Build check PASS: public demo files are present and UTF-8 readable.");
