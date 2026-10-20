---
title: Signal transduction
permalink: /notes/signal-transduction/
date: 2026-10-20
updated: 2026-10-20
description: G-protein switches, second messengers, kinase pathways, and recall practice based on B305 and B306.
colorimetry_interactive: true
---

To remember a pathway, name its **receptor → switch → effector → messenger → response**, then explain how it stops. Not every pathway uses all five roles. These study diagrams follow B305 and B306; they simplify the network without making every arrow the same kind of reaction.

## A switch is not a kinase

An activated **GPCR** promotes GDP release and GTP binding on a heterotrimeric G protein. GDP is exchanged, not phosphorylated. Gα–GTP and Gβγ can regulate effectors; GTP hydrolysis returns Gα toward its inactive GDP-bound state. Receptor desensitization is a separate control: GRK phosphorylation and arrestin binding reduce further G-protein coupling. B305, slides 13–16 and 56.

Choose a Gα family. First predict the messenger's direction; then trace the path and its reset.

{% include colorimetry/fig-signal-1.html %}

The receptor and cell determine which effectors are available. **Gs stimulates adenylyl cyclase; Gi inhibits susceptible AC isoforms.** Neither statement means every response to that G protein has the same sign. In the lecture's PKA model, four cAMP molecules bind the regulatory subunits of an R₂C₂ complex, releasing the catalytic subunits. PKA phosphorylates Ser/Thr residues; the target determines whether its function increases or decreases. B305, slides 26 and 34–38.

**Cholera toxin** impairs Gαs GTPase-mediated shutoff, sustaining AC stimulation. **Pertussis toxin** prevents receptor coupling to Gi/o, so receptor-driven Gi inhibition of AC is lost. Both can raise cAMP, through different disrupted steps. B305, slides 23–24 and 27.

<details class="recall-question">
<summary>Does Gα activation add a phosphate to GDP?</summary>
<p>No. GDP leaves and GTP binds. This nucleotide exchange differs from a protein kinase transferring phosphate from ATP to a protein.</p>
</details>

<details class="recall-question">
<summary>Why can cholera and pertussis toxins both raise cAMP?</summary>
<p>Cholera sustains the Gs accelerator; pertussis removes receptor access to the Gi brake. Name the affected G protein and the disrupted step before predicting the messenger.</p>
</details>

## Follow the messenger's production and removal

**ATP → cAMP → 5′-AMP** uses adenylyl cyclase, then PDE. **GTP → cGMP → 5′-GMP** uses guanylate cyclase, then PDE. A PDE inhibitor reduces breakdown; it does not itself synthesize cyclic nucleotide.

B305 explicitly stars PDE specificity and PDE5 inhibitors on slides 30 and 33:

| Substrate | PDE families |
|---|---|
| cAMP-specific | 4, 7, 8 |
| cGMP-specific | 5, 6, 9 |
| Both | 1, 2, 3, 10, 11 |

Ca²⁺–calmodulin stimulates PDE1; cGMP inhibits PDE3. Sildenafil, vardenafil, and tadalafil target PDE5. The photoreceptor cascade uses **PDE6**, a different family.

There are also different routes to cGMP production. **NO activates soluble guanylate cyclase** through its heme-containing sensor; **natriuretic peptides activate receptor guanylate cyclases**. GTP supplies the cGMP product. These inputs are distinct from the retinal cyclase feedback described in the [photoreceptor diagram]({{ '/notes/colorimetry/module-1/#phototransduction' | relative_url }}). B305, slides 41–47.

**Gq offers a useful contrast.** PLC-β cleaves PIP₂ into soluble IP₃ and membrane-retained DAG. IP₃ releases ER Ca²⁺; Ca²⁺ binds calmodulin. Conventional PKCs need DAG and Ca²⁺, whereas novel PKCs respond to DAG without requiring Ca²⁺. Ca²⁺ signaling ends through extrusion, resequestration, and buffering, alongside messenger metabolism. B305, slides 49–55.

<details class="recall-question">
<summary>If PDE6 is blocked during a flash, which part of the light response is impaired?</summary>
<p>Light-driven cGMP hydrolysis. cGMP would remain higher than with normal PDE6 activity, limiting CNG-channel closure and the normal hyperpolarizing response. The direct channel ligand is cGMP; PKG phosphorylation is not the opening step in this cascade.</p>
</details>

<details class="recall-question">
<summary>Where do IP₃ and DAG go after PLC cleaves PIP₂?</summary>
<p>IP₃ diffuses through the cytosol to ER IP₃ receptors. DAG stays in the membrane. The resulting Ca²⁺ signal and membrane-localized DAG help activate conventional PKC.</p>
</details>

## Locate the kinase before memorizing the arrows

An **RTK has its own tyrosine kinase domain**. Ligand-dependent association or rearrangement activates the receptor, with trans-autophosphorylation creating or regulating signaling sites. This is a common model, not a rule that every receptor starts as separate monomers. The insulin receptor is a preassembled example. [Full-length receptor experiment](https://pmc.ncbi.nlm.nih.gov/articles/PMC5940312/) A **cytokine receptor** in the JAK/STAT model instead uses an associated non-receptor tyrosine kinase. B306, slides 12–18 and 34–35.

{% include colorimetry/fig-signal-2.html %}

Docking determines which pathway is assembled. **SH2** recognizes a phosphotyrosine-containing sequence; **SH3** recognizes suitable proline-rich sequences. Grb2 links receptor signaling to the Ras GEF SOS through these domains. **PH-domain specificity varies**: the Akt/PDK1 example involves phosphoinositide recruitment, but PH is not a universal label for PIP₃ binding. B306, slides 17–24. [Original Grb2/SOS experiments](https://pubmed.ncbi.nlm.nih.gov/8479540/)

Keep three different operations separate:

- **SOS exchanges Ras-bound GDP for GTP.** Ras–GTP then recruits and activates Raf; Ras itself is not the kinase in the cascade. Raf → MEK → ERK corresponds to MAPKKK → MAPKK → MAPK. GAPs accelerate Ras GTP hydrolysis; phosphatases remove protein phosphates.
- **PI3K phosphorylates a lipid.** It converts PIP₂ to PIP₃, rather than cleaving it into IP₃ and DAG. The lecture's PDK1 → Akt route is a useful starting point; canonical full Akt activation also involves mTORC2 phosphorylation at Ser473, alongside PDK1 at Thr308. [Original mTORC2 experiments](https://pubmed.ncbi.nlm.nih.gov/15718470/)
- **JAK phosphorylates STAT.** Activated STAT complexes enter the nucleus to regulate genes. They do not have to pass through the Ras → Raf → MEK → ERK sequence. The diagram shows a simplified dimer route; ligand-specific STAT complexes differ. [Early JAK/STAT experiments](https://pubmed.ncbi.nlm.nih.gov/7504784/)

The **TGF-β** example uses receptor Ser/Thr kinases: type II activates type I, which phosphorylates SMAD2/3; association with SMAD4 supports nuclear signaling. BMP commonly uses SMAD1/5/9; SMAD9 is also called SMAD8. [BMP experiments](https://pubmed.ncbi.nlm.nih.gov/11282024/), [SMAD9 nomenclature](https://www.ncbi.nlm.nih.gov/gene/4093) “SMAD” does not specify one interchangeable pair for every ligand. B306, slides 37–38. [SMAD2/3/4 experiments](https://pubmed.ncbi.nlm.nih.gov/9311995/)

<details class="recall-question">
<summary>Would an SH3 domain normally dock directly on the receptor's phosphotyrosine?</summary>
<p>That is the SH2 recognition role in the Grb2 example. Grb2's SH3 domains bind proline-rich SOS sequences. Recruitment and enzymatic activity are different jobs.</p>
</details>

<details class="recall-question">
<summary>Does a Ras GAP switch Ras on or off? What about a GEF?</summary>
<p>A GAP accelerates GTP hydrolysis and favors the off state. A GEF promotes nucleotide exchange and favors activation when GTP binds. Neither is the downstream Raf kinase.</p>
</details>

<details class="recall-question">
<summary>Does PI3K produce IP₃ and DAG?</summary>
<p>No. PLC cleaves PIP₂ into IP₃ and DAG. PI3K adds a phosphate to PIP₂, producing the membrane lipid PIP₃. Watch the placement of the letter P.</p>
</details>

## A receptor can participate directly in transcription

Nuclear receptors have a ligand-binding domain and a conserved DNA-binding domain with **two C4 zinc fingers**, each coordinating zinc through four cysteines. In the classical **glucocorticoid-receptor** example, ligand changes receptor/chaperone interactions and promotes nuclear accumulation and transcriptional regulation. In the classical **thyroid/retinoic-acid receptor** example, ligand changes corepressor/coactivator recruitment at a DNA-associated complex. B306, slides 45–53. [Corepressor experiments](https://pubmed.ncbi.nlm.nih.gov/7566127/)

Treat Type I and Type II as teaching patterns. The unliganded estrogen and glucocorticoid receptors differ in localization; “all Type I receptors are exclusively cytosolic until ligand arrives” is too absolute. [Receptor-localization experiments](https://pubmed.ncbi.nlm.nih.gov/2100202/)

A membrane receptor can also change transcription through downstream kinases or STAT. The distinction is **which molecule senses the ligand, and how it reaches the transcription machinery**. Pathways share components, feedback, and scaffolds; the separate routes above are parts of a network, as emphasized in B306, slides 40–43.

<details class="recall-question">
<summary>If a ligand changes gene expression, must its receptor be nuclear?</summary>
<p>No. RTK/MAPK and cytokine/JAK/STAT pathways can regulate transcription after a signal begins at the membrane. Identify the ligand-binding receptor and the downstream transcriptional regulator separately.</p>
</details>

## Sources

Course basis: Craig A. Doupnik, *Signal Transduction I* (B305, 65 slides) and *Signal Transduction II* (B306, 64 slides), GMS6001, 2026. The original lecture figures are not reproduced here. Slide numbers above map the study material to the supplied PDFs; the recall questions are practice prompts, not predictions of exam questions.

The linked primary experiments support the expanded mechanisms and qualifications. For photoreceptor activation, shutoff, and calcium feedback, continue with [Light and vision]({{ '/notes/colorimetry/module-1/#phototransduction' | relative_url }}).
