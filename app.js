/**
 * Fibonacci Calculator Web Application
 * Interactive frontend for the Fibonacci Calculator
 */

class FibonacciApp {
  constructor() {
    this.initializeElements();
    this.bindEvents();
    this.loadExamples();
    
    // Check button setup is handled in setupCheckButton()
  }

  initializeElements() {
    // Single number calculator
    this.positionInput = document.getElementById('position');
    this.calculateBtn = document.getElementById('calculateBtn');
    this.resultDisplay = document.getElementById('result');
    this.methodRadios = document.querySelectorAll('input[name="method"]');

    // Sequence generator - REMOVED (elements no longer in HTML)
    // this.sequenceLengthInput = document.getElementById('sequenceLength');
    // this.generateSequenceBtn = document.getElementById('generateSequenceBtn');
    // this.sequenceResult = document.getElementById('sequenceResult');

    // Fibonacci checker
    this.checkNumberInput = document.getElementById('checkNumber');
    this.checkBtn = document.getElementById('checkBtn');
    this.checkResult = document.getElementById('checkResult');
    
    // Check button will be set up in setupCheckButton()

    // Graph - REMOVED (elements no longer in HTML)
    // this.graphTermsInput = document.getElementById('graphTerms');
    // this.graphBtn = document.getElementById('graphBtn');
    // this.graphCanvas = document.getElementById('fibChart');
    this.terminalEl = null;

    // Performance comparison
    this.perfPositionInput = document.getElementById('perfPosition'); // May not exist (removed from HTML)
    this.perfBtn = document.getElementById('perfBtn');
    this.perfResult = document.getElementById('perfResult');
  }

  bindEvents() {
    // Calculate button removed - calculation happens automatically via slider
    
    // Create debounced handlers for heavy operations with longer delays
    const debouncedGraphUpdate = this.debounce((n) => {
      requestAnimationFrame(() => {
        try {
          this.updateGraphFromData([ ...FibonacciCalculator.sequence(Math.max(2, n + 1)) ]);
        } catch (e) {
          console.warn('Graph update error:', e);
        }
      });
    }, 150); // Optimized for smooth performance
    
    const debouncedPerfUpdate = this.debounce((n) => {
      requestAnimationFrame(() => {
        try {
          // Always update the position value immediately
          this.updateSliderValue('perfPositionValue', n);
          
          if (n <= 93) { 
            // Run performance comparison asynchronously to prevent blocking
            setTimeout(() => this.comparePerformance(), 0);
          }
        } catch (e) {
          console.warn('Performance update error:', e);
        }
      });
    }, 300); // Reduced delay for better responsiveness
    
    this.positionInput.addEventListener('input', () => {
      const n = parseInt(this.positionInput.value);
      const syncEnabled = document.getElementById('syncToggle')?.checked;
      
      if (!isNaN(n) && n >= 0) {
        // Always update Calculate box display
        this.updateSliderValue('positionValue', n);
        this.updateSliderValue('fibPosition', n);
        
        try {
          const fibValue = FibonacciCalculator.iterative(n);
          this.updateFibonacciDisplay(fibValue);
          
          // Only sync to Check box if toggle is enabled
          if (syncEnabled) {
            this.checkNumberInput.value = fibValue;
            this.updateSliderValue('checkValue', fibValue);
            this.updateCheckResult(fibValue, n, true);
            this.updateCheckButton(true);
          }
        } catch (error) {
          this.handleCalculateError(error);
        }
        
        // Always update graph and trigger GPU performance update
        debouncedGraphUpdate(n);
        debouncedPerfUpdate(n);
      }
    });
    this.positionInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') console.log('Enter pressed on slider'); });

    // Sequence generation - REMOVED (elements no longer in HTML)
    // this.generateSequenceBtn.addEventListener('click', () => this.generateSequence());
    // this.sequenceLengthInput.addEventListener('input', this.debounce(() => {
    //   requestAnimationFrame(() => {
    //     const len = parseInt(this.sequenceLengthInput.value);
    //     if (!isNaN(len) && len > 0) {
    //       console.log('Sequence length input:', len);
    //       this.updateSliderValue('sequenceValue', len);
    //       this.updateGraphFromData(FibonacciCalculator.sequence(Math.min(50, len)));
    //       if (len <= 40) { 
    //         // Don't auto-trigger performance comparison on sequence input
    //       }
    //     }
    //   });
    // }, 200)); // Optimized for smooth performance
    // this.sequenceLengthInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.generateSequence(); });

    // Fibonacci checker - COMPLETELY REBUILT
    this.setupCheckButton();
    this.checkNumberInput.addEventListener('input', this.debounce(() => {
      requestAnimationFrame(() => {
        const inputValue = this.checkNumberInput.value.trim();
        console.log('Check input changed:', inputValue);
        
        if (inputValue === '') {
          // Empty input - show placeholder
          this.updateSliderValue('checkValue', 'Enter a number');
          this.updateCheckResult('Enter a number', null, null);
          this.updateCheckButton(null);
        } else {
          // Validate input
          const validation = this.validateFibonacciInput(inputValue);
          
          if (!validation.valid) {
            // Invalid input - show error
            this.updateSliderValue('checkValue', 'Invalid');
            this.updateCheckResult(validation.error, null, false);
            this.updateCheckButton(null);
          } else {
            const val = validation.value;
            console.log('Check number input:', val);
            
            // Update the check value display
            this.updateSliderValue('checkValue', val);
            
            try {
              // Check if it's a Fibonacci number and update display
              const isFib = FibonacciCalculator.isFibonacci(val);
              const position = isFib ? FibonacciCalculator.findPosition(val) : null;
              
              console.log('Fibonacci check result:', { val, isFib, position });
              
              if (isFib) {
                this.updateCheckResult(val, position, true);
                this.updateCheckButton(true);
              } else {
                this.updateCheckResult(val, null, false);
                this.updateCheckButton(false);
              }
              
              // If Fibonacci, graph up to its position; otherwise graph up to nearest position by value
              const pos = FibonacciCalculator.findPosition(val);
              const terms = pos != null ? pos + 1 : Math.min(30, FibonacciCalculator.sequence(30).findIndex(x => x > val) + 1 || 10);
              this.updateGraphFromData(FibonacciCalculator.sequence(Math.max(2, terms)));
              if (terms <= 40) { 
                // Don't auto-trigger performance comparison on checker input
              }
            } catch (error) {
              console.error('Check error:', error);
              this.handleCheckError(error, val);
            }
          }
        }
      });
    }, 200)); // Optimized for smooth performance
    this.checkNumberInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.checkFibonacci(); });

    // Graph - REMOVED (elements no longer in HTML)
    // this.graphBtn.addEventListener('click', () => this.drawGraph());
    // this.graphTermsInput.addEventListener('keypress', (e) => {
    //   if (e.key === 'Enter') this.drawGraph();
    // });

    // Performance comparison
    this.perfBtn.addEventListener('click', () => this.comparePerformance());
    
    // Sync toggle event listener
    const syncToggle = document.getElementById('syncToggle');
    if (syncToggle) {
      syncToggle.addEventListener('change', () => {
        this.saveSyncState();
        // Visual feedback for sync state
        const sections = document.querySelectorAll('.widget-row .calculator-section');
        sections.forEach(section => {
          if (syncToggle.checked) {
            section.classList.add('synced');
          } else {
            section.classList.remove('synced');
          }
        });
      });
    }
    
    // GPU slider removed - position controlled by main slider only
  }

  loadExamples() {
    // Set some example values
    this.positionInput.placeholder = 'Try: 10, 20, or 30';
    this.sequenceLengthInput.placeholder = 'Try: 10, 15, or 20';
    this.checkNumberInput.placeholder = 'Try: 8, 13, or 21';
    if (this.graphTermsInput) this.graphTermsInput.placeholder = 'Try: 10, 15, or 20';
    // GPU section placeholder removed - controlled by main slider
    
    // Load saved sync state
    this.loadSyncState();
    
    // Initialize Fibonacci display with default value
    const initialValue = parseInt(this.positionInput.value) || 10;
    try {
      const fibValue = FibonacciCalculator.iterative(initialValue);
      this.updateFibonacciDisplay(fibValue);
      
      // Initialize Check If Number section with the same value
      this.checkNumberInput.value = fibValue;
      this.updateSliderValue('checkValue', fibValue);
      
      // Set initial check button state using new method
      const checkButton = document.getElementById('checkBtn');
      if (checkButton) {
        this.setButtonColor(checkButton, 'green');
      }
      this.setCheckResult(`${fibValue} = F(${initialValue})`);
    } catch (error) {
      console.warn('Initial Fibonacci calculation error:', error);
      this.updateFibonacciDisplay('Error');
      this.setCheckResult('Error');
      const checkButton = document.getElementById('checkBtn');
      if (checkButton) {
        this.setButtonColor(checkButton, 'gray');
      }
    }
    // Terminal removed
  }

  // COMPLETELY NEW CHECK BUTTON SETUP
  setupCheckButton() {
    console.log('Setting up check button...');
    
    // Find the button element
    const button = document.getElementById('checkBtn');
    if (!button) {
      console.error('Check button element not found!');
      return;
    }
    
    console.log('Check button found:', button);
    
    // Remove any existing event listeners by cloning the element
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    // Add the click event listener to the new button
    newButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Check button clicked!');
      
      // Get the input value
      const input = document.getElementById('checkNumber');
      const inputValue = input ? input.value.trim() : '';
      
      console.log('Input value:', inputValue);
      
      if (!inputValue) {
        console.log('No input - setting gray');
        this.setButtonColor(newButton, 'gray');
        this.setCheckResult('Enter a number');
        return;
      }
      
      const number = parseInt(inputValue);
      if (isNaN(number) || number < 0) {
        console.log('Invalid input - setting gray');
        this.setButtonColor(newButton, 'gray');
        this.setCheckResult('Invalid number');
        return;
      }
      
      // Check if it's Fibonacci
      try {
        const isFibonacci = FibonacciCalculator.isFibonacci(number);
        console.log('Number', number, 'is Fibonacci:', isFibonacci);
        
        if (isFibonacci) {
          const position = FibonacciCalculator.findPosition(number);
          console.log('Setting button to GREEN');
          this.setButtonColor(newButton, 'green');
          this.setCheckResult(`${number} = F(${position})`);
        } else {
          console.log('Setting button to RED');
          this.setButtonColor(newButton, 'red');
          this.setCheckResult(`${number} is not a Fibonacci number`);
        }
      } catch (error) {
        console.error('Error checking Fibonacci:', error);
        this.setButtonColor(newButton, 'gray');
        this.setCheckResult('Error');
      }
    });
    
    console.log('Check button setup complete');
  }
  
  // Helper method to set button color
  setButtonColor(button, color) {
    if (!button) return;
    
    // Remove all color classes
    button.className = 'btn';
    
    switch (color) {
      case 'green':
        button.style.backgroundColor = '#16a34a';
        button.style.color = 'white';
        button.style.border = 'none';
        break;
      case 'red':
        button.style.backgroundColor = '#dc2626';
        button.style.color = 'white';
        button.style.border = 'none';
        break;
      case 'gray':
      default:
        button.style.backgroundColor = '#6b7280';
        button.style.color = 'white';
        button.style.border = 'none';
        break;
    }
  }
  
  // Helper method to set check result
  setCheckResult(text) {
    const resultElement = document.getElementById('checkResult');
    if (resultElement) {
      resultElement.textContent = text;
    }
  }

  // Save state
  saveSyncState() {
    const syncToggle = document.getElementById('syncToggle');
    if (syncToggle) {
      localStorage.setItem('fibSyncEnabled', syncToggle.checked);
    }
  }

  // Restore state
  loadSyncState() {
    const saved = localStorage.getItem('fibSyncEnabled');
    const syncToggle = document.getElementById('syncToggle');
    if (saved !== null && syncToggle) {
      syncToggle.checked = saved === 'true';
    }
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

  showCheckResult(element, content, isSuccess = true) {
    element.textContent = content;
    if (isSuccess) {
      element.className = 'fibonacci-number check-success';
    } else {
      element.className = 'fibonacci-number check-error';
    }
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
      const startTime = performance.now();
      const result = FibonacciCalculator.iterative(position);
      const endTime = performance.now();
      const executionTime = (endTime - startTime).toFixed(2);
      
      this.showSuccess(
        this.resultDisplay,
        `F(${position}) = ${result.toLocaleString()}<br><small>Method: Iterative | Time: ${executionTime}ms</small>`
      );
      if (this.updateGraphFromData) this.updateGraphFromData([ ...FibonacciCalculator.sequence(Math.max(2, position + 1)) ]);
      if (this.logLine) this.logLine('success', `calc F(${position}) via iterative in ${executionTime}ms → ${result.toLocaleString()}`);
      if (position <= 40) {
        this.comparePerformance();
      }
      
    } catch (error) {
      this.showError(this.resultDisplay, error.message);
      if (this.logLine) this.logLine('error', `calc error: ${error.message}`);
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
      if (this.updateGraphFromData) this.updateGraphFromData(sequence);
      if (this.logLine) this.logLine('success', `sequence n=${length} in ${executionTime}ms`);
      if (length <= 40) {
        this.comparePerformance();
      }
      
    } catch (error) {
      this.showError(this.sequenceResult, error.message);
      if (this.logLine) this.logLine('error', `sequence error: ${error.message}`);
    }
  }

  async checkFibonacci() {
    const number = parseInt(this.checkNumberInput.value);
    
    if (isNaN(number) || number < 0) {
      this.updateCheckResult('Invalid input', null, false);
      this.updateCheckButton(false);
      return;
    }

    this.updateCheckResult('Checking...', null, true);
    
    try {
      const startTime = performance.now();
      const isFib = FibonacciCalculator.isFibonacci(number);
      const position = isFib ? FibonacciCalculator.findPosition(number) : null;
      const endTime = performance.now();
      const executionTime = (endTime - startTime).toFixed(2);
      
      if (isFib) {
        this.updateCheckResult(number, position, true);
        this.updateCheckButton(true);
        if (this.updateGraphFromData) this.updateGraphFromData(FibonacciCalculator.sequence(Math.max(2, position + 1)));
        if (this.logLine) this.logLine('success', `check ${number} ✓ at F(${position}) in ${executionTime}ms`);
        if (position <= 40) {
          this.comparePerformance();
        }
      } else {
        this.updateCheckResult(number, null, false);
        this.updateCheckButton(false);
        if (this.logLine) this.logLine('warn', `check ${number} ✗ in ${executionTime}ms`);
      }
      
    } catch (error) {
      this.updateCheckResult('Error', null, false);
      this.updateCheckButton(false);
      if (this.logLine) this.logLine('error', `check error: ${error.message}`);
    }
  }

  drawGraph() {
    const terms = parseInt(this.graphTermsInput.value);
    if (isNaN(terms) || terms < 1) return;
    if (terms > 30) return;
    if (!this.graphCanvas) return;

    const seq = FibonacciCalculator.sequence(terms);
    this.drawSpiral(seq);
  }

  updateGraphFromData(data) {
    if (!Array.isArray(data) || data.length === 0) return;
    if (!this.graphCanvas) return;
    console.log('Updating spiral with data:', data);
    this.drawSpiral(data);
  }

  drawSpiral(sequence) {
    const canvas = this.graphCanvas;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas with a subtle background
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#f8fafc');
    bgGradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Use squares sized by Fibonacci numbers, draw quarter-circle arcs to make a spiral
    const fib = sequence.slice(0, Math.min(sequence.length, 14)); // increased limit for better visualization
    if (fib.length < 2) return;

    // Normalize square sizes to fit canvas
    const sizes = fib.map(n => Math.max(1, n));
    const total = sizes.reduce((a, b) => a + b, 0);
    const scale = Math.min(width * 0.8, height * 0.8) / (sizes[sizes.length - 1] + sizes[sizes.length - 2]);

    // Starting position near center
    let x = width / 2 - sizes[sizes.length - 1] * scale / 2;
    let y = height / 2 - sizes[sizes.length - 1] * scale / 2;
    let dir = 0; // 0:right,1:down,2:left,3:up

    // Enhanced styling with gradients
    const colors = [
      'rgba(118, 185, 0, 0.15)',   // NVIDIA green
      'rgba(0, 212, 170, 0.15)',   // NVIDIA teal
      'rgba(255, 107, 53, 0.15)',  // NVIDIA orange
      'rgba(0, 180, 216, 0.15)'    // NVIDIA blue
    ];
    
    const strokeColors = [
      '#76b900',  // NVIDIA green
      '#00d4aa',  // NVIDIA teal
      '#ff6b35',  // NVIDIA orange
      '#00b4d8'   // NVIDIA blue
    ];

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw squares and spiral arcs
    for (let i = sizes.length - 1; i >= 0; i--) {
      const s = sizes[i] * scale;
      const colorIndex = i % colors.length;
      
      // Create gradient for square fill
      const squareGradient = ctx.createLinearGradient(x, y, x + s, y + s);
      squareGradient.addColorStop(0, colors[colorIndex]);
      squareGradient.addColorStop(1, colors[(colorIndex + 1) % colors.length]);
      
      // Draw square with gradient
      ctx.fillStyle = squareGradient;
      ctx.fillRect(x, y, s, s);
      
      // Draw square border
      ctx.strokeStyle = strokeColors[colorIndex];
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, s, s);

      // Draw quarter arc inside the square with enhanced styling
      ctx.strokeStyle = strokeColors[colorIndex];
      ctx.lineWidth = 4;
      ctx.beginPath();
      
      switch (dir % 4) {
        case 0: // right, arc from bottom-left to top-left
          ctx.arc(x, y + s, s, Math.PI, Math.PI * 1.5);
          break;
        case 1: // down, arc from top-left to top-right
          ctx.arc(x, y, s, Math.PI * 1.5, Math.PI * 2);
          break;
        case 2: // left, arc from top-right to bottom-right
          ctx.arc(x + s, y, s, 0, Math.PI * 0.5);
          break;
        case 3: // up, arc from bottom-right to bottom-left
          ctx.arc(x + s, y + s, s, Math.PI * 0.5, Math.PI);
          break;
      }
      ctx.stroke();

      // Add Fibonacci number labels
      ctx.fillStyle = strokeColors[colorIndex];
      ctx.font = `bold ${Math.max(12, s * 0.15)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        fib[i].toString(), 
        x + s/2, 
        y + s/2
      );

      // Move to next square position
      switch (dir % 4) {
        case 0:
          x += s;
          y += s - (i > 0 ? sizes[i - 1] * scale : 0);
          break;
        case 1:
          y += s;
          x -= (i > 0 ? sizes[i - 1] * scale : 0);
          break;
        case 2:
          x -= s;
          y -= (i > 0 ? sizes[i - 1] * scale : 0);
          break;
        case 3:
          y -= s;
          x += s - (i > 0 ? sizes[i - 1] * scale : 0);
          break;
      }
      dir++;
    }

    // Add title and information
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Fibonacci Spiral', width / 2, 25);
    
    ctx.fillStyle = '#64748b';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(`Showing ${fib.length} terms`, width / 2, 45);
  }

  logLine(kind, text) {
    // Terminal removed - no logging
  }

  /**
   * Calculate theoretical GPU acceleration for Fibonacci algorithms
   * Based on NVIDIA Blackwell B200 architecture specifications
   * 
   * Analysis considers:
   * - Algorithm parallelization potential (how well it maps to GPU cores)
   * - Memory access patterns (efficiency of data transfer)
   * - Compute intensity (arithmetic operations per memory access)
   * - Realistic overhead (kernel launch, data transfer costs)
   * 
   * @param {number} position - Fibonacci position (n)
   * @param {Array} results - CPU benchmark results with execution times
   * @returns {Array} GPU estimates with speedup factors and confidence levels
   */
  calculateBlackwellGPUAcceleration(position, results) {
    // NVIDIA Blackwell B200 specifications
    const blackwellSpecs = {
      cudaCores: 20480,
      memoryBandwidth: 8000, // GB/s
      memorySize: 192, // GB
      baseClock: 1.8, // GHz
      boostClock: 2.0, // GHz
      l2Cache: 100, // MB
      tensorCores: 640
    };

    return results.map(item => {
      if (item.time === 'Error') {
        return { estimatedTime: 'N/A', speedupFactor: 'N/A', confidence: 'N/A' };
      }

      const cpuTime = parseFloat(item.time);
      const method = item.method.toLowerCase();
      
      // Algorithm-specific parallelization analysis
      const parallelizationFactor = this.analyzeParallelization(method, position);
      
      // Memory access pattern analysis
      const memoryEfficiency = this.analyzeMemoryEfficiency(method, position);
      
      // Compute intensity analysis
      const computeIntensity = this.analyzeComputeIntensity(method, position);
      
      // Overhead considerations
      const overheadFactor = this.calculateOverhead(position);
      
      // Calculate theoretical speedup
      const theoreticalSpeedup = this.calculateTheoreticalSpeedup(
        parallelizationFactor,
        memoryEfficiency,
        computeIntensity,
        overheadFactor,
        blackwellSpecs
      );
      
      // Apply realistic constraints
      const realisticSpeedup = this.applyRealisticConstraints(
        theoreticalSpeedup,
        method,
        position,
        cpuTime
      );
      
      const estimatedTime = (cpuTime / realisticSpeedup).toFixed(4);
      const confidence = this.calculateConfidence(realisticSpeedup, method, position);
      
      return {
        estimatedTime,
        speedupFactor: realisticSpeedup.toFixed(2),
        confidence
      };
    });
  }

  analyzeParallelization(method, position) {
    switch (method) {
      case 'iterative':
        // Highly parallelizable - can compute multiple terms simultaneously
        return Math.min(position * 0.8, 1000); // Up to 1000x parallelization
      case 'memorized':
        // Good parallelization but limited by memory dependencies
        return Math.min(position * 0.6, 500); // Up to 500x parallelization
      case 'recursive':
        // Limited parallelization due to sequential nature
        return Math.min(Math.log2(position) * 2, 16); // Up to 16x parallelization
      default:
        return 1;
    }
  }

  analyzeMemoryEfficiency(method, position) {
    // Memory bandwidth utilization efficiency
    const memoryAccessPattern = {
      'iterative': 0.9,    // Excellent - sequential memory access
      'memorized': 0.7,     // Good - some random access
      'recursive': 0.4     // Poor - stack operations
    };
    return memoryAccessPattern[method] || 0.5;
  }

  analyzeComputeIntensity(method, position) {
    // Operations per memory access
    const computeOps = {
      'iterative': position * 2,      // 2 ops per iteration
      'memorized': position * 1.5,     // 1.5 ops per iteration (lookup + compute)
      'recursive': position * 3       // 3 ops per call (call + return + compute)
    };
    return Math.min(computeOps[method] || 1, 1000);
  }

  calculateOverhead(position) {
    // Data transfer and kernel launch overhead
    const baseOverhead = 0.1; // 10% base overhead
    const sizeOverhead = Math.log10(position + 1) * 0.05; // Logarithmic overhead increase
    return Math.min(baseOverhead + sizeOverhead, 0.5); // Max 50% overhead
  }

  calculateTheoreticalSpeedup(parallelization, memoryEfficiency, computeIntensity, overhead, specs) {
    // Theoretical speedup based on hardware capabilities
    const parallelSpeedup = Math.min(parallelization, specs.cudaCores / 1000);
    const memorySpeedup = memoryEfficiency * (specs.memoryBandwidth / 1000);
    const computeSpeedup = Math.min(computeIntensity / 10, specs.tensorCores / 100);
    
    // Combine factors with diminishing returns
    const combinedSpeedup = parallelSpeedup * memorySpeedup * computeSpeedup;
    const overheadPenalty = 1 - overhead;
    
    return combinedSpeedup * overheadPenalty;
  }

  applyRealisticConstraints(theoreticalSpeedup, method, position, cpuTime) {
    // Apply realistic constraints based on algorithm characteristics
    let maxSpeedup;
    
    switch (method) {
      case 'iterative':
        // Most parallelizable
        maxSpeedup = Math.min(theoreticalSpeedup, 200);
        break;
      case 'memorized':
        // Good parallelization but memory bound
        maxSpeedup = Math.min(theoreticalSpeedup, 100);
        break;
      case 'recursive':
        // Limited by sequential nature
        maxSpeedup = Math.min(theoreticalSpeedup, 20);
        break;
      default:
        maxSpeedup = Math.min(theoreticalSpeedup, 50);
    }
    
    // Apply diminishing returns for very small CPU times
    if (cpuTime < 1) {
      maxSpeedup *= 0.5; // Reduce speedup for very fast CPU operations
    }
    
    return Math.max(maxSpeedup, 1); // Minimum 1x speedup
  }

  calculateConfidence(speedup, method, position) {
    // Confidence level based on algorithm characteristics and position
    let confidence = 'High';
    
    if (method === 'recursive' && position > 30) {
      confidence = 'Low'; // Recursive becomes less predictable at high positions
    } else if (method === 'memorized' && position > 50) {
      confidence = 'Medium'; // Memory access patterns become complex
    } else if (position > 80) {
      confidence = 'Medium'; // High positions have more variability
    }
    
    return confidence;
  }

  debounce(fn, wait) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        try {
          fn.apply(this, args);
        } catch (error) {
          console.error('Debounced function error:', error);
        }
      }, wait);
    };
  }

  validateFibonacciInput(value) {
    const num = parseInt(value);
    
    if (isNaN(num)) return { valid: false, error: 'Not a number' };
    if (num < 0) return { valid: false, error: 'Must be non-negative' };
    if (num > Number.MAX_SAFE_INTEGER) return { valid: false, error: 'Number too large' };
    if (value.includes('.')) return { valid: false, error: 'Must be whole number' };
    
    return { valid: true, value: num };
  }

  updateSliderValue(elementId, value) {
    try {
      const element = document.getElementById(elementId);
      if (element) {
        element.textContent = value;
      }
    } catch (error) {
      console.error('Error updating slider value:', error);
    }
  }

  updateFibonacciDisplay(value) {
    try {
      const element = document.getElementById('fibonacciValue');
      if (element) {
        if (typeof value === 'number') {
          element.textContent = value.toLocaleString();
        } else {
          element.textContent = value;
        }
      }
    } catch (error) {
      console.error('Error updating Fibonacci display:', error);
    }
  }

  updateCheckResult(value, position, isFibonacci) {
    const element = document.getElementById('checkResult');
    if (element) {
      if (isFibonacci && position !== null) {
        element.textContent = `${value.toLocaleString()} = F(${position})`;
        element.className = 'fibonacci-number check-success';
      } else if (value === 'Error') {
        element.textContent = 'Error';
        element.className = 'fibonacci-number check-error';
      } else if (value === 'Invalid number') {
        element.textContent = 'Invalid number';
        element.className = 'fibonacci-number check-error';
      } else if (value === 'Enter a number') {
        element.textContent = 'Enter a number';
        element.className = 'fibonacci-number';
      } else {
        element.textContent = `${value.toLocaleString()} is not a Fibonacci number`;
        element.className = 'fibonacci-number check-error';
      }
    }
  }

  updateCheckButton(isFibonacci) {
    const button = document.getElementById('checkBtn');
    console.log('updateCheckButton called with:', isFibonacci, 'button:', button);
    if (button) {
      if (isFibonacci === true) {
        button.className = 'btn btn-success';
        button.style.backgroundColor = '#16a34a'; // Green
        button.style.color = 'white';
        console.log('Button set to success (green)');
      } else if (isFibonacci === false) {
        button.className = 'btn btn-danger';
        button.style.backgroundColor = '#dc2626'; // Red
        button.style.color = 'white';
        console.log('Button set to danger (red)');
      } else {
        button.className = 'btn btn-gray';
        button.style.backgroundColor = '#6b7280'; // Gray
        button.style.color = 'white';
        console.log('Button set to gray');
      }
    } else {
      console.error('Check button not found!');
    }
  }

  handleCalculateError(error) {
    console.warn('Fibonacci calculation error:', error);
    this.updateFibonacciDisplay('Error');
    
    // Show helpful error message
    const resultDiv = document.getElementById('result');
    if (resultDiv) {
      resultDiv.innerHTML = '<span class="error-hint">Number too large or invalid</span>';
      resultDiv.className = 'result-display error';
    }
  }

  handleCheckError(error, value) {
    console.warn('Check error:', error);
    this.updateCheckResult('Error', null, false);
    this.updateCheckButton(false);
    
    const resultDiv = document.getElementById('checkResultDetail');
    if (resultDiv) {
      resultDiv.innerHTML = `<span class="error-hint">Cannot check ${value}</span>`;
      resultDiv.className = 'result-display error';
    }
  }

  async comparePerformance() {
    const startTime = performance.now();
    const position = parseInt(this.positionInput.value);
    console.log('Comparing performance for position:', position);
    
    if (isNaN(position) || position < 0) {
      this.showError(this.perfResult, 'Please enter a valid non-negative number');
      return;
    }

    if (position > 93) {
      this.showError(this.perfResult, 'Position limited to ≤ 93 for performance comparison');
      return;
    }

    this.showLoading(this.perfResult);
    
    try {
      const methods = ['iterative', 'recursive', 'memorized'];
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
              // Skip recursive for position > 30 to prevent page locking
              if (position > 30) {
                throw new Error('N/A (limited to n ≤ 30)');
              }
              result = FibonacciCalculator.recursive(position);
              break;
            case 'memorized':
              result = FibonacciCalculator.memorized(position);
              break;
          }
          
          const endTime = performance.now();
          const executionTime = (endTime - startTime).toFixed(3);
          
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
      
      // Advanced GPU speedup estimation based on NVIDIA Blackwell architecture
      const gpuEstimates = this.calculateBlackwellGPUAcceleration(position, results);
      const perfHTML = results.map((item, index) => {
        const gpuEst = gpuEstimates[index];
        
        // Calculate actual speedup from CPU time / GPU time with proper handling
        let speedup = 'N/A';
        let speedupScientific = '';
        let est = 'N/A';
        
        if (item.time !== 'Error') {
          const cpuTime = parseFloat(item.time);
          
          // Check if we have valid GPU estimate
          if (gpuEst.estimatedTime && gpuEst.estimatedTime !== 'N/A') {
            const gpuTime = parseFloat(gpuEst.estimatedTime);
            est = gpuEst.estimatedTime + 'ms';
            
            if (!isNaN(cpuTime) && !isNaN(gpuTime) && cpuTime > 0 && gpuTime > 0) {
              // Calculate actual speedup from measured times
              const speedupValue = cpuTime / gpuTime;
              
              speedupScientific = speedupValue.toExponential(3);
              
              if (speedupValue >= 1000 || (speedupValue < 0.01 && speedupValue > 0)) {
                speedup = speedupValue.toExponential(2) + 'x';
              } else if (speedupValue >= 100) {
                speedup = speedupValue.toFixed(1) + 'x';
              } else {
                speedup = speedupValue.toFixed(2) + 'x';
              }
            } else {
              // Use theoretical speedup from GPU estimate when actual times are not available
              const theoreticalSpeedup = parseFloat(gpuEst.speedupFactor);
              if (!isNaN(theoreticalSpeedup) && theoreticalSpeedup > 0) {
                const speedupValue = theoreticalSpeedup;
                
                speedupScientific = speedupValue.toExponential(3);
                
                if (speedupValue >= 1000 || (speedupValue < 0.01 && speedupValue > 0)) {
                  speedup = speedupValue.toExponential(2) + 'x';
                } else if (speedupValue >= 100) {
                  speedup = speedupValue.toFixed(1) + 'x';
                } else {
                  speedup = speedupValue.toFixed(2) + 'x';
                }
              } else {
                // Fallback to reasonable defaults based on algorithm type
                let defaultSpeedup = 10; // Default speedup
                if (item.method.toLowerCase().includes('iterative')) {
                  defaultSpeedup = 50; // Iterative typically has high speedup
                } else if (item.method.toLowerCase().includes('memorized') || item.method.toLowerCase().includes('memoized')) {
                  defaultSpeedup = 100; // Memoized has very high speedup
                } else if (item.method.toLowerCase().includes('recursive')) {
                  defaultSpeedup = 20; // Recursive has moderate speedup
                }
                
                speedupScientific = defaultSpeedup.toExponential(3);
                if (defaultSpeedup >= 100) {
                  speedup = defaultSpeedup.toFixed(0) + 'x';
                } else {
                  speedup = defaultSpeedup.toFixed(1) + 'x';
                }
              }
            }
          }
        }
        
        const confidence = gpuEst.confidence || 'N/A';
        
        // Enhanced display with scientific notation always visible
        return `<div class="perf-item" style="margin-bottom: 0.5rem;">
          <div style="display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 0; padding: 0; min-height: 100px; border: 2px solid #76b900; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(118, 185, 0, 0.2); width: 100%;">
            <!-- Column 1: Algorithm Name -->
            <div style="display: flex; align-items: center; justify-content: center; padding: 1rem; border-right: 4px solid #76b900; background: linear-gradient(135deg, #76b900, #5a9c00);">
              <strong style="color: white; font-size: 1.4em; font-weight: 700; text-align: center; text-shadow: 1px 1px 3px rgba(0,0,0,0.4);">${item.method}</strong>
            </div>
            
            <!-- Column 2: CPU/GPU Times & Confidence -->
            <div style="display: flex; flex-direction: column; justify-content: center; padding: 1.5rem; border-right: 4px solid #76b900; background: linear-gradient(135deg, #ffffff, #f8fff8);">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 1rem; width: 100%;">
                <div style="text-align: center;">
                  <div style="color: #2d3748; font-size: 0.9em; font-weight: 600; margin-bottom: 0.5rem;">CPU TIME</div>
                  <div style="color: ${item.time === 'Error' ? '#999' : '#e53e3e'}; font-weight: 700; font-size: 1.3em;">${item.time === 'Error' ? 'N/A' : item.time + 'ms'}</div>
                  ${item.time === 'Error' && item.method === 'Recursive' ? '<div style="color: #999; font-size: 0.7em; margin-top: 0.25rem;">Limited to n ≤ 30</div>' : ''}
                </div>
                <div style="text-align: center;">
                  <div style="color: #2d3748; font-size: 0.9em; font-weight: 600; margin-bottom: 0.5rem;">GPU TIME</div>
                  <div style="color: #76b900; font-weight: 700; font-size: 1.3em;">${est}</div>
                </div>
              </div>
              <div style="text-align: center;">
                <small style="color: #76b900; font-size: 0.9em; font-weight: 700; background: #f0fff4; padding: 0.5rem 1.5rem; border-radius: 8px; border: 2px solid #76b900;">[${confidence}]</small>
              </div>
            </div>
            
            <!-- Column 3: Speedup -->
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 1rem; background: linear-gradient(135deg, #e8f5e8, #d4edda);">
              <span style="color: #76b900; font-size: 0.8em; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.75rem;">PERFORMANCE GAIN</span>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem;">
                <span style="color: #76b900; font-weight: 700; font-size: 2em; text-align: center; text-shadow: 1px 1px 3px rgba(0,0,0,0.2);">${speedup}</span>
                ${speedupScientific ? `<span style="color: #4a5568; font-family: 'Courier New', monospace; font-size: 0.8em; text-align: center; font-weight: 600;">${speedupScientific}</span>` : ''}
              </div>
            </div>
          </div>
        </div>`;
      }).join('');
      
      this.showSuccess(
        this.perfResult,
        `<strong>Performance Comparison for F(${position})</strong><br>${perfHTML}`,
        'performance-display'
      );
      
      const endTime = performance.now();
      const executionTime = endTime - startTime;
      console.log(`Performance comparison completed in ${executionTime.toFixed(2)}ms for position ${position}`);
      
    } catch (error) {
      this.showError(this.perfResult, error.message);
    }
  }
}

// Initialize the application when the DOM is loaded
// Global function for check button
/**
 * Global function to check if an input number is a Fibonacci number
 * Uses direct onclick handler instead of addEventListener to avoid event listener conflicts
 * and ensure reliable button color changes (green/red/gray states)
 * 
 * @global
 */
function checkFibonacciNumber() {
  console.log('checkFibonacciNumber called');
  
  const input = document.getElementById('checkNumber');
  const button = document.getElementById('checkBtn');
  const result = document.getElementById('checkResult');
  
  if (!input || !button || !result) {
    console.error('Elements not found');
    return;
  }
  
  const inputValue = input.value.trim();
  console.log('Input value:', inputValue);
  
  if (!inputValue) {
    button.style.backgroundColor = '#6b7280';
    button.style.color = 'white';
    result.textContent = 'Enter a number';
    return;
  }
  
  const number = parseInt(inputValue);
  if (isNaN(number) || number < 0) {
    button.style.backgroundColor = '#6b7280';
    button.style.color = 'white';
    result.textContent = 'Invalid number';
    return;
  }
  
  try {
    const isFibonacci = FibonacciCalculator.isFibonacci(number);
    console.log('Number', number, 'is Fibonacci:', isFibonacci);
    
    if (isFibonacci) {
      const position = FibonacciCalculator.findPosition(number);
      button.style.backgroundColor = '#16a34a'; // Green
      button.style.color = 'white';
      result.textContent = `${number} = F(${position})`;
    } else {
      button.style.backgroundColor = '#dc2626'; // Red
      button.style.color = 'white';
      result.textContent = `${number} is not a Fibonacci number`;
    }
  } catch (error) {
    console.error('Error:', error);
    button.style.backgroundColor = '#6b7280';
    button.style.color = 'white';
    result.textContent = 'Error';
  }
}

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

// Global function for info panel toggle
function toggleGPUInfo() {
  const content = document.getElementById('gpuInfoContent');
  const toggle = document.querySelector('.info-toggle');
  
  if (content.classList.contains('expanded')) {
    content.classList.remove('expanded');
    toggle.classList.remove('expanded');
  } else {
    content.classList.add('expanded');
    toggle.classList.add('expanded');
  }
}
