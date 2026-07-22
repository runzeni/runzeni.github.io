---
title: "Module 3: Bioinformatics"
short_title: Bioinformatics without hidden assumptions
series: python-notes
module_number: 3
slug: module-3
permalink: /notes/python-notes/module-3/
updated: 2026-07-21
description: Practical patterns for biological formats, omics tables, provenance, and workflows that remain auditable.
---

Bioinformatics code sits between large files, evolving identifiers, experimental design, and domain-specific statistical models. The safe pattern is to make each boundary explicit: what one row means, which coordinate convention applies, how records are matched, and which artifact proves the run can be reconstructed.

## Begin with a data contract

Before choosing a library, write a one-page contract:

| Question | What to record |
| --- | --- |
| Biological question | Comparison or association, population, tissue, time point |
| Experimental unit | Animal, subject, culture, lane, cell, peptide, or another unit |
| Dependence | Pairing, repeated measures, nesting, batches, technical replicates |
| Identifiers | Namespace, database release, species, isoform policy, uniqueness |
| Input | File format and version, reference build/database, checksums |
| Coordinates | 0- or 1-based; open, closed, or half-open intervals |
| Missingness | Structural absence, censoring, failed measurement, unknown |
| Exclusions | Rule, reason, and whether chosen before outcome inspection |
| Output | Unit, transformation, schema, and downstream consumer |

This prevents a common failure: code that runs correctly on the wrong observational unit or reference system.

Keep three layers separate:

```text
data/raw/          immutable instrument or repository files
data/interim/      parsed or normalized, reproducibly generated
results/           analysis tables, figures, models, and run records
```

Never “clean” the only copy of a raw file in place. A transformation should have a named input, a new output, and a log or manifest.

## Use a small bioinformatics environment

Bioinformatics packages often include compiled libraries and command-line tools. Conda or mamba is useful here because it can resolve non-Python dependencies as well as Python packages. Bioconda currently recommends `conda-forge` and `bioconda` with strict channel priority; the old `defaults` recommendation no longer applies.

```bash
mamba create -n bioinfo python=3.13 \
  biopython pyteomics pysam \
  numpy pandas scipy matplotlib \
  --channel conda-forge \
  --channel bioconda \
  --strict-channel-priority

conda activate bioinfo
```

Keep the environment task-specific. Add `scanpy`, a workflow engine, or a search tool only when the project uses it.

Record both intent and an exact platform snapshot:

```bash
# Direct requests; better for sharing across platforms
conda export --from-history --file=environment.yml

# Exact package artifacts for the current platform
conda export --format=explicit --file=explicit.txt
```

The portable file may resolve to newer transitive dependencies later. The explicit file is exact but platform-specific. For a publication archive, retaining both answers two different questions.

## Choose a parser that understands the format

Do not split complex biological formats with ad hoc string code when a maintained parser handles headers, compression, indexing, and specification details.

| Data | Typical formats | Python interface | Use it for |
| --- | --- | --- | --- |
| Sequences | FASTA, FASTQ, GenBank | Biopython `SeqIO` | Sequence records and annotations |
| Alignments | SAM, BAM, CRAM | `pysam.AlignmentFile` | Indexed reads and regions |
| Variants | VCF, BCF | `pysam.VariantFile` | Headers, samples, alleles, records |
| Proteomics spectra | mzML, mzXML, MGF | Pyteomics | Streaming spectra and metadata |
| Proteomics IDs | mzIdentML, pepXML, mzTab | Pyteomics | PSM, peptide, and protein results |
| Rectangular metadata | CSV, TSV, Parquet | pandas | Sample sheets and analysis tables |
| Single-cell matrices | H5AD / AnnData | AnnData and Scanpy | Matrix plus cell and feature metadata |

Validate the parser output on a few records before scaling. Print keys, types, units, and representative identifiers—not entire spectra or a million-row table.

## Stream records; materialize summaries

Many parser APIs are iterators. Consume one record at a time and retain only the summary needed downstream.

### FASTA with Biopython

```python
from pathlib import Path
from Bio import SeqIO


def summarize_fasta(path: Path) -> dict[str, float | int]:
    records = 0
    bases = 0
    gc_bases = 0

    for record in SeqIO.parse(str(path), "fasta"):
        sequence = str(record.seq).upper()
        records += 1
        bases += len(sequence)
        gc_bases += sequence.count("G") + sequence.count("C")

    return {
        "records": records,
        "bases": bases,
        "gc_fraction": gc_bases / bases if bases else float("nan"),
    }
```

Do not assume a FASTA description is a stable identifier. Decide whether the key is an accession, accession plus version, gene ID, transcript ID, protein isoform, or a locally assigned ID—and retain the original header for traceability.

### BAM or CRAM with pysam

```python
from pathlib import Path
import pysam


def primary_reads_in_region(path: Path, contig: str, start: int, end: int) -> int:
    """Count primary mapped reads in a 0-based, half-open interval [start, end)."""
    with pysam.AlignmentFile(str(path), "rb") as alignments:
        if not alignments.has_index():
            raise ValueError(f"An index is required for regional access: {path}")
        return sum(
            1
            for read in alignments.fetch(contig, start, end)
            if not read.is_unmapped
            and not read.is_secondary
            and not read.is_supplementary
        )
```

CRAM decoding may require the exact reference sequence used to create the file. Treat that reference and its checksum as an input, not as an implicit machine setting.

### mzML with Pyteomics

```python
from pathlib import Path
import numpy as np
from pyteomics import mzml


def ms1_tic(path: Path):
    """Yield spectrum ID and calculated total ion current for each MS1 scan."""
    with mzml.read(str(path), use_index=False) as spectra:
        for spectrum in spectra:
            if spectrum.get("ms level") != 1:
                continue
            intensity = spectrum["intensity array"]
            yield spectrum["id"], float(np.sum(intensity))
```

`mzml.read()` is iterative by default, which limits memory use. Build or use an index only when random spectrum access is required. Preserve controlled-vocabulary terms and units; the same field name can be misleading when its unit or acquisition context is discarded.

## Treat coordinates as typed data

Genomic coordinates are a data type with a convention, not just two integers.

- SAM, VCF, GFF, and Wiggle text formats use 1-based coordinates.
- BAM, BCFv2, and BED use 0-based coordinates; BED intervals are half-open.
- pysam’s Python API normally presents 0-based, half-open coordinates, even when the underlying text format differs.
- Region strings such as `chr1:101-200` follow samtools-style conventions and are an important exception.

Name the convention in variables and function contracts:

```python
def one_based_closed_to_zero_based_half_open(start_1: int, end_1: int) -> tuple[int, int]:
    if start_1 < 1 or end_1 < start_1:
        raise ValueError("Expected a valid 1-based closed interval")
    return start_1 - 1, end_1


assert one_based_closed_to_zero_based_half_open(3, 7) == (2, 7)
```

Test conversions at chromosome position 1 and at a one-base interval. Off-by-one errors can look biologically plausible, which makes them especially dangerous.

## Protect identifiers and observation levels

An identifier mapping is an analysis step. Record:

- source and target namespaces;
- source database and release date/version;
- species and reference assembly or proteome;
- one-to-many and many-to-one mappings;
- unmapped identifiers;
- whether versions or isoform suffixes were stripped.

Never silently choose the first mapping. Preserve a mapping table with a status column such as `one_to_one`, `one_to_many`, `unmapped`, or `deprecated`.

Also keep biological levels distinct:

```text
read → alignment → feature count → sample
spectrum → PSM → peptide → protein group → sample
cell → donor/sample → condition
```

Ten thousand cells from one donor are not ten thousand independent donors. Thousands of peptides from three animals do not change the experimental sample size from three. Summarization and inference must respect the unit defined in the study design.

## A safe omics-table pattern

For a protein-by-sample abundance result, normalize the table contract before calculating:

```python
from pathlib import Path
import pandas as pd

KEY = ["protein_id", "sample_id"]


def read_abundance(path: Path) -> pd.DataFrame:
    data = pd.read_csv(
        path,
        dtype={"protein_id": "string", "sample_id": "string"},
    )
    required = set(KEY) | {"abundance"}
    missing = required - set(data.columns)
    if missing:
        raise ValueError(f"Missing abundance columns: {sorted(missing)}")

    data["abundance"] = pd.to_numeric(data["abundance"], errors="raise")
    if data[KEY].isna().any().any():
        raise ValueError("Protein and sample IDs cannot be missing")
    if data.duplicated(KEY).any():
        raise ValueError("Expected one protein-sample value; aggregate upstream explicitly")
    return data
```

Join the sample sheet with an asserted cardinality, then make QC tables before inference:

```python
abundance = read_abundance(Path("data/interim/protein-abundance.csv"))
samples = pd.read_csv(
    "data/metadata/samples.csv",
    dtype={"sample_id": "string", "group": "category", "batch": "category"},
)

if not samples["sample_id"].is_unique:
    raise ValueError("Sample sheet requires one row per sample")

analysis = abundance.merge(
    samples,
    on="sample_id",
    how="left",
    validate="many_to_one",
    indicator=True,
)
if not analysis["_merge"].eq("both").all():
    missing_ids = analysis.loc[analysis["_merge"] != "both", "sample_id"].unique()
    raise ValueError(f"Missing metadata for: {missing_ids[:5].tolist()}")
analysis = analysis.drop(columns="_merge")

sample_qc = (
    analysis.groupby("sample_id", observed=True)["abundance"]
    .agg(observed="count", median="median")
    .join(
        analysis["abundance"]
        .isna()
        .groupby(analysis["sample_id"], observed=True)
        .mean()
        .rename("missing_fraction")
    )
)
```

Do not replace missing values with zero by default. In omics data, missingness may reflect detection limits, stochastic sampling, filtering, true absence, or a failed run; each mechanism implies a different analysis.

For proteomics specifically, document these transitions:

1. raw vendor file to open or search-engine format;
2. target/decoy search and false-discovery filtering level;
3. PSM-to-peptide and peptide-to-protein inference rules;
4. contaminant, decoy, and ambiguous-protein handling;
5. normalization and abundance scale;
6. missing-value policy;
7. batch, pairing, and repeated-measure terms in the model.

Python is excellent for parsing, QC, reshaping, and figures. It should not replace an established modality-specific statistical model with a generic t-test merely to keep the workflow in one language.

## Keep single-cell containers explicit

AnnData packages a matrix with observation and feature metadata:

- `.X`: cells by features matrix;
- `.obs`: cell-level annotations;
- `.var`: feature-level annotations;
- `.layers`: alternate matrices such as raw counts or normalized values;
- `.uns` and `.obsm`: unstructured results and multidimensional embeddings.

Before a Scanpy workflow, assert which layer contains raw counts, ensure observation and feature names are unique, and preserve donor/sample columns in `.obs`. Use sparse matrices when appropriate; converting a large sparse matrix to dense can exhaust memory without changing the analysis.

## Escalate to a workflow engine only when needed

A single script is easier to read and maintain when the analysis is short. Use a workflow engine when work has multiple dependent steps, many samples, expensive partial reruns, isolated software environments, or cluster execution.

Our production omics pattern uses pinned Nextflow and nf-core workflows. Snakemake remains a good Python-native option for a smaller custom graph. In either case:

- inputs and outputs are real files with declared formats;
- parameters live in a versioned YAML or JSON file;
- compute settings are separate from scientific parameters;
- every process writes a log and records its software version;
- a dry run or preflight validates paths, metadata, references, and disk space;
- resume is used only after the failure is understood;
- pipeline reports, configuration, and version manifests are archived with results.

A workflow engine makes execution repeatable. It does not decide the experimental unit, repair confounding, or turn an inappropriate statistical model into a valid one. Module 4 maps these boundaries onto the proteomics and RNA-seq workflows I use.

## Write a machine-readable run manifest

At minimum, hash inputs and record the software context next to each result set:

```python
from __future__ import annotations

import hashlib
import json
import platform
import sys
from pathlib import Path


def sha256(path: Path, block_size: int = 1024 * 1024) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(block_size), b""):
            digest.update(block)
    return digest.hexdigest()


def write_manifest(inputs: list[Path], destination: Path) -> None:
    manifest = {
        "python": sys.version,
        "platform": platform.platform(),
        "inputs": [
            {"path": str(path), "bytes": path.stat().st_size, "sha256": sha256(path)}
            for path in inputs
        ],
    }
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
```

For large controlled or clinical files, store the manifest in an appropriate protected location and avoid putting subject identifiers or protected paths into public logs.

## Bioinformatics handoff checklist

- Raw inputs are immutable and identified by checksum or accession plus release.
- The sample sheet has unique IDs and states group, batch, pairing, and exclusions.
- Reference genome, transcriptome, or proteome version is recorded.
- Coordinate and identifier conventions are explicit and tested.
- Large files are streamed; random access is backed by an index.
- Every join declares its expected cardinality and reports unmatched rows.
- Technical and biological observation levels are not conflated.
- Missingness, normalization, and filtering rules are recorded before inference.
- Effect sizes and uncertainty accompany multiplicity-adjusted results.
- Code, environment, command, config, logs, and machine-readable result tables are archived together.

## Sources and next references

- [Bioconda usage and channel configuration](https://bioconda.github.io/)
- [Conda environment export](https://docs.conda.io/projects/conda/en/latest/commands/export.html)
- [Biopython tutorial and API documentation](https://biopython.org/docs/latest/)
- [Pyteomics data access](https://pyteomics.readthedocs.io/en/latest/data.html)
- [Pyteomics mzML API](https://pyteomics.readthedocs.io/en/latest/api/mzml.html)
- [pysam documentation](https://pysam.readthedocs.io/en/stable/)
- [GA4GH SAM/BAM, VCF/BCF, and BED specifications](https://samtools.github.io/hts-specs/)
- [Scanpy documentation](https://scanpy.readthedocs.io/en/stable/)
- [Nextflow documentation](https://www.nextflow.io/docs/latest/)
- [Snakemake documentation](https://snakemake.readthedocs.io/en/stable/)
