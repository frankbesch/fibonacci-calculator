#!/usr/bin/env python3
"""Draw the README pictures as light and dark SVG.

Usage: python3 docs/diagrams/charts.py
Writes one pair of equal height: how the four methods compute, beside the
measured time per call. Every time is copied from
docs/runs/2026-10-03-methods.txt (npm run bench), and main() checks each one
is still there. The drawing code is quoin_readme.py, a copy of the Quoin README
module.
"""
from pathlib import Path

from quoin_readme import THEMES, GREEN, BLUE, OCHRE, M, R, note, head, svg, box, box_h, pair, panels

HERE = Path(__file__).resolve().parent
RECEIPT = HERE.parent / "runs" / "2026-10-03-methods.txt"

METHODS = [  # name, how, cost, kind
    ("recursive", "F(n - 1) + F(n - 2), recomputed", "2^n calls: n = 30 only", "security"),
    ("iterative", "walk up from F(0) and F(1)", "n additions", "backend"),
    ("memoized", "extend a shared table", "n once, then a lookup", "database"),
    ("fastDoubling", "F(2k), F(2k + 1) from F(k), F(k + 1)", "log n steps", "bus"),
]
METHODS_DESC = ("Four methods, all exact with BigInt. recursive adds F(n - 1) and F(n - 2) and "
                "recomputes both, about 2^n calls, so it runs only for small n. iterative walks up from "
                "F(0) and F(1) in n additions. memoized extends a shared table once, then looks values "
                "up. fastDoubling builds F(2k) and F(2k + 1) from F(k) and F(k + 1), in about log n "
                "steps. A JavaScript Number is exact only to 2^53, so it reads F(79) as "
                "14,472,334,024,676,220; the exact value ends in 221.")

# Median ms per call, copied from the receipt: (n, method, ms).
TIMES = [(10000, "iterative", "0.4738"), (10000, "fastDoubling", "0.0070"), (10000, "memoized", "0.0001"),
         (1000, "iterative", "0.0219"), (1000, "fastDoubling", "0.0014"), (1000, "memoized", "0.0001")]
RECURSIVE_30 = ("21.7693", "0.0019")  # recursive and iterative at n = 30
TIMES_DESC = ("Median time per call on an Apple M4, Node 26.8.1, 25 runs after 5 warm-up runs. "
              + " ".join(f"n = {n}, {m}: {ms} ms." for n, m, ms in TIMES)
              + f" At n = 30, recursive takes {RECURSIVE_30[0]} ms and iterative {RECURSIVE_30[1]} ms. "
                "memoized is timed after its table is built.")


def methods(c, spread=0.0, h=0):
    """Four boxes, one per method. spread opens the gaps between them."""
    g = round(16 * spread)
    b, y = head("Four ways to compute F(n)", c)
    y -= 10
    for i, (name, how, cost, k) in enumerate(METHODS):
        bh = box_h(how, cost, R - M)
        b += box(M, y, R - M, bh, name, how, cost, k, c)
        y += bh
        y += 14 + g  # four alternatives, not a sequence: no arrows
    lines, y = note(y + 26, "All four are exact with BigInt. A JavaScript Number reads F(79) as "
                    "...220; the exact value ends in 221.", c)
    return svg(max(y, h), "Four ways to compute F(n)", METHODS_DESC, b + lines, c)


def times(c, spread=0.0, h=0):
    """Time per call at two sizes, on one millisecond scale."""
    rows = lambda n: [(m, float(ms), f"{ms} ms") for k, m, ms in TIMES if k == n]
    return panels(dict(
        title="Time per call, Apple M4",
        sub="Median of 25 runs, Node 26.8.1, one millisecond scale.",
        panels=[("F(10000), 2,090 digits", [GREEN, BLUE, OCHRE], rows(10000)),
                ("F(1000), 209 digits", [GREEN, BLUE, OCHRE], rows(1000))],
        notes=[f"recursive is off this scale: {RECURSIVE_30[0]} ms at n = 30, where iterative takes "
               f"{RECURSIVE_30[1]} ms. memoized is timed after its table is built."],
        desc=TIMES_DESC), c, spread, h)


PAIRS = [("methods", methods, "times", times)]


def main():
    receipt = RECEIPT.read_text()
    for n, m, ms in TIMES:
        assert f"n={n} {m} {ms}" in receipt, (n, m, ms)
    assert f"n=30 recursive {RECURSIVE_30[0]}" in receipt and f"n=30 iterative {RECURSIVE_30[1]}" in receipt
    assert "Apple M4" in receipt and "node v26.8.1" in receipt
    for theme, c in THEMES.items():
        for ln, lf, rn, rf in PAIRS:
            for name, s in zip((ln, rn), pair(lf, rf, c)):
                (HERE / f"{name}-{theme}.svg").write_text(s)
    print("built", ", ".join(f"{ln} | {rn}" for ln, _, rn, _ in PAIRS))


if __name__ == "__main__":
    main()
