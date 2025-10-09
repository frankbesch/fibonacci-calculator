/**
 * Fibonacci Application - Core Functions
 * Provides multiple implementations of Fibonacci sequence calculation
 */

class FibonacciCalculator {
  /**
   * Calculate Fibonacci number using iterative approach
   * Time Complexity: O(n) - Linear iteration from 0 to n
   * Space Complexity: O(1) - Only two variables used
   * Best for: Large numbers (n > 40), performance-critical applications
   * 
   * @param {number} n - Position in Fibonacci sequence
   * @returns {number} Fibonacci number at position n
   */
  static iterative(n) {
    if (n < 0) throw new Error('Fibonacci sequence is not defined for negative numbers');
    if (n <= 1) return n;
    
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
      const temp = a + b;
      a = b;
      b = temp;
    }
    return b;
  }

  /**
   * Calculate Fibonacci number using recursive approach
   * Time Complexity: O(2^n) - Exponential due to repeated calculations
   * Space Complexity: O(n) - Call stack depth
   * Best for: Small numbers (n ≤ 20), educational purposes, understanding recursion
   * 
   * @param {number} n - Position in Fibonacci sequence
   * @returns {number} Fibonacci number at position n
   */
  static recursive(n) {
    if (n < 0) throw new Error('Fibonacci sequence is not defined for negative numbers');
    if (n <= 1) return n;
    return this.recursive(n - 1) + this.recursive(n - 2);
  }

  /**
   * Calculate Fibonacci number using memorized recursive approach
   * Time Complexity: O(n) - Each value calculated once and cached
   * Space Complexity: O(n) - Memoization cache + call stack
   * Best for: Medium numbers (20 < n ≤ 40), balanced performance
   * 
   * @param {number} n - Position in Fibonacci sequence
   * @param {Object} memo - Memoization cache (optional)
   * @returns {number} Fibonacci number at position n
   */
  static memorized(n, memo = {}) {
    if (n < 0) throw new Error('Fibonacci sequence is not defined for negative numbers');
    if (n in memo) return memo[n];
    if (n <= 1) return n;
    
    memo[n] = this.memorized(n - 1, memo) + this.memorized(n - 2, memo);
    return memo[n];
  }

  /**
   * Generate Fibonacci sequence up to n terms
   * @param {number} n - Number of terms to generate
   * @returns {Array} Array of Fibonacci numbers
   */
  static sequence(n) {
    if (n < 0) throw new Error('Cannot generate negative number of terms');
    if (n === 0) return [];
    if (n === 1) return [0];
    if (n === 2) return [0, 1];
    
    const sequence = [0, 1];
    for (let i = 2; i < n; i++) {
      sequence.push(sequence[i - 1] + sequence[i - 2]);
    }
    return sequence;
  }

  /**
   * Check if a number is a Fibonacci number
   * Uses mathematical property: A number n is Fibonacci if and only if
   * one of (5n² + 4) or (5n² - 4) is a perfect square
   * 
   * @param {number} num - Number to check
   * @returns {boolean} True if the number is in Fibonacci sequence
   */
  static isFibonacci(num) {
    if (num < 0) return false;
    
    // A number is Fibonacci if and only if one of (5*n^2 + 4) or (5*n^2 - 4) is a perfect square
    const check1 = 5 * num * num + 4;
    const check2 = 5 * num * num - 4;
    
    return this.isPerfectSquare(check1) || this.isPerfectSquare(check2);
  }

  /**
   * Helper function to check if a number is a perfect square
   * @param {number} num - Number to check
   * @returns {boolean} True if the number is a perfect square
   */
  static isPerfectSquare(num) {
    const sqrt = Math.sqrt(num);
    return Math.floor(sqrt) === sqrt;
  }

  /**
   * Find the position of a Fibonacci number in the sequence
   * @param {number} num - Fibonacci number to find position for
   * @returns {number|null} Position in sequence or null if not found
   */
  static findPosition(num) {
    if (!this.isFibonacci(num)) return null;
    
    let a = 0, b = 1, position = 0;
    while (a <= num) {
      if (a === num) return position;
      const temp = a + b;
      a = b;
      b = temp;
      position++;
    }
    return null;
  }

  // Golden ratio calculation removed as per UI simplification
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FibonacciCalculator;
}

// Make available globally for browser environments
if (typeof window !== 'undefined') {
  window.FibonacciCalculator = FibonacciCalculator;
}