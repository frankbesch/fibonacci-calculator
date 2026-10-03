/**
 * Fibonacci core: exact results at any position, using BigInt.
 *
 * JavaScript numbers are exact only up to 2^53, so F(79) and beyond come out
 * wrong as Numbers (F(79) = 14472334024676221, not ...220). Every method here
 * returns a BigInt. Positions are plain integers (a Number, a BigInt, or a
 * digit string); values to test are Numbers, BigInts, or digit strings.
 *
 * Loads as a browser script (window.FibonacciCalculator) and as a Node module.
 */
(function (root) {
  'use strict';

  /** A position n >= 0 as a Number. Throws on anything else. */
  function position(n) {
    const v = typeof n === 'string' && /^\s*-?\d+\s*$/.test(n) ? Number(n) : typeof n === 'bigint' ? Number(n) : n;
    if (typeof v !== 'number' || !Number.isInteger(v)) throw new Error('Position must be a whole number');
    if (v < 0) throw new Error('Fibonacci sequence is not defined for negative numbers');
    return v;
  }

  /** A value as a BigInt, or null when it is not a whole number. */
  function whole(x) {
    if (typeof x === 'bigint') return x;
    if (typeof x === 'number') return Number.isSafeInteger(x) ? BigInt(x) : null;
    if (typeof x === 'string' && /^\s*-?\d+\s*$/.test(x)) return BigInt(x.trim());
    return null;
  }

  /** Integer square root of a BigInt >= 0 (Newton's method). */
  function isqrt(v) {
    if (v < 2n) return v;
    let x = 1n << BigInt(Math.ceil(v.toString(2).length / 2));  // a start at or above the root
    for (;;) {
      const y = (x + v / x) >> 1n;
      if (y >= x) return x;
      x = y;
    }
  }

  const cache = [0n, 1n];  // memoized values, shared across calls

  class FibonacciCalculator {
    /** O(n) additions, O(1) space. The default method. */
    static iterative(n) {
      const k = position(n);
      let a = 0n, b = 1n;
      for (let i = 0; i < k; i++) [a, b] = [b, a + b];
      return a;
    }

    /** O(2^n) calls: the textbook definition, for small n only. */
    static recursive(n) {
      const k = position(n);
      return k <= 1 ? BigInt(k) : FibonacciCalculator.recursive(k - 1) + FibonacciCalculator.recursive(k - 2);
    }

    /** O(n) once, then a lookup: extends a shared table, so no deep recursion. */
    static memoized(n) {
      const k = position(n);
      while (cache.length <= k) cache.push(cache[cache.length - 1] + cache[cache.length - 2]);
      return cache[k];
    }

    /** Old spelling, kept so existing callers still work. */
    static memorized(n) {
      return FibonacciCalculator.memoized(n);
    }

    /** O(log n) multiplications: F(2k) = F(k)(2F(k+1) - F(k)), F(2k+1) = F(k)^2 + F(k+1)^2. */
    static fastDoubling(n) {
      const k = position(n);
      let a = 0n, b = 1n;  // F(m), F(m+1), walking the bits of k from the top
      for (let bit = Math.floor(Math.log2(k || 1)); k > 0 && bit >= 0; bit--) {
        const c = a * (2n * b - a);
        const d = a * a + b * b;
        if (Math.floor(k / 2 ** bit) % 2) [a, b] = [d, c + d];
        else [a, b] = [c, d];
      }
      return a;
    }

    /** The first `count` terms, F(0) to F(count - 1). */
    static sequence(count) {
      const k = position(count);
      const out = [];
      let a = 0n, b = 1n;
      for (let i = 0; i < k; i++) {
        out.push(a);
        [a, b] = [b, a + b];
      }
      return out;
    }

    /** True when x is a perfect square. */
    static isPerfectSquare(x) {
      const v = whole(x);
      if (v === null || v < 0n) return false;
      const r = isqrt(v);
      return r * r === v;
    }

    /** True when x is a Fibonacci number: 5x^2 + 4 or 5x^2 - 4 is a perfect square. */
    static isFibonacci(x) {
      const v = whole(x);
      if (v === null || v < 0n) return false;
      const s = 5n * v * v;
      return FibonacciCalculator.isPerfectSquare(s + 4n) || FibonacciCalculator.isPerfectSquare(s - 4n);
    }

    /** The position of x in the sequence, or null. 1 returns 1 (F(1) = F(2) = 1). */
    static findPosition(x) {
      if (!FibonacciCalculator.isFibonacci(x)) return null;
      const v = whole(x);
      let a = 0n, b = 1n, i = 0;
      while (a < v) {
        [a, b] = [b, a + b];
        i++;
      }
      return a === v ? i : null;
    }

    /** F(n) / F(n - 1) as a Number, for n >= 2. Stays finite for large n. */
    static goldenRatio(n) {
      const k = position(n);
      if (k < 2) throw new Error('Golden ratio needs a position of 2 or more');
      const scale = 10n ** 15n;
      const q = (FibonacciCalculator.iterative(k) * scale) / FibonacciCalculator.iterative(k - 1);
      return Number(q) / 1e15;
    }

    /** A value with thousands separators, for display. */
    static format(x) {
      return BigInt(x).toLocaleString('en-US');
    }
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = FibonacciCalculator;
  if (root) root.FibonacciCalculator = FibonacciCalculator;
})(typeof window !== 'undefined' ? window : null);
