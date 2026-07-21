---
title: "Module 4: Working omics stack"
short_title: The omics stack I actually use
series_title: Python notes
series: python-notes
module_number: 4
slug: module-4
permalink: /notes/python-notes/module-4/
markdown_module: true
updated: 2026-07-21
reading_time: 15 min read
description: The current proteomics and bulk RNA-seq toolchains, plus a sample-aware blueprint for future scRNA-seq work.
---

This is a map of responsibilities, not a package collection. It records the working patterns behind the RN11 DIA-proteomics and RN13 bulk-RNA-seq projects, then extends the same principles to single-cell RNA-seq. Version numbers below describe those documented runs; new work should pin and record its own versions.

## Give each layer one job

| Layer | Tools | Responsibility |
| --- | --- | --- |
| Orchestration | Nextflow and nf-core/BigBio workflows | Execute a declared graph, isolate tools, resume expensive work, and publish run metadata |
| Containers | Docker | Fix command-line software and system-library context for upstream processing |
| Python | standard library, pandas, project scripts | Build and validate sample sheets, check paths and schemas, summarize QC, reshape tables, and write manifests |
| Statistical analysis | R and Bioconductor | Fit modality-specific models, define contrasts, estimate uncertainty, and control multiplicity |
| Interpretation | MSstats, limma, DESeq2, fgsea, clusterProfiler, msigdbr | Turn quantified features into bounded protein-, gene-, and pathway-level evidence |

The boundary matters. Nextflow can prove which command ran; it cannot prove that the contrast is identifiable. Python can validate a table; it should not replace a tested proteomics model with a generic t-test merely to keep the analysis in one language.

## RN11: DIA proteomics

The current chain is:

```text
Thermo RAW + SDRF + FASTA
    → quantmsdiann / Nextflow / Docker
    → DIA-NN identification and quantification
    → quantms-utils MSstats-format table
    → MSstats primary protein inference
    → complete-case limma concordance
    → GO, KEGG, Hallmark, and Reactome interpretation
```

The recorded upstream snapshot used `bigbio/quantmsdiann v2.1.0`, Nextflow `26.04.1`, DIA-NN `2.5.0`, `quantms-utils 0.0.30`, and `sdrf-pipelines 0.1.4`. Docker supplied the DIA-NN runtime. Python scripts generated the manifest and SDRF, validated samples and references, and failed early on metadata, storage, or output problems.

One easy mistake is to confuse conversion with inference. In this workflow, the `DIANN_MSSTATS` process creates an MSstats-shaped input table; it does not run `MSstats::dataProcess()` or `MSstats::groupComparison()`. The dedicated downstream pass used MSstats `4.14.2` with MSstatsConvert `1.16.1`, top-three feature selection, TMP summarization, and `equalizeMedians` normalization.

The durable interpretation rules are more important than the package list:

1. Define the sample and contrast before looking at significance.
2. Treat finite, non-contaminant MSstats results after contrast-specific detection filtering as the primary abundance layer.
3. Require same-direction complete-case limma support for the strongest publication-facing calls when that is part of the prespecified workflow.
4. Keep infinite fold changes and `oneConditionMissing` rows as detection-pattern evidence, not ordinary abundance changes.
5. Report a confounded acquisition order as a design limitation; do not add an unidentifiable covariate to make the model look more elaborate.
6. Use ranked, threshold-free statistics for GSEA and use the tested identifier universe for over-representation analysis.

For pathway work, the current scripts use `fgsea` with MSigDB sets from `msigdbr`, and `clusterProfiler` with organism annotation plus live KEGG queries. The mapping table, database species, release, tested universe, and excluded identifiers remain part of the result—not disposable setup.

## RN13: bulk RNA-seq

The mouse and pig branches use the same conceptual chain while keeping species separate:

```text
FASTQ + sample sheet + Ensembl reference
    → nf-core/rnaseq / Nextflow / Docker
    → STAR alignment + Salmon transcript quantification + MultiQC
    → tximport transcript-to-gene handoff
    → DESeq2 design, contrasts, and shrinkage
    → fgsea / msigdbr + clusterProfiler
    → release-matched ortholog and pathway comparison
```

The recorded RN13 runs pinned `nf-core/rnaseq v3.25.0`. The pig run used Nextflow `25.10.4`; the later mouse run used `26.04.0`. Both used STAR plus Salmon and Ensembl release 115 references. The documented mouse downstream environment included DESeq2 `1.46.0`, tximport `1.34.0`, and apeglm `1.28.0`.

The analysis contract is:

- keep integer abundance estimates and the complete sample design for DESeq2 inference;
- use variance-stabilized values for PCA, distances, and heatmaps, not as the input to the count model;
- inspect MultiQC and per-sample metrics before exclusion, and record every retained concern or removed sample;
- use `fgsea`/`msigdbr` for ranked pathway analysis and `clusterProfiler` for GO and KEGG over-representation with a declared universe;
- treat PLS-DA or OPLS-DA as exploratory diagnostics in small cohorts, not replacements for DESeq2;
- analyze each species natively, then compare high-confidence orthologs or pathway ranks—never merge mouse and pig count matrices.

Python supports this chain by building sample sheets, validating FASTQ/reference pairs, summarizing MultiQC tables, and checking cross-species joins. R/Bioconductor owns the inferential model. That division keeps the code small and the method legible.

## scRNA-seq: a blueprint, not a claimed completed workflow

RN11 and RN13 do not contain a completed single-cell analysis. For a future droplet-based project, the most maintainable extension is to reuse the Nextflow run contract and add a sample-aware downstream layer:

```text
FASTQ + assay metadata + pinned reference
    → Cell Ranger or pinned nf-core/scrnaseq route
    → raw and filtered feature-barcode matrices
    → per-sample QC, ambient-RNA assessment, and doublet assessment
    → one canonical Seurat or AnnData/Scanpy object
    → clustering and cell-type annotation
    → donor × cell-type pseudobulk counts
    → DESeq2 or edgeR with donor/sample as the replicate
```

### Upstream and QC

- Use the vendor-supported Cell Ranger route for a conventional 10x assay when its outputs and license fit the project; use a pinned `nf-core/scrnaseq` route when a reproducible Nextflow wrapper and an alternative aligner are preferable.
- Archive both raw and filtered count matrices. Ambient-RNA methods need the empty-droplet background that a filtered matrix discards.
- Inspect genes, UMIs, mitochondrial fraction, empty-droplet calls, and expected recovery per sample. Prefer sample-aware distributions and robust outlier rules over one universal threshold.
- Assess ambient RNA with evidence from background expression and implausible marker leakage. SoupX or a comparable method is a conditional correction, not a mandatory checkbox.
- Estimate doublets per capture with an assay-appropriate expected rate, then inspect flagged cells and cluster context. A detector such as scDblFinder or Scrublet supplies evidence; it does not replace experimental knowledge.

### Analysis object and annotation

Choose one canonical object: Seurat in R or AnnData/Scanpy in Python. Preserve raw integer counts in a named assay or layer; store normalized values and embeddings separately. Moving repeatedly between object systems adds conversion risk without adding evidence.

Integration is mainly for joint visualization, neighborhood construction, and annotation. Keep unintegrated counts and sample identity. A well-mixed UMAP is not proof that unwanted variation was removed correctly, and aggressive integration can erase real condition effects.

Annotate clusters with several concordant signals: canonical markers, negative markers, reference mapping, tissue knowledge, and sample consistency. Keep the evidence table and uncertainty; do not turn a cluster name into ground truth merely because one marker is present.

### Inference uses biological replicates

Cells from one animal or donor are subsamples, not independent experimental replicates. For condition-level differential expression, sum raw counts within each donor × cell type, keep one profile per biological replicate, and fit a sample-level design with DESeq2 or edgeR. Filter sparse cell-type/sample combinations before modeling and report the number of donors and cells contributing to every contrast.

Test cell-type abundance or composition separately from within-cell-type expression. A change in the fraction of macrophages and a transcriptional change inside macrophages answer different questions and require different models.

## The reusable Nextflow run contract

Keep scientific parameters separate from machine settings:

```bash
nextflow run nf-core/rnaseq \
  -r 3.25.0 \
  -profile docker \
  -params-file params/run.json \
  -c config/resources.config \
  -w /path/to/work
```

- `-r` pins pipeline code.
- `-params-file` holds typed inputs and scientific choices.
- `-c` holds resource limits and infrastructure overrides.
- the container profile fixes process software.
- a project wrapper supplies `preflight`, `run`, `resume`, and `status` commands.

Archive the samplesheet, parameter file, custom config, command, reference manifest, pipeline report, trace/timeline, MultiQC report, software-version file, and the exact downstream session information. Keep the Nextflow work directory disposable only after published outputs and provenance have been verified.

## Minimal project shape

```text
project/
├── data/metadata/             # sample sheet and data dictionary
├── project_files/
│   ├── config/                # machine/resource settings
│   ├── params/                # typed scientific parameters
│   ├── scripts/               # generators, validators, downstream code
│   └── run_pipeline.sh        # small preflight/run/resume wrapper
├── pipeline_results/          # published upstream outputs and run metadata
├── analysis/                  # curated downstream tables and models
├── figures/                   # figures plus source tables
└── docs/                      # methods, decisions, exclusions, limitations
```

Reuse this shape across modalities. Change the parser and statistical model, not the provenance rules.

## Sources and next references

- [Nextflow command line and `-params-file`](https://www.nextflow.io/docs/latest/cli.html)
- [nf-core/rnaseq 3.25.0 usage](https://nf-co.re/rnaseq/3.25.0/docs/usage/)
- [quantmsdiann inputs and execution](https://quantmsdiann.quantms.org/input/)
- [DIA-NN documentation and releases](https://github.com/vdemichev/DiaNN)
- [MSstats on Bioconductor](https://bioconductor.org/packages/release/bioc/html/MSstats.html)
- [DESeq2 on Bioconductor](https://bioconductor.org/packages/release/bioc/html/DESeq2.html)
- [tximport on Bioconductor](https://bioconductor.org/packages/release/bioc/html/tximport.html)
- [nf-core/scrnaseq](https://nf-co.re/scrnaseq/latest/)
- [10x Genomics Cell Ranger](https://www.10xgenomics.com/support/software/cell-ranger/latest)
- [Scanpy tutorials](https://scanpy.readthedocs.io/en/stable/tutorials/)
- [Seurat differential-expression and pseudobulk workflow](https://satijalab.org/seurat/articles/de_vignette.html)
- [scDblFinder on Bioconductor](https://bioconductor.org/packages/release/bioc/html/scDblFinder.html)
- [SoupX documentation](https://github.com/constantAmateur/SoupX)
- [Squair et al.: biological replicates in single-cell differential expression](https://doi.org/10.1038/s41467-021-25960-2)
