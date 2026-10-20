---
title: "Module 1: Light and vision"
short_title: "Light and vision"
series: colorimetry
module_number: 1
slug: module-1
permalink: /notes/colorimetry/module-1/
date: 2025-12-10
description: "Spectra, vision, and the standard observer."
math: true
colorimetry_interactive: true
updated: 2026-10-20
---

A pair of materials can match under one lamp and separate under another. A gray patch can change appearance without changing its pixels. Your eye even has a gap that you usually do not notice. Start with these observations, then follow the light that produces them.

## Light meets a surface
{: #section-1-1}

For a matte, nonfluorescent surface, the light reaching the eye depends on the illuminant spectrum, surface reflectance, and geometry. A spectrum describes power across wavelengths; a color-temperature label does not specify its shape. Correlated color temperature (CCT) locates a source relative to the Planckian locus under a specified chromaticity convention. It is meaningful only sufficiently near that locus, and does not uniquely specify even chromaticity: the distance from the locus matters too. Two lamps labeled 5600 K can differ in tint and spectral distribution. [CIE definition of CCT](https://www.cie.co.at/eilvterm/17-23-068)

**Try it:** change the blackbody temperature. Its broad distribution changes continuously; the synthetic LED has a different shape, even when a lamp of that kind might look similarly white.

{% include colorimetry/fig-1-1.html %}

Different spectra can produce the same three color-matching responses. Such a pair is *metameric* for that observer and illumination. The two synthetic materials below match under equal-energy light. Move toward the LED: their reflectances stay fixed, but the reflected spectra and their color match change.

{% include colorimetry/fig-1-2.html %}

The LED curve here is one synthetic example, not a description of every LED. A smooth spectrum is not automatically a better source for every task, and matching white balance cannot reconstruct missing spectral information.

This is why a lighting score cannot predict every camera–material combination. CRI Ra summarizes eight test-color indices; TM-30 describes fidelity, gamut, and hue-dependent shifts; SSI compares source spectra. Use those measures alongside tests of the actual light, camera, and materials. [IES](https://ies.org/advocacy/ps-11-18/), [Academy SSI](https://www.oscars.org/science-technology/projects/spectral-similarity-index-ssi).

## The eye reduces a spectrum
{: #section-1-2}

Cones are densely packed near the foveal center; rods are absent from its central rod-free zone. Farther out, rods and cones coexist. Peripheral vision is not simply colorblind. The optic disc is a separate region with neither rods nor cones. [Curcio et al.](https://pubmed.ncbi.nlm.nih.gov/2324310/)

{% include colorimetry/fig-1-3.html %}

<span id="section-1-3"></span>
The L, M, and S cone classes have overlapping sensitivities, not narrow red, green, and blue bands. Select a channel to see how much of the spectrum it responds to. These are standard-observer functions, not measurements of your eye.

{% include colorimetry/fig-1-4.html %}

<span id="section-1-5"></span>
For a nonfluorescent reflecting sample, XYZ summarizes the illuminant E and reflectance R through three weighted integrals:

$$
\begin{bmatrix}X\\Y\\Z\end{bmatrix}
=k\int E(\lambda)R(\lambda)
\begin{bmatrix}\bar{x}(\lambda)\\\bar{y}(\lambda)\\\bar{z}(\lambda)\end{bmatrix}\,d\lambda.
$$

The bars identify the [CIE color-matching functions](https://doi.org/10.25039/CIE.DS.xvudnb9b); k sets the normalization. For an emissive source, integrate its spectral radiance directly. XYZ describes a standard observer, not literal cone excitations.

{% include colorimetry/fig-1-5.html %}

A camera uses its own spectral sensitivities. A fixed 3×3 matrix can reproduce standard-observer responses for arbitrary spectra only when those sensitivities span the observer functions. A chart fit can help a particular setup without solving every spectral mismatch.

## Appearance is more than three numbers
{: #section-1-4}

Luminance is a photometric quantity; brightness is a perceptual attribute. Change the right surround below: the two center patches keep exactly the same pixels, yet may look different. Equal luminance does not guarantee equal appearance.

{% include colorimetry/fig-1-6.html %}

A gray card with reflectance 0.18 is not universally “half as bright as white.” Under the usual normalization, linear 0.18 encodes to about 0.461 in sRGB and gives CIELAB L* ≈ 49.5. Encoding, lightness, and perceived brightness answer different questions.

**Find the missing dot.** Close your left eye and keep your right eye on the cross. Move closer or farther away, or adjust the dot's separation. At a particular position the dot can disappear into the blind spot while the surrounding field appears continuous. The screen has not removed it. [Exploratorium](https://www.exploratorium.edu/snacks/blind-spot)

{% include colorimetry/fig-1-7.html %}

**See a color after it is gone.** In Color mode, look at the central cross for about 15 seconds, then choose Neutral while keeping your gaze fixed. You may briefly see an afterimage with shifted colors on the gray field. Adaptation changes the visual response over time; this is a different demonstration from the simultaneous-surround effect above. Use the site's Color setting for this experiment. [Exploratorium](https://www.exploratorium.edu/snacks/bird-in-cage)

{% include colorimetry/fig-1-8.html %}

### From photons to a neural signal
{: #phototransduction}

In rods and cones, a photon can isomerize the opsin-bound chromophore from 11-cis to all-trans retinal. Activated opsin drives transducin, which activates PDE6; cGMP falls and cyclic-nucleotide-gated (CNG) channels close. The cell **hyperpolarizes**, reducing glutamate release. Darkness sustains an inward current and tonic transmitter release. Choose Dark, Light, and Recovery to follow the causal changes. The diagram uses a rod example; rods and cones share this basic cascade but differ in sensitivity and kinetics. [Photoreceptor experiments](https://pubmed.ncbi.nlm.nih.gov/3386743/)

{% include colorimetry/fig-1-9.html %}

The CNG channel is a **direct cGMP effector**. PDE6 destroys its ligand; the light signal does not open the channel by activating PKG. In the outer segment, less CNG-mediated Na⁺/Ca²⁺ entry shifts the membrane toward hyperpolarization. At the synaptic terminal, the resulting reduction in voltage-gated Ca²⁺ entry reduces glutamate release. Those are different channels in different compartments.

After a brief flash, recovery requires both **shutoff and replenishment**:

- GRK1 phosphorylates activated rod rhodopsin; arrestin binding helps complete its quenching. Mouse rods lacking either protein have abnormally prolonged photoresponses. [GRK1 experiment](https://pubmed.ncbi.nlm.nih.gov/10097103/), [arrestin experiment](https://pubmed.ncbi.nlm.nih.gov/9333241/)
- Transducin hydrolyzes GTP; the RGS9 complex accelerates this step, ending transducin's activation of PDE6. RGS9-deficient mouse rods recover much more slowly. [RGS9 experiment](https://pubmed.ncbi.nlm.nih.gov/10676965/)
- CNG closure lowers Ca²⁺ entry while extrusion continues. Lower outer-segment Ca²⁺ changes GCAP regulation of retinal guanylate cyclase, promoting cGMP synthesis and helping channels reopen as PDE6 activity subsides. Mouse GCAP-knockout experiments demonstrate this feedback's role in flash sensitivity and recovery. These processes overlap; they are not a three-step clock. [GCAP experiments](https://pmc.ncbi.nlm.nih.gov/articles/PMC55558/)

A rod's flash response is **graded**. In the B305 lecture trace, stronger flashes produce larger, longer hyperpolarizations until the voltage response saturates. This differs from the ganglion-cell action potentials farther downstream. The lecture's numerical amplification example illustrates a cascade; its molecule counts are not universal constants for every species or stimulus.

<details class="recall-question">
<summary>Light activates a receptor. Why does the photoreceptor release less transmitter?</summary>
<p>Activated rhodopsin → transducin–GTP → PDE6 → less cGMP → CNG closure → less inward current → hyperpolarization → less synaptic Ca²⁺ entry → less glutamate. Reconstruct every link before opening this answer.</p>
</details>

For the broader signaling comparison, use [Signal transduction]({{ '/notes/signal-transduction/' | relative_url }}): Gs/Gi/Gq versus Gt, then RTK/Ras, PI3K/Akt, JAK/STAT, SMAD, and nuclear receptors, with B305/B306 recall practice.

**Why a dark room takes time.** Adaptation operates on several timescales. When light closes CNG channels, calcium entry falls; calcium-dependent feedback adjusts the photoreceptor's gain. This feedback was demonstrated directly in amphibian rods and cones. After strong light exposure, recovering sensitivity also depends on regenerating visual pigment, including the supply of 11-cis retinal through the visual cycle. Cone-mediated vision generally recovers sooner; rods eventually support much lower light levels. Pupil dilation changes the light entering the eye, but does not explain the whole recovery. [Calcium feedback](https://pubmed.ncbi.nlm.nih.gov/3386743/), [human retinal recovery](https://pubmed.ncbi.nlm.nih.gov/16777945/).

There is no universal “20-minute reset.” In one human electroretinography experiment, rod-driven bipolar responses took about 35–40 minutes to recover fully after a near-total pigment bleach; weaker exposures behaved differently. The preceding illumination and the response being measured matter. The afterimage above is a short perceptual experiment, not a measurement of that recovery curve. [Cameron et al.](https://pubmed.ncbi.nlm.nih.gov/16777945/)

The **Purkinje shift** is a change in relative spectral sensitivity as vision moves toward scotopic conditions: shorter-wavelength stimuli gain relative brightness compared with longer-wavelength stimuli. It is not a blue signal produced by rods, and does not by itself explain the creative convention of a blue night grade. Mesopic vision involves both rod and cone contributions. [CIE definition](https://www.cie.co.at/eilvterm/17-22-036)

**The retina already processes the image.** Photoreceptors feed bipolar cells, then ganglion cells; horizontal and amacrine circuits shape spatial and temporal comparisons. ON and OFF pathways separate light increments and decrements, while opponent pathways compare cone signals. Ganglion-cell spikes carry these processed signals toward the brain. The main pathway for conscious vision passes through the lateral geniculate nucleus to primary visual cortex and onward through interacting visual areas. Human imaging finds several color-biased regions along the ventral visual pathway; there is no single cortical patch that performs all color perception. [Human cortical mapping](https://pubmed.ncbi.nlm.nih.gov/26843649/)

The visual system also uses surrounding surfaces to help distinguish a change in illumination from a change in the object. This *color constancy* is useful but incomplete. Human imaging has found representations that retain information about surface color across illumination changes. This is one reason a pixel value alone cannot predict appearance. [Illuminant-invariant representations](https://pubmed.ncbi.nlm.nih.gov/28673878/)

**Skin is a useful test case.** Its reflected spectrum depends on melanin, hemoglobin, tissue scattering, and the light falling on it. These contributions vary across people and across a single face. Measurements of human skin show substantial variation associated with pigment content; a single ideal RGB “skin tone” cannot represent that diversity. [In-vivo spectral measurements](https://doi.org/10.1111/php.12785)

Face perception combines color with shape and contrast. In an fMRI study comparing naturally colored and blue-tinted faces, color affected responses in the left fusiform face area. That supports an interaction between face and color processing, not a universal skin-tone detector or a way to read someone's health from an uncalibrated photograph. For photography, the practical implication is to judge skin within its lighting and surrounding colors, preserving the person's variation instead of forcing every face toward one hue. [Nakajima et al.](https://doi.org/10.1002/hbm.22535)

## From matching to appearance
{: #appearance-models}

Colorimetry asks whether stimuli match for a defined observer. A color appearance model adds viewing conditions to predict attributes such as lightness, brightness, colorfulness, chroma, and hue. These are distinct quantities: lightness is judged relative to a similarly illuminated white, whereas brightness concerns how much light a stimulus appears to emit or reflect. CIECAM16 combines a chromatic adaptation model with perceptual correlates; it does not reconstruct the entire spatial and temporal response of a person viewing a scene. [CIECAM16, CIE 248:2022](https://www.cie.co.at/publications/cie-2016-colour-appearance-model-colour-management-systems-ciecam16)

Three effects explain why a numerically simple grade can change appearance:

- **Helmholtz–Kohlrausch:** chromatic stimuli can appear brighter than achromatic stimuli at equal luminance. The magnitude depends on the stimulus and observer. An equal-Y comparison is not necessarily an equal-brightness comparison. [Hellwig's experimental work](https://repository.rit.edu/theses/11634/)
- **Abney:** adding white light can change perceived hue as well as reduce purity. A straight line toward white in xy is therefore not generally a constant-perceived-hue path. [O’Neil et al.](https://doi.org/10.1364/JOSAA.29.00A165)
- **Bezold–Brücke:** changing luminance can change perceived hue even at fixed chromaticity. Experimental results depend on adaptation, timing, and luminance range; a short list of universally invariant wavelengths would be misleading. [Pridmore](https://doi.org/10.1016/S0042-6989(99)00085-1)

These are properties of vision, not defects to cancel with one universal correction LUT. For a grade, first stabilize the viewing conditions, then compare appearance alongside scopes. For a model, state the viewing parameters and the phenomenon it is intended to predict. ACES 2 later uses an appearance representation for rendering; that does not make its output a simulation of every effect listed here.

The next chapter turns a controlled visual match into coordinates. Those coordinates are powerful precisely because their observer and reference conditions are defined.
