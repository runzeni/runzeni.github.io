---
title: "Module 1: Core Python"
short_title: Core Python that stays readable
series_title: Python notes
series: python-notes
module_number: 1
slug: module-1
permalink: /notes/python-notes/module-1/
markdown_module: true
updated: 2026-07-21
reading_time: 13 min read
description: The small set of language patterns I need to turn an idea into a clear, reusable program.
---

Python is most useful when the code remains obvious six months later. My default is a short script built from small functions, explicit inputs, and ordinary data structures. I add abstractions only after repetition makes them useful.

## The working model

A Python program executes statements in order. A variable is a **name bound to an object**, not a box that contains a private copy. That distinction matters for mutable objects:

```python
measurements = [18.2, 19.1]
alias = measurements
alias.append(17.8)

assert measurements == [18.2, 19.1, 17.8]
assert alias is measurements
```

Use `==` for equal values and `is` for object identity. In routine code, `is` is mainly for singletons such as `None`:

```python
if result is None:
    raise ValueError("Result was not calculated")
```

Copy deliberately when two objects must diverge. A shallow copy is enough when the elements themselves will not be mutated; nested mutable data may need `copy.deepcopy()` or, preferably, a clearer data model.

```python
independent = measurements.copy()
independent.append(20.0)
```

The core containers each communicate a different constraint:

| Type | Use it for | Important property |
| --- | --- | --- |
| `list` | Ordered observations | Mutable; duplicates allowed |
| `tuple` | A fixed record or coordinate | Immutable |
| `dict` | Named fields or a lookup | Keys are unique |
| `set` | Membership and uniqueness | Unordered; duplicates removed |

Choosing the right container often removes conditional code. Use a set for “is this ID allowed?”, a dictionary for “what value belongs to this ID?”, and a list when order is part of the data.

## Transform data without hiding the steps

A comprehension is good when it expresses one readable transformation. Use a normal loop when there are several decisions, side effects, or useful intermediate names.

```python
records = [
    {"sample_id": "AKI_01", "group": "AKI", "value": 18.2},
    {"sample_id": "CTL_01", "group": "Control", "value": None},
    {"sample_id": "AKI_02", "group": "AKI", "value": 17.8},
]

aki_values = [
    row["value"]
    for row in records
    if row["group"] == "AKI" and row["value"] is not None
]
```

Generators produce one item at a time and avoid materializing a full list. They are a good fit for large text files and parser streams:

```python
def nonempty(lines):
    for line in lines:
        cleaned = line.strip()
        if cleaned:
            yield cleaned
```

Do not compress a multi-stage analysis into one expression. Intermediate variables such as `filtered`, `normalized`, and `summarized` are cheap documentation and useful inspection points.

## Functions are the unit of reuse

A useful function has one job, receives its dependencies as arguments, returns a value, and either handles a predictable problem or raises a precise exception. Type hints make the contract visible, but Python does not enforce them at runtime.

```python
from collections.abc import Iterable
from statistics import mean


def mean_observed(values: Iterable[float | None]) -> float | None:
    """Return the mean of observed values, or None when none are present."""
    observed = [value for value in values if value is not None]
    return mean(observed) if observed else None
```

Avoid mutable default arguments. The default object is created once, when Python defines the function—not once per call.

```python
def add_flag(flag: str, flags: list[str] | None = None) -> list[str]:
    current = [] if flags is None else flags.copy()
    current.append(flag)
    return current
```

Prefer returning data to printing it. A caller can test, save, plot, or print a returned value; printed output is much harder to reuse.

## Paths and files

Use `pathlib.Path` rather than joining path strings by hand. Pass paths into functions instead of depending on the current working directory.

```python
from pathlib import Path


def output_path(project: Path, sample_id: str) -> Path:
    destination = project / "results" / "qc"
    destination.mkdir(parents=True, exist_ok=True)
    return destination / f"{sample_id}.tsv"
```

Open text with an explicit encoding and use a context manager so the file closes even if parsing fails. The standard `csv` module expects `newline=""` when it receives an open file object.

```python
import csv
from pathlib import Path

REQUIRED_COLUMNS = {"sample_id", "group", "file"}


def read_sample_sheet(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        columns = set(reader.fieldnames or [])
        missing = REQUIRED_COLUMNS - columns
        if missing:
            names = ", ".join(sorted(missing))
            raise ValueError(f"Missing sample-sheet columns: {names}")
        return list(reader)
```

Loading a sample sheet is reasonable; loading every read or spectrum into a list usually is not. Stream large biological formats with their dedicated parsers, as shown in Module 3.

## Errors should explain the broken contract

Validate at boundaries: immediately after reading a file, parsing user input, or receiving an external result. Let unexpected exceptions retain their traceback.

```python
def require_unique(values: list[str], label: str) -> None:
    duplicates = sorted({value for value in values if values.count(value) > 1})
    if duplicates:
        preview = ", ".join(duplicates[:5])
        raise ValueError(f"{label} must be unique; duplicates include {preview}")
```

For a large list, count once instead of repeatedly calling `list.count()`:

```python
from collections import Counter


def duplicates(values: list[str]) -> list[str]:
    return sorted(value for value, count in Counter(values).items() if count > 1)
```

Catch only exceptions you can resolve or annotate. Preserve the original cause with `raise ... from error`:

```python
from pathlib import Path


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except OSError as error:
        raise RuntimeError(f"Could not read {path}") from error
```

`assert` documents internal invariants during development, but it is not input validation: optimized Python can remove assertions. Raise `ValueError`, `TypeError`, or a domain-specific exception for user data.

## A reusable command-line script

The standard library is enough for a durable small command. `argparse` provides help and validation, `logging` records operational events, and `main()` keeps importable logic separate from execution.

```python
from __future__ import annotations

import argparse
import json
import logging
from pathlib import Path

LOGGER = logging.getLogger(__name__)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Validate a sample sheet and write a small run summary."
    )
    parser.add_argument("samples", type=Path, help="CSV sample sheet")
    parser.add_argument("--output", type=Path, default=Path("results/run.json"))
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")

    rows = read_sample_sheet(args.samples)
    sample_ids = [row["sample_id"] for row in rows]
    repeated = duplicates(sample_ids)
    if repeated:
        raise ValueError(f"Duplicate sample IDs: {', '.join(repeated)}")

    summary = {"samples": len(rows), "groups": sorted({row["group"] for row in rows})}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
    LOGGER.info("Wrote %s", args.output)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

Use `print()` for the result a user asked to see. Use logging for progress and diagnostics. Raise an exception when the program cannot fulfill its contract.

## Daily checklist

- Can I name the input, output, and invariant of each function?
- Did I use `Path`, a context manager, and an explicit encoding?
- Am I comparing values with `==` and checking `None` with `is None`?
- Did I avoid hidden global state and mutable defaults?
- Does an error name the file, field, or assumption that failed?
- Can the useful logic be imported without running the command-line interface?

## Sources and next references

- [The Python tutorial: data structures](https://docs.python.org/3/tutorial/datastructures.html)
- [The Python tutorial: errors and exceptions](https://docs.python.org/3/tutorial/errors.html)
- [`pathlib` — object-oriented filesystem paths](https://docs.python.org/3/library/pathlib.html)
- [`csv` — CSV file reading and writing](https://docs.python.org/3/library/csv.html)
- [The `argparse` tutorial](https://docs.python.org/3/howto/argparse.html)
- [The logging HOWTO](https://docs.python.org/3/howto/logging.html)
