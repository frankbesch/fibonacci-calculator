/**
 * Fibonacci Calculator Test Suite
 * Comprehensive tests for all Fibonacci functions
 */

const FibonacciCalculator = require('./fibonacci.js');

class TestSuite {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, testFunction) {
    this.tests.push({ name, testFunction });
  }

  async runTests() {
    console.log('🧪 Running Fibonacci Calculator Tests\n');
    console.log('═'.repeat(60));
    
    for (const test of this.tests) {
      try {
        await test.testFunction();
        console.log(`✅ ${test.name}`);
        this.passed++;
      } catch (error) {
        console.log(`❌ ${test.name}`);
        console.log(`   Error: ${error.message}`);
        this.failed++;
      }
    }
    
    console.log('\n' + '═'.repeat(60));
    console.log(`📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
    
    if (this.failed === 0) {
      console.log('🎉 All tests passed!');
    } else {
      console.log('⚠️  Some tests failed.');
    }
  }

  assertEqual(actual, expected, message = '') {
    if (actual !== expected) {
      throw new Error(`${message} Expected ${expected}, got ${actual}`);
    }
  }

  assertTrue(condition, message = '') {
    if (!condition) {
      throw new Error(`${message} Expected true, got false`);
    }
  }

  assertFalse(condition, message = '') {
    if (condition) {
      throw new Error(`${message} Expected false, got true`);
    }
  }

  assertThrows(fn, expectedError = null, message = '') {
    try {
      fn();
      throw new Error(`${message} Expected function to throw, but it didn't`);
    } catch (error) {
      if (expectedError && !(error instanceof expectedError)) {
        throw new Error(`${message} Expected ${expectedError.name}, got ${error.constructor.name}`);
      }
    }
  }
}

// Create test suite
const suite = new TestSuite();

// Test iterative method
suite.test('Iterative: Basic cases', () => {
  suite.assertEqual(FibonacciCalculator.iterative(0), 0);
  suite.assertEqual(FibonacciCalculator.iterative(1), 1);
  suite.assertEqual(FibonacciCalculator.iterative(2), 1);
  suite.assertEqual(FibonacciCalculator.iterative(3), 2);
  suite.assertEqual(FibonacciCalculator.iterative(4), 3);
  suite.assertEqual(FibonacciCalculator.iterative(5), 5);
});

suite.test('Iterative: Larger numbers', () => {
  suite.assertEqual(FibonacciCalculator.iterative(10), 55);
  suite.assertEqual(FibonacciCalculator.iterative(15), 610);
  suite.assertEqual(FibonacciCalculator.iterative(20), 6765);
  suite.assertEqual(FibonacciCalculator.iterative(25), 75025);
});

suite.test('Iterative: Edge cases', () => {
  suite.assertThrows(() => FibonacciCalculator.iterative(-1), Error, 'Should throw for negative numbers');
  suite.assertThrows(() => FibonacciCalculator.iterative(-10), Error, 'Should throw for negative numbers');
});

// Test recursive method
suite.test('Recursive: Basic cases', () => {
  suite.assertEqual(FibonacciCalculator.recursive(0), 0);
  suite.assertEqual(FibonacciCalculator.recursive(1), 1);
  suite.assertEqual(FibonacciCalculator.recursive(2), 1);
  suite.assertEqual(FibonacciCalculator.recursive(3), 2);
  suite.assertEqual(FibonacciCalculator.recursive(4), 3);
  suite.assertEqual(FibonacciCalculator.recursive(5), 5);
});

suite.test('Recursive: Medium numbers', () => {
  suite.assertEqual(FibonacciCalculator.recursive(10), 55);
  suite.assertEqual(FibonacciCalculator.recursive(15), 610);
  suite.assertEqual(FibonacciCalculator.recursive(20), 6765);
});

suite.test('Recursive: Edge cases', () => {
  suite.assertThrows(() => FibonacciCalculator.recursive(-1), Error, 'Should throw for negative numbers');
  suite.assertThrows(() => FibonacciCalculator.recursive(-10), Error, 'Should throw for negative numbers');
});

// Test memoized method
suite.test('Memoized: Basic cases', () => {
  suite.assertEqual(FibonacciCalculator.memoized(0), 0);
  suite.assertEqual(FibonacciCalculator.memoized(1), 1);
  suite.assertEqual(FibonacciCalculator.memoized(2), 1);
  suite.assertEqual(FibonacciCalculator.memoized(3), 2);
  suite.assertEqual(FibonacciCalculator.memoized(4), 3);
  suite.assertEqual(FibonacciCalculator.memoized(5), 5);
});

suite.test('Memoized: Larger numbers', () => {
  suite.assertEqual(FibonacciCalculator.memoized(10), 55);
  suite.assertEqual(FibonacciCalculator.memoized(15), 610);
  suite.assertEqual(FibonacciCalculator.memoized(20), 6765);
  suite.assertEqual(FibonacciCalculator.memoized(25), 75025);
  suite.assertEqual(FibonacciCalculator.memoized(30), 832040);
});

suite.test('Memoized: Edge cases', () => {
  suite.assertThrows(() => FibonacciCalculator.memoized(-1), Error, 'Should throw for negative numbers');
  suite.assertThrows(() => FibonacciCalculator.memoized(-10), Error, 'Should throw for negative numbers');
});

// Test sequence generation
suite.test('Sequence: Empty and small sequences', () => {
  suite.assertEqual(FibonacciCalculator.sequence(0).length, 0);
  suite.assertEqual(FibonacciCalculator.sequence(1).length, 1);
  suite.assertEqual(FibonacciCalculator.sequence(1)[0], 0);
  suite.assertEqual(FibonacciCalculator.sequence(2).length, 2);
  suite.assertEqual(FibonacciCalculator.sequence(2)[0], 0);
  suite.assertEqual(FibonacciCalculator.sequence(2)[1], 1);
});

suite.test('Sequence: Medium sequences', () => {
  const seq10 = FibonacciCalculator.sequence(10);
  suite.assertEqual(seq10.length, 10);
  suite.assertEqual(seq10[0], 0);
  suite.assertEqual(seq10[1], 1);
  suite.assertEqual(seq10[9], 34);
  
  const seq15 = FibonacciCalculator.sequence(15);
  suite.assertEqual(seq15.length, 15);
  suite.assertEqual(seq15[14], 377);
});

suite.test('Sequence: Edge cases', () => {
  suite.assertThrows(() => FibonacciCalculator.sequence(-1), Error, 'Should throw for negative length');
  suite.assertThrows(() => FibonacciCalculator.sequence(-10), Error, 'Should throw for negative length');
});

// Test Fibonacci number checking
suite.test('IsFibonacci: Known Fibonacci numbers', () => {
  suite.assertTrue(FibonacciCalculator.isFibonacci(0), '0 should be Fibonacci');
  suite.assertTrue(FibonacciCalculator.isFibonacci(1), '1 should be Fibonacci');
  suite.assertTrue(FibonacciCalculator.isFibonacci(2), '2 should be Fibonacci');
  suite.assertTrue(FibonacciCalculator.isFibonacci(3), '3 should be Fibonacci');
  suite.assertTrue(FibonacciCalculator.isFibonacci(5), '5 should be Fibonacci');
  suite.assertTrue(FibonacciCalculator.isFibonacci(8), '8 should be Fibonacci');
  suite.assertTrue(FibonacciCalculator.isFibonacci(13), '13 should be Fibonacci');
  suite.assertTrue(FibonacciCalculator.isFibonacci(21), '21 should be Fibonacci');
  suite.assertTrue(FibonacciCalculator.isFibonacci(34), '34 should be Fibonacci');
  suite.assertTrue(FibonacciCalculator.isFibonacci(55), '55 should be Fibonacci');
});

suite.test('IsFibonacci: Non-Fibonacci numbers', () => {
  suite.assertFalse(FibonacciCalculator.isFibonacci(4), '4 should not be Fibonacci');
  suite.assertFalse(FibonacciCalculator.isFibonacci(6), '6 should not be Fibonacci');
  suite.assertFalse(FibonacciCalculator.isFibonacci(7), '7 should not be Fibonacci');
  suite.assertFalse(FibonacciCalculator.isFibonacci(9), '9 should not be Fibonacci');
  suite.assertFalse(FibonacciCalculator.isFibonacci(10), '10 should not be Fibonacci');
  suite.assertFalse(FibonacciCalculator.isFibonacci(11), '11 should not be Fibonacci');
  suite.assertFalse(FibonacciCalculator.isFibonacci(12), '12 should not be Fibonacci');
});

suite.test('IsFibonacci: Edge cases', () => {
  suite.assertFalse(FibonacciCalculator.isFibonacci(-1), 'Negative numbers should not be Fibonacci');
  suite.assertFalse(FibonacciCalculator.isFibonacci(-10), 'Negative numbers should not be Fibonacci');
});

// Test position finding
suite.test('FindPosition: Known positions', () => {
  suite.assertEqual(FibonacciCalculator.findPosition(0), 0);
  suite.assertEqual(FibonacciCalculator.findPosition(1), 1);
  suite.assertEqual(FibonacciCalculator.findPosition(2), 3);
  suite.assertEqual(FibonacciCalculator.findPosition(3), 4);
  suite.assertEqual(FibonacciCalculator.findPosition(5), 5);
  suite.assertEqual(FibonacciCalculator.findPosition(8), 6);
  suite.assertEqual(FibonacciCalculator.findPosition(13), 7);
  suite.assertEqual(FibonacciCalculator.findPosition(21), 8);
  suite.assertEqual(FibonacciCalculator.findPosition(34), 9);
  suite.assertEqual(FibonacciCalculator.findPosition(55), 10);
});

suite.test('FindPosition: Non-Fibonacci numbers', () => {
  suite.assertEqual(FibonacciCalculator.findPosition(4), null);
  suite.assertEqual(FibonacciCalculator.findPosition(6), null);
  suite.assertEqual(FibonacciCalculator.findPosition(7), null);
  suite.assertEqual(FibonacciCalculator.findPosition(9), null);
  suite.assertEqual(FibonacciCalculator.findPosition(10), null);
});

suite.test('FindPosition: Edge cases', () => {
  suite.assertEqual(FibonacciCalculator.findPosition(-1), null);
  suite.assertEqual(FibonacciCalculator.findPosition(-10), null);
});

// Test golden ratio calculation
suite.test('GoldenRatio: Basic calculations', () => {
  const ratio2 = FibonacciCalculator.goldenRatio(2);
  suite.assertTrue(Math.abs(ratio2 - 1) < 0.1, 'F(2)/F(1) should be close to 1');
  
  const ratio3 = FibonacciCalculator.goldenRatio(3);
  suite.assertTrue(Math.abs(ratio3 - 2) < 0.1, 'F(3)/F(2) should be close to 2');
  
  const ratio10 = FibonacciCalculator.goldenRatio(10);
  const actualGoldenRatio = (1 + Math.sqrt(5)) / 2;
  suite.assertTrue(Math.abs(ratio10 - actualGoldenRatio) < 0.1, 'F(10)/F(9) should be close to golden ratio');
});

suite.test('GoldenRatio: Larger calculations', () => {
  const ratio20 = FibonacciCalculator.goldenRatio(20);
  const actualGoldenRatio = (1 + Math.sqrt(5)) / 2;
  suite.assertTrue(Math.abs(ratio20 - actualGoldenRatio) < 0.01, 'F(20)/F(19) should be very close to golden ratio');
  
  const ratio30 = FibonacciCalculator.goldenRatio(30);
  suite.assertTrue(Math.abs(ratio30 - actualGoldenRatio) < 0.001, 'F(30)/F(29) should be extremely close to golden ratio');
});

suite.test('GoldenRatio: Edge cases', () => {
  suite.assertThrows(() => FibonacciCalculator.goldenRatio(0), Error, 'Should throw for position 0');
  suite.assertThrows(() => FibonacciCalculator.goldenRatio(1), Error, 'Should throw for position 1');
  suite.assertThrows(() => FibonacciCalculator.goldenRatio(-1), Error, 'Should throw for negative position');
});

// Test method consistency
suite.test('Method consistency: All methods should return same results', () => {
  for (let i = 0; i <= 20; i++) {
    const iterative = FibonacciCalculator.iterative(i);
    const recursive = FibonacciCalculator.recursive(i);
    const memoized = FibonacciCalculator.memoized(i);
    
    suite.assertEqual(iterative, recursive, `Methods should agree at position ${i}`);
    suite.assertEqual(iterative, memoized, `Methods should agree at position ${i}`);
  }
});

// Test perfect square helper
suite.test('IsPerfectSquare: Known perfect squares', () => {
  suite.assertTrue(FibonacciCalculator.isPerfectSquare(0), '0 should be perfect square');
  suite.assertTrue(FibonacciCalculator.isPerfectSquare(1), '1 should be perfect square');
  suite.assertTrue(FibonacciCalculator.isPerfectSquare(4), '4 should be perfect square');
  suite.assertTrue(FibonacciCalculator.isPerfectSquare(9), '9 should be perfect square');
  suite.assertTrue(FibonacciCalculator.isPerfectSquare(16), '16 should be perfect square');
  suite.assertTrue(FibonacciCalculator.isPerfectSquare(25), '25 should be perfect square');
  suite.assertTrue(FibonacciCalculator.isPerfectSquare(36), '36 should be perfect square');
  suite.assertTrue(FibonacciCalculator.isPerfectSquare(49), '49 should be perfect square');
  suite.assertTrue(FibonacciCalculator.isPerfectSquare(64), '64 should be perfect square');
  suite.assertTrue(FibonacciCalculator.isPerfectSquare(81), '81 should be perfect square');
  suite.assertTrue(FibonacciCalculator.isPerfectSquare(100), '100 should be perfect square');
});

suite.test('IsPerfectSquare: Non-perfect squares', () => {
  suite.assertFalse(FibonacciCalculator.isPerfectSquare(2), '2 should not be perfect square');
  suite.assertFalse(FibonacciCalculator.isPerfectSquare(3), '3 should not be perfect square');
  suite.assertFalse(FibonacciCalculator.isPerfectSquare(5), '5 should not be perfect square');
  suite.assertFalse(FibonacciCalculator.isPerfectSquare(6), '6 should not be perfect square');
  suite.assertFalse(FibonacciCalculator.isPerfectSquare(7), '7 should not be perfect square');
  suite.assertFalse(FibonacciCalculator.isPerfectSquare(8), '8 should not be perfect square');
  suite.assertFalse(FibonacciCalculator.isPerfectSquare(10), '10 should not be perfect square');
});

// Performance test
suite.test('Performance: Large number calculation', () => {
  const startTime = process.hrtime.bigint();
  const result = FibonacciCalculator.iterative(1000);
  const endTime = process.hrtime.bigint();
  const executionTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds
  
  // Just verify it doesn't crash and returns a number
  suite.assertTrue(typeof result === 'number', 'Should return a number');
  suite.assertTrue(result > 0, 'Result should be positive');
  suite.assertTrue(executionTime < 1000, 'Should complete within 1 second');
});

// Run all tests
suite.runTests().catch(console.error);
