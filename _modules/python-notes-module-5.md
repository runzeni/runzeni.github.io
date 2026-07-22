---
title: "Module 5: Useful Python commands"
short_title: Useful Python commands, from first check to deep diagnosis
series: python-notes
module_number: 5
slug: module-5
permalink: /notes/python-notes/module-5/
updated: 2026-07-21
description: A practical command ladder for running, inspecting, testing, debugging, profiling, and automating Python without losing track of the environment.
---

The most useful Python command is often the one that answers a narrow question: *Which interpreter is this? What was imported? Are the dependencies coherent? Where is the time going?* I use the following commands as a ladder. Start with the cheapest check and move downward only when the evidence requires it.

Examples use `python`; on systems where Python 3 is exposed as `python3`, substitute that executable consistently. On Windows, the Python launcher commonly uses `py`.

## Prove which Python is running

Before installing or debugging anything, establish the interpreter and environment:

```bash
python --version
python -VV
python -c "import sys; print(sys.executable)"
python -c "import sys; print(sys.prefix); print(sys.base_prefix)"
python -m site
```

- `--version` is the quick check; `-VV` also reports build details.
- `sys.executable` is the interpreter that will execute `-m pip`, tests, and modules.
- In a virtual environment, `sys.prefix != sys.base_prefix` is normally true.
- `python -m site` prints the active import paths and user-site state.

For a concise, copyable run record:

```bash
python -c "import platform, sys; print(sys.executable); print(platform.platform()); print(sys.version)"
```

Do not infer the active interpreter from the shell prompt alone. An environment name can be stale; `sys.executable` is direct evidence.

## Choose the execution mode deliberately

Python has several entry modes, each useful for a different job:

| Need | Command | Why |
| --- | --- | --- |
| Run a file | `python script.py --input data.csv` | Simple scripts and explicit arguments |
| Run an installed module | `python -m package.module` | Uses the selected interpreter's import system |
| Run a short probe | `python -c "import pandas; print(pandas.__version__)"` | Fast, non-interactive evidence |
| Inspect state after a script | `python -i script.py` | Drops into the REPL after execution |
| Enable extra runtime checks | `python -X dev script.py` | Surfaces warnings and costly development checks |
| Trace slow imports | `python -X importtime -c "import pandas"` | Separates import cost from analysis cost |
| Run isolated from user settings | `python -I script.py` | Excludes the current directory, user site, and `PYTHON*` variables |

Prefer `python -m tool` over a bare `tool` command when interpreter identity matters:

```bash
python -m pip --version
python -m pytest -q
python -m myproject.validate --manifest samples.csv
```

The `-m` form locates the module with that Python's standard import mechanism. This prevents a common failure in which `pip`, `pytest`, and `python` resolve to different environments.

## Create and audit an environment

For a small pure-Python project, the standard library is sufficient:

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e .
```

An editable install is useful during development because imports resolve to the working tree. CI and release checks should also test a regular install, because editable and built installs can behave differently.

Use these commands to answer different environment questions:

```bash
python -m pip list
python -m pip list --outdated
python -m pip show pandas
python -m pip check
python -m pip inspect > environment.json
python -m pip freeze > requirements.snapshot.txt
```

| Command | Answers | Does not prove |
| --- | --- | --- |
| `pip show NAME` | Version, location, metadata, declared requirements | That the whole environment is coherent |
| `pip check` | Whether installed packages have compatible declared dependencies | Scientific validity or undeclared system libraries |
| `pip inspect` | Machine-readable installed-package and environment metadata | That another machine will resolve the same artifacts |
| `pip freeze` | What is installed now, in requirements syntax | A solver result or true lockfile |

Treat `pip freeze` as a snapshot for diagnosis, not as the sole project specification. Keep direct dependencies in `pyproject.toml`; for long-lived or regulated work, also use an appropriate lock or hashed requirements workflow and retain the Python, OS, container, and pipeline metadata.

When finished:

```bash
deactivate
```

## Ask the runtime what it sees

The REPL's built-ins are often faster than searching documentation:

```python
help(object_name)             # rendered documentation and signature
type(object_name)             # concrete runtime type
isinstance(value, Expected)   # semantic type check
dir(object_name)              # discover names; not a promise of public API
vars(object_name)             # __dict__ when one exists
getattr(object_name, "name", None)
```

Use `inspect` when a callable or module is unfamiliar:

```python
from inspect import getsource, signature

print(signature(function))
print(getsource(function))
```

Some built-ins, compiled extensions, and dynamically generated objects do not expose a retrievable signature or source. Catch that limitation instead of treating it as absence of behavior.

From the shell:

```bash
python -m pydoc pathlib.Path
python -c "import pandas; print(pandas.__file__)"
python -c "from importlib.metadata import version; print(version('pandas'))"
```

`package.__file__` answers *what code was imported*; distribution metadata answers *what package version was installed*. They are related but not identical, especially for namespace packages and editable installs.

## Reuse the standard library as command-line tools

Several standard-library modules are useful shell utilities, with no extra installation:

```bash
# Validate and pretty-print JSON
python -m json.tool input.json

# Inspect archives without extracting them
python -m zipfile -l results.zip
python -m tarfile -l results.tar.gz

# Precompile a tree and report syntax failures
python -m compileall -q src tests

# Serve one directory locally; do not expose it as a production server
python -m http.server 8000 --bind 127.0.0.1 --directory reports
```

Use `python -m MODULE -h` before assuming flags. Python's list of modules with command-line interfaces grows over time, and module CLIs can differ between Python releases.

For a one-off data probe, keep the output narrow and deterministic:

```bash
python -c "import csv; rows=list(csv.DictReader(open('samples.csv', newline=''))); print(len(rows)); print(sorted(rows[0]))"
```

Once a probe becomes important or multiline, move it into a version-controlled script with named inputs, validation, and tests.

## Test, debug, and profile in that order

Do not profile code that is not yet known to be correct. Escalate in this sequence:

```bash
# 1. Run focused tests
python -m pytest -q tests/test_manifest.py
python -m pytest -q -k sample_sheet
python -m unittest discover -s tests -v
python -m doctest -v src/example.py

# 2. Turn warnings into visible evidence
python -X dev -W default script.py

# 3. Step through control flow
python -m pdb script.py --input samples.csv

# 4. Benchmark a small expression
python -m timeit -s "x=list(range(10000))" "sum(x)"

# 5. Profile a real run
python -m cProfile -o profile.pstats script.py --input samples.csv
python -m pstats profile.pstats

# 6. Investigate memory allocation or low-level crashes
python -X tracemalloc=25 script.py
python -X faulthandler script.py
```

Inside `pdb`, the small working set is usually enough:

| Command | Action |
| --- | --- |
| `l` | Show source around the current line |
| `n` | Execute the next line in the current frame |
| `s` | Step into a call |
| `p expression` | Evaluate and print an expression |
| `pp expression` | Pretty-print an expression |
| `u` / `d` | Move up or down the stack |
| `c` | Continue to the next breakpoint |
| `q` | Quit |

Place `breakpoint()` in code when the suspicious location is already known. Remove it before unattended execution.

Use `timeit` for small, repeatable alternatives and `cProfile` for the shape of a real program. A profiler adds overhead; its result identifies candidates for measurement, not a standalone benchmark. For a hanging multithreaded process, `faulthandler.dump_traceback_later()` can emit every thread's stack after a timeout.

## Launch external tools without hiding failure

Bioinformatics Python often coordinates tools rather than replacing them. Pass an argument list, fail on non-zero exit, and make logging an explicit choice:

```python
from subprocess import run

result = run(
    ["git", "rev-parse", "HEAD"],
    check=True,
    text=True,
    capture_output=True,
)
commit = result.stdout.strip()
```

For a long Nextflow run, inherit the terminal streams or write them to a file rather than retaining all output in memory:

```python
from pathlib import Path
from subprocess import STDOUT, run

Path("logs").mkdir(exist_ok=True)
with Path("logs/nextflow.log").open("w", encoding="utf-8") as log:
    run(
        [
            "nextflow", "run", "nf-core/rnaseq",
            "-profile", "docker",
            "--input", "samplesheet.csv",
            "--outdir", "results",
        ],
        check=True,
        stdout=log,
        stderr=STDOUT,
    )
```

Avoid `shell=True` unless shell syntax is the actual requirement and every interpolated value is trusted and quoted correctly. An argument list preserves boundaries, avoids accidental globbing, and records the command more faithfully. Add `cwd=`, `env=`, and `timeout=` only when the workflow contract requires them.

## Keep a small command ladder

When a run fails, this order usually minimizes guesswork:

1. `python -VV` and `python -c "import sys; print(sys.executable)"`
2. `python -m pip check`
3. Import the failing package and print `__file__` plus its distribution version.
4. Reproduce with the smallest focused test.
5. Re-run under `-X dev`, then `pdb` if control flow is unclear.
6. Use `-X importtime`, `timeit`, `cProfile`, or `tracemalloc` only for the resource that is actually abnormal.
7. Save the exact command, exit status, environment record, and relevant log with the analysis.

The principle is simple: **interrogate before modifying**. A precise command should reduce uncertainty; if it does not, it is probably too broad.

## Primary references

- [Python 3.14: command line and environment](https://docs.python.org/3.14/using/cmdline.html)
- [Python modules with command-line interfaces](https://docs.python.org/3.14/library/cmdline.html)
- [Python `venv`](https://docs.python.org/3.14/library/venv.html)
- [Python `inspect`](https://docs.python.org/3.14/library/inspect.html)
- [Python debugging and profiling](https://docs.python.org/3.14/library/debug.html)
- [Python `subprocess`](https://docs.python.org/3.14/library/subprocess.html)
- [pip: local and editable installs](https://pip.pypa.io/en/stable/topics/local-project-installs/)
- [pip: `check`](https://pip.pypa.io/en/stable/cli/pip_check/), [`inspect`](https://pip.pypa.io/en/stable/cli/pip_inspect/), and [`freeze`](https://pip.pypa.io/en/stable/cli/pip_freeze/)
- [pytest: usage and invocation](https://docs.pytest.org/en/stable/how-to/usage.html)
