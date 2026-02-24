---
title: "Module 3: Practice — Bioinformatics"
breadcrumb_title: Module 3
permalink: /misc/linux-notes/module-3/
layout: default
series: linux-notes
module_number: 3
prev_module: /misc/linux-notes/module-2/
next_module: null
date: 2026-02-23
description: "Proteomics analysis in Python — environment setup, key libraries, and sample workflows for class."
---

<header class="module-header">
  <div class="module-meta">
    <span class="module-series-badge">Linux Notes</span>
    <span class="module-number-badge">Module 3 of 3</span>
  </div>
  <h1>Practice: Bioinformatics</h1>
  <div class="module-header-meta">
    <span class="module-date">February 2026</span>
  </div>
</header>

<article class="module-content">

  <div class="module-intro">
    <p class="lead-paragraph">
      Putting the command line to work — proteomics analysis in Python.
    </p>
    <p>
      This module is my running notebook for the computational side of biology class. The focus is on proteomics (mass spectrometry data, protein identification, quantification), but the setup and patterns apply to most bioinformatics work. I'll keep adding to this as the course goes on.
    </p>
  </div>

  <nav class="module-toc" aria-label="Table of contents">
    <h2 class="module-toc-title">In This Module</h2>
    <ul>
      <li><a href="#section-3-1">3.1 Environment Setup</a></li>
      <li><a href="#section-3-2">3.2 Key Libraries</a></li>
      <li><a href="#section-3-3">3.3 Loading & Inspecting Data</a></li>
      <li><a href="#section-3-4">3.4 Filtering & Analysis</a></li>
      <li><a href="#section-3-5">3.5 Visualization</a></li>
    </ul>
  </nav>

  <section id="section-3-1" class="content-section" markdown="block">

## 3.1 Environment Setup

Rule number one: **never install packages into your system Python**. Always use a virtual environment or conda.

### Option A: conda (Recommended for Bioinformatics)

Conda handles both Python packages and system-level dependencies (like compiled C libraries that many bioinformatics tools need).

```bash
# Install miniconda (if not already installed)
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh

# Create a new environment for proteomics work
conda create -n proteomics python=3.11
conda activate proteomics

# Install core packages
conda install -c conda-forge -c bioconda \
    pandas numpy scipy matplotlib seaborn \
    pyteomics biopython

# Export environment (for reproducibility)
conda env export > environment.yml

# Recreate from file
conda env create -f environment.yml
```

### Option B: venv + pip

```bash
# Create virtual environment
python3 -m venv ~/envs/proteomics
source ~/envs/proteomics/bin/activate

# Install packages
pip install pandas numpy scipy matplotlib seaborn
pip install pyteomics biopython lxml

# Save requirements
pip freeze > requirements.txt

# Install from requirements
pip install -r requirements.txt
```

> **My note:** I use conda because half the tools in bioinformatics have weird C dependencies that pip can't handle. Save yourself the headache.

  </section>

  <section id="section-3-2" class="content-section" markdown="block">

## 3.2 Key Libraries

Quick reference for the Python libraries I keep reaching for.

### Data & Computation

- **pandas** — DataFrames, the workhorse for tabular data. Read CSVs, filter, group, merge.
- **numpy** — numerical arrays, linear algebra, fast math.
- **scipy** — statistical tests, signal processing, optimization.

### Proteomics-Specific

- **pyteomics** — read mzML, mzXML, FASTA, pepXML, mzIdentML files. The Swiss army knife.
- **biopython** — sequence handling, BLAST, PDB parsing, GenBank access.
- **pyopenms** — Python bindings for OpenMS (feature detection, alignment, ID). Heavy but powerful.

### Visualization

- **matplotlib** — the base plotting library. Not pretty by default, but fully customizable.
- **seaborn** — statistical plots built on matplotlib. Heatmaps, violin plots, pair plots.
- **plotly** — interactive plots. Good for exploring spectra.

### Quick Install Cheat Sheet

```bash
# Everything at once with conda
conda install -c conda-forge -c bioconda \
    pandas numpy scipy matplotlib seaborn \
    pyteomics biopython pyopenms plotly

# Or with pip
pip install pandas numpy scipy matplotlib seaborn \
    pyteomics biopython lxml plotly
# Note: pyopenms via pip can be tricky, conda is easier
```

  </section>

  <section id="section-3-3" class="content-section" markdown="block">

## 3.3 Loading & Inspecting Data

Mass spectrometry data comes in various formats. Here are the most common ones and how to open them.

### Reading mzML Files (Raw Spectra)

`mzML` is the standard open format for mass spec data. Each "spectrum" in the file represents one scan.

```python
from pyteomics import mzml
import matplotlib.pyplot as plt

# Read all spectra from an mzML file
spectra = list(mzml.read('sample.mzML'))

print(f"Total spectra: {len(spectra)}")
print(f"First spectrum keys: {spectra[0].keys()}")

# Quick look at one spectrum
spectrum = spectra[0]
print(f"MS level: {spectrum['ms level']}")
print(f"Scan time: {spectrum['scanList']['scan'][0]['scan start time']}")

# Plot a single spectrum
mz = spectrum['m/z array']
intensity = spectrum['intensity array']

plt.figure(figsize=(12, 4))
plt.stem(mz, intensity, markerfmt=' ', basefmt=' ')
plt.xlabel('m/z')
plt.ylabel('Intensity')
plt.title('MS1 Spectrum')
plt.tight_layout()
plt.savefig('spectrum.png', dpi=150)
plt.show()
```

### Reading FASTA Files (Protein Sequences)

```python
from pyteomics import fasta

# Read a FASTA database
proteins = list(fasta.read('uniprot_human.fasta'))

print(f"Total proteins: {len(proteins)}")
print(f"First protein: {proteins[0].description}")
print(f"Sequence length: {len(proteins[0].sequence)}")

# Filter for reviewed (Swiss-Prot) entries
reviewed = [p for p in proteins if 'reviewed' in p.description.lower()]
print(f"Reviewed entries: {len(reviewed)}")
```

### Reading Search Results (pepXML / mzIdentML)

```python
from pyteomics import pepxml

# Read peptide identification results
psms = list(pepxml.read('search_results.pep.xml'))

print(f"Total PSMs: {len(psms)}")

# Convert to DataFrame for easier analysis
import pandas as pd

records = []
for psm in psms:
    hit = psm['search_hit'][0]  # top hit
    records.append({
        'spectrum': psm['spectrum'],
        'peptide': hit['peptide'],
        'protein': hit['protein'],
        'score': hit['search_score'].get('expect', None),
        'charge': psm['assumed_charge'],
    })

df = pd.DataFrame(records)
print(df.head())
print(df.describe())
```

  </section>

  <section id="section-3-4" class="content-section" markdown="block">

## 3.4 Filtering & Analysis

Raw search results need filtering. The standard approach is FDR (False Discovery Rate) control using a target-decoy strategy.

### Basic FDR Filtering

```python
import pandas as pd
import numpy as np

# Assume df has columns: peptide, protein, score, is_decoy
# Lower score = better match (e.g., E-value)

# Sort by score (best first)
df = df.sort_values('score', ascending=True).reset_index(drop=True)

# Calculate FDR at each score threshold
decoy_count = df['is_decoy'].cumsum()
target_count = (~df['is_decoy']).cumsum()
df['fdr'] = decoy_count / target_count

# Filter at 1% FDR
fdr_threshold = df[df['fdr'] <= 0.01]['score'].max()
filtered = df[(df['score'] <= fdr_threshold) & (~df['is_decoy'])]

print(f"PSMs at 1% FDR: {len(filtered)}")
print(f"Unique peptides: {filtered['peptide'].nunique()}")
print(f"Unique proteins: {filtered['protein'].nunique()}")
```

### Protein Grouping (Parsimony)

```python
# Simple protein grouping — minimal set that explains all peptides
from collections import defaultdict

# Build peptide-to-protein mapping
pep_to_prot = defaultdict(set)
prot_to_pep = defaultdict(set)

for _, row in filtered.iterrows():
    pep_to_prot[row['peptide']].add(row['protein'])
    prot_to_pep[row['protein']].add(row['peptide'])

# Greedy set cover (simple parsimony)
explained = set()
protein_groups = []

while explained != set(pep_to_prot.keys()):
    # Pick protein that explains the most unexplained peptides
    best = max(prot_to_pep.keys(),
               key=lambda p: len(prot_to_pep[p] - explained))
    new_peptides = prot_to_pep[best] - explained
    if not new_peptides:
        break
    protein_groups.append({
        'protein': best,
        'unique_peptides': len(new_peptides),
        'total_peptides': len(prot_to_pep[best])
    })
    explained |= new_peptides

groups_df = pd.DataFrame(protein_groups)
print(f"Protein groups: {len(groups_df)}")
print(groups_df.head(10))
```

> **My note:** This is a simplified version. Real tools like ProteinProphet or Percolator do much more sophisticated grouping and rescoring. But this helps understand what's happening under the hood.

  </section>

  <section id="section-3-5" class="content-section" markdown="block">

## 3.5 Visualization

Plots I keep making for class assignments and lab reports.

### Spectrum Plot (Annotated)

```python
import matplotlib.pyplot as plt
import numpy as np

def plot_spectrum(mz, intensity, annotations=None, title='MS2 Spectrum'):
    """Plot a mass spectrum with optional peak annotations."""
    fig, ax = plt.subplots(figsize=(12, 5))

    # Normalize intensity to percentage
    intensity_pct = intensity / intensity.max() * 100

    ax.stem(mz, intensity_pct, markerfmt=' ', basefmt=' ',
            linefmt='C0-', label='peaks')

    if annotations:
        for mz_val, label in annotations.items():
            idx = np.argmin(np.abs(mz - mz_val))
            ax.annotate(label, (mz[idx], intensity_pct[idx]),
                       textcoords="offset points", xytext=(0, 10),
                       ha='center', fontsize=8, color='red')

    ax.set_xlabel('m/z', fontsize=12)
    ax.set_ylabel('Relative Intensity (%)', fontsize=12)
    ax.set_title(title, fontsize=14)
    ax.set_ylim(0, 110)
    plt.tight_layout()
    return fig
```

### Volcano Plot (Differential Expression)

```python
import seaborn as sns

def volcano_plot(df, fc_col='log2_fc', pval_col='neg_log10_pval',
                 fc_thresh=1.0, pval_thresh=1.3):
    """
    Volcano plot for differential protein expression.
    fc_thresh: log2 fold change cutoff (default 1.0 = 2-fold)
    pval_thresh: -log10(p-value) cutoff (default 1.3 ≈ p=0.05)
    """
    fig, ax = plt.subplots(figsize=(8, 6))

    # Classify points
    df = df.copy()
    df['significance'] = 'Not significant'
    df.loc[(df[fc_col].abs() >= fc_thresh) &
           (df[pval_col] >= pval_thresh), 'significance'] = 'Significant'

    colors = {'Not significant': '#bbbbbb', 'Significant': '#e74c3c'}

    sns.scatterplot(data=df, x=fc_col, y=pval_col,
                    hue='significance', palette=colors,
                    alpha=0.6, s=20, ax=ax, legend=True)

    ax.axhline(y=pval_thresh, color='grey', linestyle='--', linewidth=0.8)
    ax.axvline(x=fc_thresh, color='grey', linestyle='--', linewidth=0.8)
    ax.axvline(x=-fc_thresh, color='grey', linestyle='--', linewidth=0.8)

    ax.set_xlabel('log₂(Fold Change)')
    ax.set_ylabel('-log₁₀(p-value)')
    ax.set_title('Differential Protein Expression')
    plt.tight_layout()
    return fig
```

### Heatmap (Protein Abundance)

```python
def abundance_heatmap(df, sample_cols, protein_col='protein',
                      n_top=30, method='zscore'):
    """
    Heatmap of top N proteins across samples.
    method: 'zscore' for row-normalized, 'raw' for absolute values.
    """
    top = df.nlargest(n_top, sample_cols[0])

    matrix = top.set_index(protein_col)[sample_cols]

    if method == 'zscore':
        matrix = matrix.apply(lambda row: (row - row.mean()) / row.std(),
                              axis=1)

    fig, ax = plt.subplots(figsize=(10, 8))
    sns.heatmap(matrix, cmap='RdBu_r', center=0,
                xticklabels=True, yticklabels=True,
                linewidths=0.5, ax=ax)
    ax.set_title(f'Top {n_top} Proteins — Z-score Normalized')
    plt.tight_layout()
    return fig
```

> **My note:** These are templates — I copy-paste and adapt for each assignment. The volcano plot in particular comes up in almost every proteomics paper.

This module will keep growing as I work through more class material. The goal is to have a personal reference I can quickly search through instead of digging through lecture slides.

  </section>

</article>

<nav class="module-navigation" aria-label="Module navigation">
  <div class="module-nav-container">

    <a href="/misc/linux-notes/" class="module-nav-overview">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
      <span>Back to Overview</span>
    </a>

    <div class="module-nav-arrows">
      <a href="/misc/linux-notes/module-2/" class="module-nav-prev">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <span>Previous Module</span>
      </a>

      <span class="module-nav-disabled"></span>
    </div>
  </div>
</nav>
