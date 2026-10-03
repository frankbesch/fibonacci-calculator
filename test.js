// Tests for the Fibonacci core. Run: npm test (node --test).
// Reference values were computed independently in Python, whose integers are
// exact at any size: F(79), F(100), and the 209 digits of F(1000).

const test = require('node:test');
const assert = require('node:assert/strict');
const F = require('./fibonacci.js');

const FIRST = [0n, 1n, 1n, 2n, 3n, 5n, 8n, 13n, 21n, 34n, 55n, 89n, 144n, 233n, 377n, 610n, 987n, 1597n, 2584n, 4181n, 6765n];
const F79 = 14472334024676221n;   // first value a JS Number gets wrong
const F100 = 354224848179261915075n;
const F1000_HEAD = '43466557686937456435';
const F1000_TAIL = '6849228875';
const METHODS = ['iterative', 'memoized', 'fastDoubling'];

test('every method returns F(0) to F(20)', () => {
  for (const m of [...METHODS, 'recursive']) {
    FIRST.forEach((want, n) => assert.equal(F[m](n), want, `${m}(${n})`));
  }
});

test('exact past 2^53: F(79), F(100), F(1000)', () => {
  for (const m of METHODS) {
    assert.equal(F[m](79), F79, m);
    assert.equal(F[m](100), F100, m);
    const s = F[m](1000).toString();
    assert.equal(s.length, 209, `${m} F(1000) digits`);
    assert.ok(s.startsWith(F1000_HEAD) && s.endsWith(F1000_TAIL), `${m} F(1000) digits`);
  }
});

test('methods agree to n = 90 and at 4097', () => {
  for (let n = 0; n <= 90; n++) {
    const want = F.iterative(n);
    for (const m of METHODS) assert.equal(F[m](n), want, `${m}(${n})`);
  }
  assert.equal(F.fastDoubling(4097), F.iterative(4097));
});

test('memorized is kept as an alias', () => {
  assert.equal(F.memorized(30), 832040n);
});

test('positions: strings and BigInts accepted; bad input throws', () => {
  assert.equal(F.iterative('10'), 55n);
  assert.equal(F.iterative(10n), 55n);
  for (const bad of [-1, -10, 1.5, 'x', null]) {
    assert.throws(() => F.iterative(bad), Error);
    assert.throws(() => F.memoized(bad), Error);
  }
});

test('sequence returns the first n terms', () => {
  assert.deepEqual(F.sequence(0), []);
  assert.deepEqual(F.sequence(1), [0n]);
  assert.deepEqual(F.sequence(10), FIRST.slice(0, 10));
  assert.equal(F.sequence(101)[100], F100);
  assert.throws(() => F.sequence(-1), Error);
});

test('isFibonacci and findPosition, including past 2^53', () => {
  for (const [n, v] of FIRST.entries()) {
    assert.ok(F.isFibonacci(v), `F(${n})`);
    if (v !== 1n) assert.equal(F.findPosition(v), n);  // 1 is F(1) and F(2)
  }
  assert.equal(F.findPosition(1), 1);
  for (const v of [4, 6, 7, 9, 10, 100, 1000]) assert.equal(F.isFibonacci(v), false, String(v));
  assert.equal(F.isFibonacci(F100), true);
  assert.equal(F.isFibonacci(F100 + 1n), false);
  assert.equal(F.isFibonacci(F100.toString()), true);
  assert.equal(F.findPosition(F100.toString()), 100);
  assert.equal(F.isFibonacci(-1), false);
  assert.equal(F.findPosition(-10), null);
});

test('isPerfectSquare', () => {
  for (const v of [0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100]) assert.ok(F.isPerfectSquare(v), String(v));
  for (const v of [2, 3, 5, 6, 7, 8, 10]) assert.equal(F.isPerfectSquare(v), false, String(v));
  assert.ok(F.isPerfectSquare(F100 * F100));
  assert.equal(F.isPerfectSquare(F100 * F100 + 1n), false);
});

test('goldenRatio approaches phi and stays finite for large n', () => {
  const phi = (1 + Math.sqrt(5)) / 2;
  assert.ok(Math.abs(F.goldenRatio(2) - 1) < 1e-12);
  assert.ok(Math.abs(F.goldenRatio(3) - 2) < 1e-12);
  assert.ok(Math.abs(F.goldenRatio(10) - phi) < 0.01);
  assert.ok(Math.abs(F.goldenRatio(30) - phi) < 1e-9);
  assert.ok(Math.abs(F.goldenRatio(2000) - phi) < 1e-12);
  for (const bad of [0, 1, -1]) assert.throws(() => F.goldenRatio(bad), Error);
});

test('format adds thousands separators', () => {
  assert.equal(F.format(F100), '354,224,848,179,261,915,075');
});

test('F(10000) takes under a second', () => {
  const t0 = process.hrtime.bigint();
  const v = F.iterative(10000);
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  assert.equal(v.toString().length, 2090);
  assert.ok(ms < 1000, `${ms} ms`);
});
