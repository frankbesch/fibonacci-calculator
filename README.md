# Fibonacci Calculator Application

A comprehensive Fibonacci sequence calculator with multiple interfaces and implementations. This application provides various ways to calculate, explore, and understand the Fibonacci sequence and its mathematical properties.

## 🌟 Features

- **Multiple Calculation Methods**: Iterative, recursive, and memoized implementations
- **Web Interface**: Beautiful, modern web application with interactive UI
- **Command Line Interface**: Full-featured CLI with colored output and help system
- **Comprehensive Testing**: Extensive test suite covering all functionality
- **Performance Comparison**: Built-in performance benchmarking
- **Mathematical Tools**: Fibonacci checking, golden ratio calculation, sequence generation

## 📁 Project Structure

```
fibonacci-app/
├── fibonacci.js      # Core Fibonacci calculation functions
├── index.html        # Web application interface
├── styles.css        # Modern CSS styling
├── app.js           # Web application JavaScript
├── cli.js           # Command-line interface
├── test.js          # Comprehensive test suite
└── README.md        # This documentation
```

## 🚀 Quick Start

### Web Application

1. Open `index.html` in your web browser
2. Use the interactive interface to:
   - Calculate individual Fibonacci numbers
   - Generate sequences
   - Check if numbers are Fibonacci
   - Calculate golden ratio approximations
   - Compare method performance

### Command Line Interface

```bash
# Make the CLI executable
chmod +x cli.js

# Run the CLI
node cli.js

# Or run directly
./cli.js
```

### Running Tests

```bash
node test.js
```

## 🧮 Core Functions

### FibonacciCalculator Class

The core functionality is provided by the `FibonacciCalculator` class with the following methods:

#### `iterative(n)`
Calculate Fibonacci number using iterative approach.
- **Time Complexity**: O(n)
- **Space Complexity**: O(1)
- **Best for**: Large numbers, performance-critical applications

```javascript
FibonacciCalculator.iterative(10); // Returns 55
```

#### `recursive(n)`
Calculate Fibonacci number using recursive approach.
- **Time Complexity**: O(2^n)
- **Space Complexity**: O(n)
- **Best for**: Small numbers, educational purposes

```javascript
FibonacciCalculator.recursive(10); // Returns 55
```

#### `memoized(n, memo = {})`
Calculate Fibonacci number using memoized recursive approach.
- **Time Complexity**: O(n)
- **Space Complexity**: O(n)
- **Best for**: Medium numbers, balanced performance

```javascript
FibonacciCalculator.memoized(10); // Returns 55
```

#### `sequence(n)`
Generate Fibonacci sequence with n terms.

```javascript
FibonacciCalculator.sequence(10); // Returns [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

#### `isFibonacci(num)`
Check if a number is a Fibonacci number.

```javascript
FibonacciCalculator.isFibonacci(21); // Returns true
FibonacciCalculator.isFibonacci(22); // Returns false
```

#### `findPosition(num)`
Find the position of a Fibonacci number in the sequence.

```javascript
FibonacciCalculator.findPosition(21); // Returns 8 (F(8) = 21)
FibonacciCalculator.findPosition(22); // Returns null
```

#### `goldenRatio(n)`
Calculate golden ratio approximation using Fibonacci numbers.

```javascript
FibonacciCalculator.goldenRatio(20); // Returns ~1.618033988749895
```

## 💻 Command Line Interface

The CLI provides an interactive command-line experience with the following commands:

### Available Commands

- `calc <n> [method]` - Calculate Fibonacci number at position n
- `seq <n>` - Generate Fibonacci sequence with n terms
- `check <number>` - Check if a number is a Fibonacci number
- `golden <n>` - Calculate golden ratio approximation at position n
- `perf <n>` - Compare performance of all methods at position n
- `examples` - Show example commands
- `help` - Show help message
- `exit`, `quit` - Exit the program

### Example Usage

```bash
fibonacci> calc 10
🔢 Result: F(10) = 55
⚡ Method: iterative | Time: 0.05ms

fibonacci> seq 15
📊 Fibonacci Sequence (15 terms):
──────────────────────────────────────────────────
F( 0) =          0
F( 1) =          1
F( 2) =          1
F( 3) =          2
F( 4) =          3
F( 5) =          5
F( 6) =          8
F( 7) =         13
F( 8) =         21
F( 9) =         34
F(10) =         55
F(11) =         89
F(12) =        144
F(13) =        233
F(14) =        377

fibonacci> check 21
✅ 21 is a Fibonacci number!
📍 Position: F(8)

fibonacci> golden 25
🌟 Golden Ratio Approximation:
📐 F(25)/F(24) = 1.6180339887
🎯 Actual φ = 1.6180339887
📊 Accuracy: 99.9999999999%

fibonacci> perf 30
⚡ Performance Comparison for F(30):
──────────────────────────────────────────────────
iterative: 0.05ms
recursive: 15.23ms
memoized:  0.12ms

🏆 Fastest: iterative (0.05ms)
```

## 🌐 Web Application

The web application provides a modern, responsive interface with the following features:

### Features
- **Interactive Calculator**: Calculate Fibonacci numbers with different methods
- **Sequence Generator**: Generate and display Fibonacci sequences
- **Fibonacci Checker**: Check if numbers are Fibonacci numbers
- **Golden Ratio Calculator**: Calculate golden ratio approximations
- **Performance Comparison**: Compare execution times of different methods
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Beautiful gradient backgrounds and smooth animations

### Usage
1. Open `index.html` in your web browser
2. Use the various sections to perform different calculations
3. Try different methods and compare their performance
4. Explore the mathematical properties of the Fibonacci sequence

## 🧪 Testing

The application includes a comprehensive test suite that covers:

- **Basic Functionality**: All calculation methods with known values
- **Edge Cases**: Negative numbers, zero, large numbers
- **Mathematical Properties**: Fibonacci checking, golden ratio calculations
- **Method Consistency**: All methods return identical results
- **Performance**: Large number calculations and timing
- **Error Handling**: Proper error messages for invalid inputs

### Running Tests

```bash
node test.js
```

### Test Coverage

- ✅ Iterative method (basic cases, large numbers, edge cases)
- ✅ Recursive method (basic cases, medium numbers, edge cases)
- ✅ Memoized method (basic cases, large numbers, edge cases)
- ✅ Sequence generation (empty, small, medium sequences)
- ✅ Fibonacci number checking (known numbers, non-Fibonacci numbers)
- ✅ Position finding (known positions, non-Fibonacci numbers)
- ✅ Golden ratio calculation (basic, large calculations)
- ✅ Method consistency (all methods return same results)
- ✅ Perfect square helper function
- ✅ Performance testing (large number calculations)

## 📊 Performance Characteristics

### Method Comparison

| Method    | Time Complexity | Space Complexity | Best For           |
|-----------|----------------|------------------|--------------------|
| Iterative | O(n)           | O(1)             | Large numbers      |
| Recursive | O(2^n)         | O(n)             | Small numbers      |
| Memoized  | O(n)           | O(n)             | Medium numbers     |

### Performance Recommendations

- **Use Iterative** for numbers > 40 or performance-critical applications
- **Use Recursive** for educational purposes or numbers ≤ 20
- **Use Memoized** for balanced performance with numbers 20-40

## 🔬 Mathematical Background

### Fibonacci Sequence
The Fibonacci sequence is defined as:
- F(0) = 0
- F(1) = 1
- F(n) = F(n-1) + F(n-2) for n > 1

### Golden Ratio
The golden ratio (φ) is approximately 1.618033988749895 and can be approximated using consecutive Fibonacci numbers:
φ ≈ F(n+1) / F(n) as n approaches infinity

### Fibonacci Number Detection
A number n is a Fibonacci number if and only if one of (5n² + 4) or (5n² - 4) is a perfect square.

## 🛠️ Technical Details

### Browser Compatibility
- Modern browsers with ES6+ support
- Responsive design works on mobile devices
- Uses CSS Grid and Flexbox for layout

### Node.js Requirements
- Node.js 12+ for CLI and testing
- No external dependencies required

### File Structure
- **fibonacci.js**: Core mathematical functions
- **index.html**: Web application structure
- **styles.css**: Modern CSS with gradients and animations
- **app.js**: Web application interactivity
- **cli.js**: Command-line interface with colored output
- **test.js**: Comprehensive test suite

## 🎯 Use Cases

### Educational
- Learn about different algorithmic approaches
- Understand recursion vs iteration
- Explore mathematical properties
- Practice with test-driven development

### Development
- Benchmark different implementations
- Compare algorithm performance
- Study memoization techniques
- Build interactive web applications

### Mathematical
- Calculate Fibonacci numbers
- Generate sequences for analysis
- Check number properties
- Approximate golden ratio

## 🤝 Contributing

This is a demonstration project showcasing:
- Multiple Fibonacci implementations
- Modern web development
- Command-line interfaces
- Comprehensive testing
- Mathematical programming

Feel free to use this code as a reference or starting point for your own projects!

## 📝 License

This project is open source and available under the MIT License.

---

**Built with ❤️ and mathematics**
