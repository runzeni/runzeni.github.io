---
title: "Module 3: Practice: Bioinformatics"
short_title: "Practice: Bioinformatics"
series: linux-notes
module_number: 3
slug: module-3
permalink: /notes/linux-notes/module-3/
date: 2026-02-23
updated: 2026-10-13
description: "Proteomics analysis in Python: environment setup, key libraries, and sample workflows for class."
---

A small proteomics workflow: isolate the environment, inspect spectra and sequences, and keep identification confidence separate from abundance analysis.

## 3.1 Environment Setup
{: #section-3-1}

Install Conda using the installer for your operating system and processor. Then create a project environment; the channel flags below leave global configuration unchanged.

```bash
conda create -n proteomics python=3.13 \
  numpy pandas matplotlib pyteomics biopython lxml \
  --override-channels --channel conda-forge --channel bioconda \
  --strict-channel-priority
conda activate proteomics

# Portable record of requested packages
conda env export --from-history > environment.yml
# Exact package URLs for this platform
conda list --explicit > explicit.txt
```

The portable file can resolve to newer dependencies. Keep the platform-specific snapshot with a reported analysis. A `venv` with `python -m pip` is also suitable when the required packages and system libraries are available.

## 3.2 Key Libraries
{: #section-3-2}

| Task | Library |
| --- | --- |
| Arrays and tables | NumPy, pandas |
| Spectra and identification formats | Pyteomics |
| Sequence records | Biopython |
| Static figures | Matplotlib |

Add a package when a task needs it. Parsing a spectrum does not require a complete search or quantification pipeline.

## 3.3 Loading & Inspecting Data
{: #section-3-3}

### Inspect an MS1 spectrum

Stream the file rather than loading every spectrum. This example explicitly selects an MS1 scan and handles files containing none.

```python
from pyteomics import mzml

with mzml.read('sample.mzML', use_index=False) as spectra:
    spectrum = next((s for s in spectra if s.get('ms level') == 1), None)

if spectrum is None:
    raise ValueError('No MS1 spectrum found')

print(spectrum['id'])
print(len(spectrum['m/z array']), 'peaks')
```

mzML can contain MS1 and tandem spectra, as well as chromatograms. Preserve acquisition metadata and units when exporting summaries.

### Count reviewed UniProt entries

For **UniProtKB FASTA headers**, `sp|` identifies Swiss-Prot entries; `tr|` identifies TrEMBL entries. Searching for the word “reviewed” in a description is not a valid filter. Other FASTA databases may use different conventions.

```python
from Bio import SeqIO

with open('uniprot_human.fasta', encoding='utf-8') as handle:
    reviewed = sum(record.id.startswith('sp|') for record in SeqIO.parse(handle, 'fasta'))
print(reviewed, 'Swiss-Prot entries')
```

### Inspect identification results

```python
from pyteomics import pepxml

with pepxml.read('search_results.pep.xml', use_index=False) as results:
    first = next(results, None)
    if first is not None:
        for hit in first.get('search_hit', []):
            print(hit.get('peptide'), hit.get('search_score'))
            print(hit.get('proteins'))
```

Scores and their direction depend on the search engine. A hit can map to multiple proteins; retain that mapping rather than treating the first accession as an unambiguous identification.

## 3.4 Filtering & Analysis
{: #section-3-4}

Use the search workflow's documented confidence procedure and retain its settings and output columns. A target–decoy estimate depends on search competition, database construction, score direction, and the level being filtered. A threshold-specific FDR estimate and a monotone q-value are related but distinct.

A 1% PSM-level threshold does **not** establish 1% peptide- or protein-level FDR. Counting distinct protein accessions after PSM filtering does not perform protein inference. Shared peptides require explicit protein-group rules; greedy set cover is an approximation, not a guarantee of the smallest or biologically correct protein set.

For abundance comparisons, define biological replicates, contrasts, missingness, normalization, and multiple-testing correction separately. See [the bioinformatics notes]({{ '/notes/python-notes/module-3/' | relative_url }}) and [the working omics stack]({{ '/notes/python-notes/module-4/' | relative_url }}) for those decisions.

## 3.5 Visualization
{: #section-3-5}

A spectrum plot should state its MS level and intensity scale. Continue from the MS1 example above:

```python
import numpy as np
import matplotlib.pyplot as plt

mz = np.asarray(spectrum['m/z array'], dtype=float)
intensity = np.asarray(spectrum['intensity array'], dtype=float)
if mz.ndim != 1 or mz.shape != intensity.shape or not mz.size:
    raise ValueError('Expected paired, nonempty peak arrays')
if not (np.isfinite(mz).all() and np.isfinite(intensity).all()):
    raise ValueError('Peak arrays must be finite')
if (intensity < 0).any() or intensity.max() <= 0:
    raise ValueError('Relative intensity requires nonnegative peaks and a positive maximum')

fig, ax = plt.subplots(figsize=(8, 3), layout='constrained')
ax.vlines(mz, 0, 100 * intensity / intensity.max(), linewidth=.7)
ax.set(xlabel='m/z', ylabel='Relative intensity (%)', title='MS1 spectrum')
fig.savefig('spectrum.svg')
plt.close(fig)
```

For differential-abundance figures, label the effect scale and whether p-values are adjusted. For heatmaps, state the feature-selection rule and transformation; omit constant rows before row standardization. Plotting should consume an analysis result, not silently choose its statistical method.

## References

- [Bioconda environments and channels](https://bioconda.github.io/)
- [Pyteomics data access](https://pyteomics.readthedocs.io/en/latest/data.html)
- [UniProt FASTA header conventions](https://www.uniprot.org/help/fasta-headers)
- [Pyteomics target–decoy statistics](https://pyteomics.readthedocs.io/en/latest/api/pepxml.html#target-decoy-approach)
