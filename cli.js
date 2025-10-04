#!/usr/bin/env node

/**
 * Fibonacci Calculator CLI
 * Command-line interface for Fibonacci calculations
 */

const FibonacciCalculator = require('./fibonacci.js');
const readline = require('readline');

class FibonacciCLI {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    this.colors = {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      dim: '\x1b[2m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      white: '\x1b[37m'
    };
  }

  colorize(text, color) {
    return `${this.colors[color]}${text}${this.colors.reset}`;
  }

  printHeader() {
    console.log(this.colorize('\n╔══════════════════════════════════════════════════════════════╗', 'cyan'));
    console.log(this.colorize('║                    Fibonacci Calculator CLI                   ║', 'cyan'));
    console.log(this.colorize('╚══════════════════════════════════════════════════════════════╝', 'cyan'));
    console.log(this.colorize('\nWelcome to the Fibonacci Calculator! 🧮', 'bright'));
    console.log(this.colorize('Type "help" for available commands or "exit" to quit.\n', 'dim'));
  }

  printHelp() {
    console.log(this.colorize('\n📚 Available Commands:', 'bright'));
    console.log(this.colorize('─────────────────────', 'dim'));
    console.log(this.colorize('calc <n> [method]     Calculate Fibonacci number at position n', 'white'));
    console.log(this.colorize('                     Methods: iterative (default), recursive, memoized', 'dim'));
    console.log(this.colorize('seq <n>               Generate Fibonacci sequence with n terms', 'white'));
    console.log(this.colorize('check <number>        Check if a number is a Fibonacci number', 'white'));
    console.log(this.colorize('golden <n>            Calculate golden ratio approximation at position n', 'white'));
    console.log(this.colorize('perf <n>              Compare performance of all methods at position n', 'white'));
    console.log(this.colorize('examples             Show example commands', 'white'));
    console.log(this.colorize('help                  Show this help message', 'white'));
    console.log(this.colorize('exit, quit            Exit the program', 'white'));
    console.log(this.colorize('\n💡 Tips:', 'bright'));
    console.log(this.colorize('• Use Ctrl+C to exit at any time', 'dim'));
    console.log(this.colorize('• Large numbers (>40) work best with iterative or memoized methods', 'dim'));
    console.log(this.colorize('• Recursive method is limited to smaller numbers for performance', 'dim'));
  }

  printExamples() {
    console.log(this.colorize('\n🎯 Example Commands:', 'bright'));
    console.log(this.colorize('───────────────────', 'dim'));
    console.log(this.colorize('calc 10              # Calculate F(10) using iterative method', 'white'));
    console.log(this.colorize('calc 20 recursive    # Calculate F(20) using recursive method', 'white'));
    console.log(this.colorize('calc 30 memoized     # Calculate F(30) using memoized method', 'white'));
    console.log(this.colorize('seq 15                # Generate first 15 Fibonacci numbers', 'white'));
    console.log(this.colorize('check 21              # Check if 21 is a Fibonacci number', 'white'));
    console.log(this.colorize('golden 25             # Calculate golden ratio approximation', 'white'));
    console.log(this.colorize('perf 35               # Compare performance of all methods', 'white'));
  }

  async calculateSingleNumber(position, method = 'iterative') {
    try {
      const startTime = process.hrtime.bigint();
      
      let result;
      switch (method.toLowerCase()) {
        case 'iterative':
          result = FibonacciCalculator.iterative(position);
          break;
        case 'recursive':
          if (position > 40) {
            console.log(this.colorize('⚠️  Recursive method limited to position ≤ 40 for performance', 'yellow'));
            return;
          }
          result = FibonacciCalculator.recursive(position);
          break;
        case 'memoized':
          result = FibonacciCalculator.memoized(position);
          break;
        default:
          console.log(this.colorize('❌ Invalid method. Use: iterative, recursive, or memoized', 'red'));
          return;
      }
      
      const endTime = process.hrtime.bigint();
      const executionTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds
      
      console.log(this.colorize(`\n🔢 Result: F(${position}) = ${result.toLocaleString()}`, 'green'));
      console.log(this.colorize(`⚡ Method: ${method} | Time: ${executionTime.toFixed(2)}ms`, 'dim'));
      
    } catch (error) {
      console.log(this.colorize(`❌ Error: ${error.message}`, 'red'));
    }
  }

  async generateSequence(length) {
    try {
      const startTime = process.hrtime.bigint();
      const sequence = FibonacciCalculator.sequence(length);
      const endTime = process.hrtime.bigint();
      const executionTime = Number(endTime - startTime) / 1000000;
      
      console.log(this.colorize(`\n📊 Fibonacci Sequence (${length} terms):`, 'green'));
      console.log(this.colorize('─'.repeat(50), 'dim'));
      
      sequence.forEach((num, index) => {
        const position = index.toString().padStart(2, ' ');
        const number = num.toLocaleString().padStart(10, ' ');
        console.log(this.colorize(`F(${position}) = ${number}`, 'white'));
      });
      
      console.log(this.colorize(`\n⚡ Generated in ${executionTime.toFixed(2)}ms`, 'dim'));
      
    } catch (error) {
      console.log(this.colorize(`❌ Error: ${error.message}`, 'red'));
    }
  }

  async checkFibonacci(number) {
    try {
      const startTime = process.hrtime.bigint();
      const isFib = FibonacciCalculator.isFibonacci(number);
      const position = isFib ? FibonacciCalculator.findPosition(number) : null;
      const endTime = process.hrtime.bigint();
      const executionTime = Number(endTime - startTime) / 1000000;
      
      if (isFib) {
        console.log(this.colorize(`\n✅ ${number} is a Fibonacci number!`, 'green'));
        console.log(this.colorize(`📍 Position: F(${position})`, 'cyan'));
      } else {
        console.log(this.colorize(`\n❌ ${number} is not a Fibonacci number`, 'red'));
      }
      
      console.log(this.colorize(`⚡ Checked in ${executionTime.toFixed(2)}ms`, 'dim'));
      
    } catch (error) {
      console.log(this.colorize(`❌ Error: ${error.message}`, 'red'));
    }
  }

  async calculateGoldenRatio(position) {
    try {
      const startTime = process.hrtime.bigint();
      const ratio = FibonacciCalculator.goldenRatio(position);
      const endTime = process.hrtime.bigint();
      const executionTime = Number(endTime - startTime) / 1000000;
      
      const actualGoldenRatio = (1 + Math.sqrt(5)) / 2;
      const difference = Math.abs(ratio - actualGoldenRatio);
      const accuracy = ((1 - difference / actualGoldenRatio) * 100).toFixed(2);
      
      console.log(this.colorize(`\n🌟 Golden Ratio Approximation:`, 'yellow'));
      console.log(this.colorize(`📐 F(${position})/F(${position-1}) = ${ratio.toFixed(10)}`, 'white'));
      console.log(this.colorize(`🎯 Actual φ = ${actualGoldenRatio.toFixed(10)}`, 'cyan'));
      console.log(this.colorize(`📊 Accuracy: ${accuracy}%`, 'green'));
      console.log(this.colorize(`⚡ Calculated in ${executionTime.toFixed(2)}ms`, 'dim'));
      
    } catch (error) {
      console.log(this.colorize(`❌ Error: ${error.message}`, 'red'));
    }
  }

  async comparePerformance(position) {
    try {
      const methods = ['iterative', 'recursive', 'memoized'];
      const results = [];
      
      console.log(this.colorize(`\n⚡ Performance Comparison for F(${position}):`, 'bright'));
      console.log(this.colorize('─'.repeat(50), 'dim'));
      
      for (const method of methods) {
        const startTime = process.hrtime.bigint();
        let result;
        
        try {
          switch (method) {
            case 'iterative':
              result = FibonacciCalculator.iterative(position);
              break;
            case 'recursive':
              if (position > 40) {
                console.log(this.colorize(`${method.padEnd(10)}: Skipped (position > 40)`, 'yellow'));
                continue;
              }
              result = FibonacciCalculator.recursive(position);
              break;
            case 'memoized':
              result = FibonacciCalculator.memoized(position);
              break;
          }
          
          const endTime = process.hrtime.bigint();
          const executionTime = Number(endTime - startTime) / 1000000;
          
          console.log(this.colorize(`${method.padEnd(10)}: ${executionTime.toFixed(2)}ms`, 'white'));
          results.push({ method, time: executionTime });
          
        } catch (error) {
          console.log(this.colorize(`${method.padEnd(10)}: Error - ${error.message}`, 'red'));
        }
      }
      
      if (results.length > 1) {
        const fastest = results.reduce((min, current) => 
          current.time < min.time ? current : min
        );
        console.log(this.colorize(`\n🏆 Fastest: ${fastest.method} (${fastest.time.toFixed(2)}ms)`, 'green'));
      }
      
    } catch (error) {
      console.log(this.colorize(`❌ Error: ${error.message}`, 'red'));
    }
  }

  async processCommand(input) {
    const parts = input.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    
    switch (command) {
      case 'calc':
        if (parts.length < 2) {
          console.log(this.colorize('❌ Usage: calc <position> [method]', 'red'));
          return;
        }
        const position = parseInt(parts[1]);
        const method = parts[2] || 'iterative';
        await this.calculateSingleNumber(position, method);
        break;
        
      case 'seq':
        if (parts.length < 2) {
          console.log(this.colorize('❌ Usage: seq <length>', 'red'));
          return;
        }
        const length = parseInt(parts[1]);
        await this.generateSequence(length);
        break;
        
      case 'check':
        if (parts.length < 2) {
          console.log(this.colorize('❌ Usage: check <number>', 'red'));
          return;
        }
        const number = parseInt(parts[1]);
        await this.checkFibonacci(number);
        break;
        
      case 'golden':
        if (parts.length < 2) {
          console.log(this.colorize('❌ Usage: golden <position>', 'red'));
          return;
        }
        const goldenPos = parseInt(parts[1]);
        await this.calculateGoldenRatio(goldenPos);
        break;
        
      case 'perf':
        if (parts.length < 2) {
          console.log(this.colorize('❌ Usage: perf <position>', 'red'));
          return;
        }
        const perfPos = parseInt(parts[1]);
        await this.comparePerformance(perfPos);
        break;
        
      case 'examples':
        this.printExamples();
        break;
        
      case 'help':
        this.printHelp();
        break;
        
      case 'exit':
      case 'quit':
        console.log(this.colorize('\n👋 Thanks for using Fibonacci Calculator! Goodbye!', 'cyan'));
        this.rl.close();
        return;
        
      default:
        console.log(this.colorize('❌ Unknown command. Type "help" for available commands.', 'red'));
    }
  }

  async start() {
    this.printHeader();
    
    const askQuestion = () => {
      this.rl.question(this.colorize('fibonacci> ', 'cyan'), async (input) => {
        if (input.trim()) {
          await this.processCommand(input);
        }
        askQuestion();
      });
    };
    
    askQuestion();
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log(this.colorize('\n\n👋 Goodbye!', 'cyan'));
  process.exit(0);
});

// Start the CLI
const cli = new FibonacciCLI();
cli.start();
