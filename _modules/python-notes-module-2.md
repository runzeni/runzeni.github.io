---
title: "Module 2: Reliable scientific data work"
short_title: Reliable scientific data work
series: python-notes
module_number: 2
slug: module-2
permalink: /notes/python-notes/module-2/
updated: 2026-07-21
description: Environments, project structure, arrays, tables, statistics, figures, and tests without hidden state.
---

Scientific Python is not only a collection of libraries. It is a chain of contracts: a recreatable environment, an explicit data schema, a defensible analysis, and outputs that can be traced back to code and inputs.

## Isolate one environment per project

For a pure-Python project, start with the standard library’s `venv`. Treat the environment as disposable; commit its specification, not the `.venv/` directory.

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -e '.[dev]'
```

`python -m pip` ties package installation to the interpreter you just selected. Before debugging an import, verify both:

```bash
which python
python -c 'import sys; print(sys.executable)'
```

Keep project metadata and direct dependencies in `pyproject.toml`:

```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "study-analysis"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
  "matplotlib>=3.8",
  "numpy>=2",
  "pandas>=2.2",
  "scipy>=1.13",
]

[project.optional-dependencies]
dev = ["pytest>=8"]

[tool.pytest.ini_options]
testpaths = ["tests"]
```

Lower bounds express the APIs the project requires; a separately generated lock or environment export captures an exact run. Do not repeatedly add packages to one global “science” environment. Compiled command-line bioinformatics tools are a good reason to use a small conda environment instead; Module 3 covers that path.

## Separate exploration from the analysis

Notebooks are excellent for inspecting a new dataset. They are poor sources of truth when results depend on cell order or invisible state.

Use a notebook to:

- inspect shapes, distributions, and surprising records;
- test one plotting or transformation idea;
- annotate why a decision was made.

Move stable work into functions and scripts when it:

- is run on more than one input;
- creates a reported number or figure;
- takes long enough that rerunning matters;
- needs a test or code review.

A useful test of a notebook is **restart the kernel and run all cells from top to bottom**. If that fails, the document is not a reproducible analysis.

A small project can stay legible with this structure:

```text
study-analysis/
├── pyproject.toml
├── README.md
├── environment.yml          # when conda is required
├── src/study_analysis/
│   ├── __init__.py
│   ├── io.py
│   ├── qc.py
│   └── figures.py
├── tests/
├── notebooks/               # exploration, not the only copy of logic
├── data/
│   ├── raw/                 # immutable; often not committed
│   └── metadata/
└── results/                 # generated from code
```

## NumPy: inspect shape, dtype, and axis

A NumPy array is homogeneous and N-dimensional. Before calculating, inspect the three facts that control most behavior:

```python
import numpy as np

values = np.asarray([[1.2, 1.4, np.nan], [0.9, 1.1, 1.0]], dtype=float)

print(values.shape)  # (2, 3)
print(values.dtype)  # float64
print(values.ndim)   # 2
```

Name what each axis represents. If rows are proteins and columns are samples, `axis=1` summarizes across samples for each protein; `axis=0` summarizes across proteins for each sample.

```python
protein_means = np.nanmean(values, axis=1)
sample_means = np.nanmean(values, axis=0)
```

Broadcasting is powerful only when the shapes mean what you think they mean. Make the intended orientation visible:

```python
sample_offsets = np.array([0.1, 0.0, -0.1])
adjusted = values - sample_offsets[None, :]
assert adjusted.shape == values.shape
```

NumPy slices are often **views**, so mutating a slice can mutate the original array. Call `.copy()` when independent data are required.

```python
subset = values[:, :2].copy()
subset[0, 0] = 99
assert values[0, 0] == 1.2
```

Use the modern generator API and pass the generator or seed into stochastic code:

```python
rng = np.random.default_rng(20260721)
resampled = rng.choice(values[0, ~np.isnan(values[0])], size=3, replace=True)
```

A seed makes one computation repeatable; it does not make a biased design valid.

## pandas: establish the schema before analysis

Read identifiers as strings, select columns explicitly, and validate immediately. Automatic type inference can turn identifiers into numbers or mix numeric values with text sentinels.

```python
from pathlib import Path
import pandas as pd

path = Path("data/processed/abundance.csv")
table = pd.read_csv(
    path,
    dtype={"sample_id": "string", "protein_id": "string", "group": "category"},
)

required = {"sample_id", "protein_id", "group", "abundance"}
missing = required - set(table.columns)
if missing:
    raise ValueError(f"Missing columns in {path}: {sorted(missing)}")

table["abundance"] = pd.to_numeric(table["abundance"], errors="raise")
if table[["sample_id", "protein_id"]].isna().any().any():
    raise ValueError("Sample and protein identifiers cannot be missing")
```

Treat joins as assertions, not just convenience. State the expected cardinality and inspect unmatched records:

```python
metadata = pd.read_csv(
    "data/metadata/samples.csv",
    dtype={"sample_id": "string", "group": "category"},
)

if not metadata["sample_id"].is_unique:
    raise ValueError("Metadata must contain one row per sample_id")

joined = table.drop(columns="group").merge(
    metadata,
    on="sample_id",
    how="left",
    validate="many_to_one",
    indicator=True,
)

unmatched = joined.loc[joined["_merge"] != "both", "sample_id"].unique()
if len(unmatched):
    raise ValueError(f"Samples absent from metadata: {unmatched[:5].tolist()}")
joined = joined.drop(columns="_merge")
```

This prevents an accidental many-to-many join from silently multiplying observations. Also inspect null join keys before merging: pandas matches null keys to each other, unlike typical SQL behavior.

Make missingness a named result rather than silently filling it:

```python
missing_by_sample = (
    joined["abundance"]
    .isna()
    .groupby(joined["sample_id"], observed=True)
    .mean()
    .rename("missing_fraction")
)
```

Do not use chained assignment. Select rows and columns together with `.loc`:

```python
joined.loc[joined["abundance"] <= 0, "abundance"] = pd.NA
```

For summaries, prefer named built-in aggregations over a custom `groupby.apply()` when possible:

```python
summary = (
    joined.groupby(["protein_id", "group"], observed=True)["abundance"]
    .agg(n="count", mean="mean", median="median", sd="std")
    .reset_index()
)
```

Long form—one observation per row—is usually easiest for joining, grouping, and plotting. Convert to a matrix only when an algorithm genuinely requires one, and assert that the row/column key is unique before calling `pivot()`.

## Statistics: encode the design before calling a test

The function call is the last step. First write down:

1. the experimental unit and whether observations are independent, paired, nested, or repeated;
2. the estimand—what difference or association is being quantified;
3. the model or test and its assumptions;
4. exclusions and transformations decided before viewing the result;
5. how multiplicity will be handled.

For a simple independent two-group comparison, Welch’s t-test avoids assuming equal variance:

```python
from scipy import stats

result = stats.ttest_ind(group_a, group_b, equal_var=False, nan_policy="omit")
effect = float(np.nanmean(group_a) - np.nanmean(group_b))
print({"difference_in_means": effect, "p_value": float(result.pvalue)})
```

That example is not a universal omics model. Pairing, batches, repeated measures, censoring, peptide-to-protein structure, and small samples can require a different analysis. Report the effect and its uncertainty; do not reduce the result to a thresholded p-value.

For many tested features, adjust the family of p-values together:

```python
p_values = results["p_value"].to_numpy(dtype=float)
results["q_value_bh"] = stats.false_discovery_control(p_values, method="bh")
```

For small samples or a statistic with a poor asymptotic approximation, a permutation test may be more appropriate if its exchangeability assumption matches the design. Choose `permutation_type` to reflect independent samples, paired sample labels, or pairings—not whichever option gives a smaller p-value.

## Figures: use the object-oriented interface

Make the `Figure` and `Axes` explicit. Return them from plotting functions so labels and annotations remain editable, then save both a vector master and a raster preview.

```python
from pathlib import Path
import matplotlib.pyplot as plt


def plot_group_summary(summary: pd.DataFrame):
    fig, ax = plt.subplots(figsize=(4.0, 2.8), layout="constrained")
    ax.errorbar(
        summary["group"],
        summary["mean"],
        yerr=summary["sd"],
        fmt="o",
        color="black",
        capsize=3,
    )
    ax.set(xlabel="", ylabel="Abundance (a.u.)")
    ax.spines[["top", "right"]].set_visible(False)
    return fig, ax


fig, ax = plot_group_summary(group_summary)
output = Path("results/figures/group-summary")
output.parent.mkdir(parents=True, exist_ok=True)
fig.savefig(output.with_suffix(".svg"))
fig.savefig(output.with_suffix(".png"), dpi=300)
plt.close(fig)
```

The figure function should receive analysis-ready data. Do not hide filtering, statistical tests, or irreversible transformations inside plotting code.

## Test contracts, not screenshots

A few small tests protect the assumptions most likely to corrupt results: identifier uniqueness, join cardinality, coordinate conversion, missing-value behavior, and known calculations.

```python
import pytest


def fold_change(treated: float, control: float) -> float:
    if treated <= 0 or control <= 0:
        raise ValueError("Fold change requires positive values")
    return treated / control


def test_fold_change():
    assert fold_change(4.0, 2.0) == pytest.approx(2.0)


def test_fold_change_rejects_zero():
    with pytest.raises(ValueError, match="positive"):
        fold_change(1.0, 0.0)
```

Run tests from a clean environment:

```bash
python -m pytest
```

For an analysis script, also keep one tiny fixture dataset with a known row count and expected output schema. A fast end-to-end test catches wiring errors that isolated unit tests miss.

## Run record

Each reported analysis should leave behind:

- the command and parameters;
- a code version or Git commit;
- Python and direct dependency versions;
- input filenames plus checksums or immutable accession/version identifiers;
- sample exclusions and their reasons;
- a random seed when randomness is used;
- machine-readable tables behind figures;
- logs, warnings, and completion status.

Reproducibility is not “I saved the notebook.” It is the ability to start from declared inputs and regenerate the result without relying on memory.

## Sources and next references

- [`venv` — creation of virtual environments](https://docs.python.org/3/library/venv.html)
- [The `pyproject.toml` specification](https://packaging.python.org/en/latest/specifications/pyproject-toml/)
- [NumPy: the absolute basics](https://numpy.org/doc/stable/user/absolute_beginners.html)
- [pandas: indexing and selecting data](https://pandas.pydata.org/docs/user_guide/indexing.html)
- [pandas: Copy-on-Write](https://pandas.pydata.org/docs/user_guide/copy_on_write.html)
- [pandas: merge validation](https://pandas.pydata.org/docs/reference/api/pandas.merge.html)
- [pandas: working with missing data](https://pandas.pydata.org/docs/user_guide/missing_data.html)
- [pandas: group by](https://pandas.pydata.org/docs/user_guide/groupby.html)
- [SciPy: hypothesis tests](https://docs.scipy.org/doc/scipy/tutorial/stats/hypothesis_tests.html)
- [SciPy: false-discovery-rate control](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.false_discovery_control.html)
- [Matplotlib: figures and backends](https://matplotlib.org/stable/users/explain/figure/index.html)
- [pytest: good integration practices](https://docs.pytest.org/en/stable/explanation/goodpractices.html)
