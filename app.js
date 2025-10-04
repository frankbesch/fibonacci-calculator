/**
 * Fibonacci Calculator Web Application
 * Interactive frontend for the Fibonacci Calculator
 */

class FibonacciApp {
  constructor() {
    this.initializeElements();
    this.bindEvents();
    this.loadExamples();
  }

  initializeElements() {
    // Single number calculator
    this.positionInput = document.getElementById('position');
    this.calculateBtn = document.getElementById('calculateBtn');
    this.resultDisplay = document.getElementById('result');
    this.methodRadios = document.querySelectorAll('input[name="method"]');

    // Sequence generator
    this.sequenceLengthInput = document.getElementById('sequenceLength');
    this.generateSequenceBtn = document.getElementById('generateSequenceBtn');
    this.sequenceResult = document.getElementById('sequenceResult');

    // Fibonacci checker
    this.checkNumberInput = document.getElementById('checkNumber');
    this.checkBtn = document.getElementById('checkBtn');
    this.checkResult = document.getElementById('checkResult');

    // Golden ratio calculator
    this.goldenPositionInput = document.getElementById('goldenPosition');
    this.goldenBtn = document.getElementById('goldenBtn');
    this.goldenResult = document.getElementById('goldenResult');

    // Performance comparison
    this.perfPositionInput = document.getElementById('perfPosition');
    this.perfBtn = document.getElementById('perfBtn');
    this.perfResult = document.getElementById('perfResult');
  }

  bindEvents() {
    // Single number calculation
    this.calculateBtn.addEventListener('click', () => this.calculateSingleNumber());
    this.positionInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.calculateSingleNumber();
    });

    // Sequence generation
    this.generateSequenceBtn.addEventListener('click', () => this.generateSequence());
    this.sequenceLengthInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.generateSequence();
    });

    // Fibonacci checker
    this.checkBtn.addEventListener('click', () => this.checkFibonacci());
    this.checkNumberInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.checkFibonacci();
    });

    // Golden ratio calculator
    this.goldenBtn.addEventListener('click', () => this.calculateGoldenRatio());
    this.goldenPositionInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.calculateGoldenRatio();
    });

    // Performance comparison
    this.perfBtn.addEventListener('click', () => this.comparePerformance());
    this.perfPositionInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.comparePerformance();
    });
  }

  loadExamples() {
    // Set some example values
    this.positionInput.placeholder = 'Try: 10, 20, or 30';
    this.sequenceLengthInput.placeholder = 'Try: 10, 15, or 20';
    this.checkNumberInput.placeholder = 'Try: 8, 13, or 21';
    this.goldenPositionInput.placeholder = 'Try: 20, 30, or 40';
    this.perfPositionInput.placeholder = 'Try: 30, 35, or 40';
  }

  getSelectedMethod() {
    const selectedMethod = document.querySelector('input[name="method"]:checked');
    return selectedMethod ? selectedMethod.value : 'iterative';
  }

  showLoading(element) {
    element.innerHTML = '<div class="loading"></div> Calculating...';
  }

  showError(element, message) {
    element.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    element.className = 'result-display error';
  }

  showSuccess(element, content, className = '') {
    element.innerHTML = content;
    element.className = `result-display success ${className}`;
  }

  async calculateSingleNumber() {
    const position = parseInt(this.positionInput.value);
    
    if (isNaN(position) || position < 0) {
      this.showError(this.resultDisplay, 'Please enter a valid non-negative number');
      return;
    }

    if (position > 100) {
      this.showError(this.resultDisplay, 'Position must be ≤ 100 for web performance');
      return;
    }

    this.showLoading(this.resultDisplay);
    
    try {
      const method = this.getSelectedMethod();
      const startTime = performance.now();
      
      let result;
      switch (method) {
        case 'iterative':
          result = FibonacciCalculator.iterative(position);
          break;
        case 'recursive':
          if (position > 40) {
            this.showError(this.resultDisplay, 'Recursive method limited to position ≤ 40 for performance');
            return;
          }
          result = FibonacciCalculator.recursive(position);
          break;
        case 'memoized':
          result = FibonacciCalculator.memoized(position);
          break;
      }
      
      const endTime = performance.now();
      const executionTime = (endTime - startTime).toFixed(2);
      
      this.showSuccess(
        this.resultDisplay,
        `F(${position}) = ${result.toLocaleString()}<br><small>Method: ${method} | Time: ${executionTime}ms</small>`
      );
      
    } catch (error) {
      this.showError(this.resultDisplay, error.message);
    }
  }

  async generateSequence() {
    const length = parseInt(this.sequenceLengthInput.value);
    
    if (isNaN(length) || length < 1) {
      this.showError(this.sequenceResult, 'Please enter a valid positive number');
      return;
    }

    if (length > 50) {
      this.showError(this.sequenceResult, 'Sequence length limited to 50 terms');
      return;
    }

    this.showLoading(this.sequenceResult);
    
    try {
      const startTime = performance.now();
      const sequence = FibonacciCalculator.sequence(length);
      const endTime = performance.now();
      const executionTime = (endTime - startTime).toFixed(2);
      
      const sequenceHTML = sequence.map((num, index) => 
        `<span class="sequence-item">F(${index}) = ${num.toLocaleString()}</span>`
      ).join('');
      
      this.showSuccess(
        this.sequenceResult,
        `${sequenceHTML}<br><small>Generated ${length} terms in ${executionTime}ms</small>`,
        'sequence-display'
      );
      
    } catch (error) {
      this.showError(this.sequenceResult, error.message);
    }
  }

  async checkFibonacci() {
    const number = parseInt(this.checkNumberInput.value);
    
    if (isNaN(number) || number < 0) {
      this.showError(this.checkResult, 'Please enter a valid non-negative number');
      return;
    }

    this.showLoading(this.checkResult);
    
    try {
      const startTime = performance.now();
      const isFib = FibonacciCalculator.isFibonacci(number);
      const position = isFib ? FibonacciCalculator.findPosition(number) : null;
      const endTime = performance.now();
      const executionTime = (endTime - startTime).toFixed(2);
      
      if (isFib) {
        this.showSuccess(
          this.checkResult,
          `<i class="fas fa-check-circle"></i> ${number} is a Fibonacci number!<br>Position: F(${position})<br><small>Checked in ${executionTime}ms</small>`
        );
      } else {
        this.showSuccess(
          this.checkResult,
          `<i class="fas fa-times-circle"></i> ${number} is not a Fibonacci number<br><small>Checked in ${executionTime}ms</small>`
        );
      }
      
    } catch (error) {
      this.showError(this.checkResult, error.message);
    }
  }

  async calculateGoldenRatio() {
    const position = parseInt(this.goldenPositionInput.value);
    
    if (isNaN(position) || position < 2) {
      this.showError(this.goldenResult, 'Please enter a valid position ≥ 2');
      return;
    }

    if (position > 100) {
      this.showError(this.goldenResult, 'Position must be ≤ 100');
      return;
    }

    this.showLoading(this.goldenResult);
    
    try {
      const startTime = performance.now();
      const ratio = FibonacciCalculator.goldenRatio(position);
      const endTime = performance.now();
      const executionTime = (endTime - startTime).toFixed(2);
      
      const actualGoldenRatio = (1 + Math.sqrt(5)) / 2;
      const difference = Math.abs(ratio - actualGoldenRatio);
      const accuracy = ((1 - difference / actualGoldenRatio) * 100).toFixed(2);
      
      this.showSuccess(
        this.goldenResult,
        `Golden Ratio ≈ ${ratio.toFixed(10)}<br>
         Actual φ = ${actualGoldenRatio.toFixed(10)}<br>
         Accuracy: ${accuracy}%<br>
         <small>Calculated in ${executionTime}ms</small>`
      );
      
    } catch (error) {
      this.showError(this.goldenResult, error.message);
    }
  }

  async comparePerformance() {
    const position = parseInt(this.perfPositionInput.value);
    
    if (isNaN(position) || position < 0) {
      this.showError(this.perfResult, 'Please enter a valid non-negative number');
      return;
    }

    if (position > 40) {
      this.showError(this.perfResult, 'Position limited to ≤ 40 for performance comparison');
      return;
    }

    this.showLoading(this.perfResult);
    
    try {
      const methods = ['iterative', 'recursive', 'memoized'];
      const results = [];
      
      for (const method of methods) {
        const startTime = performance.now();
        let result;
        
        try {
          switch (method) {
            case 'iterative':
              result = FibonacciCalculator.iterative(position);
              break;
            case 'recursive':
              result = FibonacciCalculator.recursive(position);
              break;
            case 'memoized':
              result = FibonacciCalculator.memoized(position);
              break;
          }
          
          const endTime = performance.now();
          const executionTime = (endTime - startTime).toFixed(2);
          
          results.push({
            method: method.charAt(0).toUpperCase() + method.slice(1),
            time: executionTime,
            result: result
          });
          
        } catch (error) {
          results.push({
            method: method.charAt(0).toUpperCase() + method.slice(1),
            time: 'Error',
            result: error.message
          });
        }
      }
      
      const perfHTML = results.map(item => 
        `<div class="perf-item">
          <span class="perf-method">${item.method}:</span>
          <span class="perf-time">${item.time}ms</span>
        </div>`
      ).join('');
      
      this.showSuccess(
        this.perfResult,
        `<strong>Performance Comparison for F(${position})</strong><br>${perfHTML}`,
        'performance-display'
      );
      
    } catch (error) {
      this.showError(this.perfResult, error.message);
    }
  }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new FibonacciApp();
});

// Add some helpful keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + Enter to calculate in focused input
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    const activeElement = document.activeElement;
    if (activeElement && activeElement.tagName === 'INPUT') {
      const form = activeElement.closest('.calculator-card');
      if (form) {
        const button = form.querySelector('.btn');
        if (button) button.click();
      }
    }
  }
});
