#!/usr/bin/env node
// Fibonacci CLI. Exact at any position (BigInt).
//
//   fibonacci 100             prints F(100), digits only, for scripts
//   fibonacci calc 100 fast   one command, then exit
//   fibonacci                 interactive prompt; "help" lists commands

const readline = require('node:readline');
const F = require('./fibonacci.js');

const METHODS = { iterative: 'iterative', recursive: 'recursive', memoized: 'memoized', fast: 'fastDoubling' };
const RECURSIVE_LIMIT = 35;  // 2^n calls: beyond this the textbook method takes seconds
const tty = process.stdout.isTTY;
const paint = (code, s) => (tty ? `\x1b[${code}m${s}\x1b[0m` : s);
const dim = (s) => paint(2, s);
const bold = (s) => paint(1, s);
const red = (s) => paint(31, s);

function ms(t0) {
  return (Number(process.hrtime.bigint() - t0) / 1e6).toFixed(3);
}

const HELP = `Commands:
  calc <n> [method]  F(n); methods: iterative (default), fast, memoized, recursive
  seq <count>        the first <count> terms
  check <number>     is it a Fibonacci number, and at which position
  golden <n>         F(n) / F(n - 1), against phi
  perf <n>           time every method at n
  help               this list
  exit               quit`;

function run(line) {
  const [cmd, a, b] = line.trim().split(/\s+/);
  switch ((cmd || '').toLowerCase()) {
    case 'calc': {
      const method = METHODS[(b || 'iterative').toLowerCase()];
      if (!method) return console.log(red('Method must be one of: iterative, fast, memoized, recursive'));
      if (method === 'recursive' && Number(a) > RECURSIVE_LIMIT) {
        return console.log(red(`recursive is limited to n <= ${RECURSIVE_LIMIT}; use fast or iterative`));
      }
      const t0 = process.hrtime.bigint();
      const v = F[method](a);
      return console.log(`F(${a}) = ${bold(F.format(v))}\n${dim(`${method}, ${ms(t0)} ms, ${v.toString().length} digits`)}`);
    }
    case 'seq': {
      const terms = F.sequence(a);
      const width = String(terms.length - 1).length;
      return terms.forEach((v, i) => console.log(`F(${String(i).padStart(width)}) = ${F.format(v)}`));
    }
    case 'check': {
      if (!/^\d+$/.test(a || '')) return console.log(red('Usage: check <whole number>'));
      const pos = F.findPosition(a);
      return console.log(pos === null ? `${F.format(a)} is not a Fibonacci number`
        : `${F.format(a)} = F(${pos})${a === '1' ? ' and F(2)' : ''}`);
    }
    case 'golden': {
      const r = F.goldenRatio(a);
      const phi = (1 + Math.sqrt(5)) / 2;
      return console.log(`F(${a}) / F(${Number(a) - 1}) = ${r.toFixed(15)}\nphi           = ${phi.toFixed(15)}`);
    }
    case 'perf': {
      for (const [name, method] of Object.entries(METHODS)) {
        if (method === 'recursive' && Number(a) > RECURSIVE_LIMIT) {
          console.log(`${name.padEnd(10)} skipped (n > ${RECURSIVE_LIMIT})`);
          continue;
        }
        const t0 = process.hrtime.bigint();
        F[method](a);
        console.log(`${name.padEnd(10)} ${ms(t0).padStart(10)} ms`);
      }
      return undefined;
    }
    case 'help':
      return console.log(HELP);
    case '':
      return undefined;
    default:
      return console.log(red('Unknown command. Type "help".'));
  }
}

function guarded(line) {
  try {
    run(line);
    return true;
  } catch (e) {
    console.log(red(e.message));
    return false;
  }
}

const args = process.argv.slice(2);
if (args.length === 1 && /^\d+$/.test(args[0])) {
  console.log(F.iterative(args[0]).toString());  // digits only, for scripts
} else if (args.length) {
  process.exitCode = guarded(args.join(' ')) ? 0 : 1;
} else {
  console.log(`Fibonacci calculator. Exact at any position. Type ${bold('help')}.`);
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: 'fibonacci> ' });
  rl.prompt();
  rl.on('line', (line) => {
    if (/^(exit|quit)$/i.test(line.trim())) return rl.close();
    guarded(line);
    return rl.prompt();
  });
  rl.on('SIGINT', () => rl.close());
  rl.on('close', () => console.log(''));
}
