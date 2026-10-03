#!/usr/bin/env node
// Time each method and print a receipt. Run: npm run bench > docs/runs/<date>-methods.txt
// Median of RUNS timed calls after WARM untimed ones. recursive runs at n = 30
// only (2^n calls). memoized is timed after its table is built, so it is a lookup.

const os = require('node:os');
const F = require('./fibonacci.js');

const WARM = 5;
const RUNS = 25;
const CASES = [
  [30, ['recursive', 'iterative', 'fastDoubling', 'memoized']],
  [1000, ['iterative', 'fastDoubling', 'memoized']],
  [10000, ['iterative', 'fastDoubling', 'memoized']],
];

function median(xs) {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

console.log(`date ${new Date().toISOString().slice(0, 10)}`);
console.log(`node ${process.version} · ${os.platform()} ${os.arch()} · ${os.cpus()[0].model}`);
console.log(`median of ${RUNS} runs after ${WARM} warm-up runs; times in ms`);
for (const [n, methods] of CASES) {
  const want = F.iterative(n);
  for (const m of methods) {
    for (let i = 0; i < WARM; i++) F[m](n);
    const times = [];
    for (let i = 0; i < RUNS; i++) {
      const t0 = process.hrtime.bigint();
      const v = F[m](n);
      times.push(Number(process.hrtime.bigint() - t0) / 1e6);
      if (v !== want) throw new Error(`${m}(${n}) disagrees with iterative`);
    }
    console.log(`n=${n} ${m} ${median(times).toFixed(4)}`);
  }
}
