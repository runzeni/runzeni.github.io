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
updated: 2026-10-13
---

Color starts with a spectrum. An observer reduces that spectrum to a small set of responses; appearance also depends on adaptation and context.

## 1.1 Light and surfaces
{: #section-1-1}

For a matte, nonfluorescent surface, the spectrum reaching the eye depends on the illuminant, the surface reflectance, and the viewing geometry. A spectral power distribution tells us how radiant power varies with wavelength. Color temperature alone does not describe its shape.

{% include colorimetry/fig-1-1.html %}

Tungsten is approximately a thermal radiator. LEDs vary widely: a blue-pump phosphor lamp, an RGB fixture, and a broad-spectrum cinema light can have quite different spectra. A dip does not by itself establish a visible skin-tone error; the surface and observer matter too.

Different spectra can produce the same tristimulus values. These are *metamers* for the specified observer. Change the illumination of two reflective samples, or change the observer, and the match may fail.

{% include colorimetry/fig-1-2.html %}

No single lighting score predicts every camera–subject combination. CRI Ra averages eight test-color indices. TM-30 adds fidelity, gamut, and hue-specific information; SSI compares a source spectrum with a chosen reference. A high score is useful evidence, not a replacement for a test with the actual camera, lighting, and materials. [IES](https://ies.org/advocacy/ps-11-18/), [Academy SSI](https://www.oscars.org/science-technology/projects/spectral-similarity-index-ssi).

## 1.2 The retina
{: #section-1-2}

Cone density is highest near the foveal center. Rods are absent from the central rod-free zone and abundant farther out; cones also remain in the peripheral retina. Peripheral vision is therefore not simply colorblind. The diagram shows this organization, not a measured density profile. [Curcio et al., 1990](https://pubmed.ncbi.nlm.nih.gov/2324310/).

{% include colorimetry/fig-1-3.html %}

## 1.3 Overlapping responses
{: #section-1-3}

The L, M, and S cone classes have broad, overlapping sensitivities. They are not narrow red, green, and blue detectors. The functions below describe a standard observer, rather than every individual eye. Rods dominate at low light levels; rods and cones both contribute in the mesopic range.

{% include colorimetry/fig-1-4.html %}

## 1.4 Measurement and appearance
{: #section-1-4}

Luminance is a photometric quantity; brightness is an attribute of perception. Equal luminance does not guarantee equal apparent brightness. Surround, adaptation, spatial structure, and chromaticity all affect appearance.

{% include colorimetry/fig-1-5.html %}

A gray card with reflectance 0.18 is not universally “half as bright as white.” Under a specified normalization, linear 0.18 encodes to about 0.461 in sRGB and corresponds to CIELAB lightness L* ≈ 49.5. Those are different calculations with different meanings.

## 1.5 From spectra to three numbers
{: #section-1-5}

For a nonfluorescent reflecting sample, the relative tristimulus values are weighted integrals:

$$\begin{bmatrix}X\\Y\\Z\end{bmatrix}=k\int E(\lambda)R(\lambda)\begin{bmatrix}\bar x(\lambda)\\\bar y(\lambda)\\\bar z(\lambda)\end{bmatrix}\,d\lambda.$$

Here E is the illuminant spectrum, R is reflectance, and k sets the normalization. For an emissive source, integrate its spectral radiance directly. The [CIE 1931 standard observer](https://doi.org/10.25039/CIE.DS.xvudnb9b) supplies the color-matching functions.

{% include colorimetry/fig-1-6.html %}

A camera integrates light through its own spectral sensitivities. A fixed 3×3 matrix can reproduce standard-observer responses for arbitrary spectra only when the camera sensitivities span the observer functions. Real cameras generally approximate that condition. A chart fit can improve a particular capture setup without solving every possible spectral mismatch.
