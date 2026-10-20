---
title: "Module 6: Camera encoding"
short_title: "Camera encoding"
series: colorimetry
module_number: 6
slug: module-6
permalink: /notes/colorimetry/module-6/
date: 2025-12-10
description: "Log encoding, working spaces, and RAW."
math: false
colorimetry_interactive: true
updated: 2026-10-20
---

A camera's sensor, color encoding, and viewing transform answer different questions. Compare them separately.

## Encoding is not the sensor
{: #section-6-1}

Log encodings distribute code values efficiently across exposure. They do not create sensor dynamic range or, by themselves, determine a highlight look.

{% include colorimetry/fig-6-1.html %}

The plot uses LogC3's EI800 exposure-value formula, including its linear branch, and the LogC4 software formula. LogC3 parameters vary with exposure index; LogC4's software encoding has a fixed definition. The latter must not be confused with its in-camera hardware encoding. [ARRI LogC3 specification](https://www.arri.com/resource/blob/31918/66f56e6abb6e5b6553929edf9aa7483e/2017-03-alexa-logc-curve-in-vfx-data.pdf), [ARRI LogC4 specification](https://www.arri.com/resource/blob/278790/bea879ac0d041a925bed27a096ab3ec2/2022-05-arri-logc4-specification-data.pdf).

<span id="section-6-2"></span>

ARRI Wide Gamut 3 and 4 define RGB coordinates; LogC3 and LogC4 define transfer functions. A large primary triangle is not a measurement of a sensor's spectral accuracy or the colors it captures.

{% include colorimetry/fig-6-2.html %}

RED's Log3G10 name refers to 18% gray near one third of the signal range and ten stops above it near 1.0. It does not mean three stops below gray. R3D is a RAW format; RWG/Log3G10 is one developed representation, not an inherent display interpretation of every R3D file. [RED white paper](https://s3.amazonaws.com/red_3/downloads/other/white-papers/WhitePaperREDWideGamutRGBandLog3G10.pdf).

A reference value makes these distinctions concrete: linear 0.18 maps to about **0.391007 in LogC3 EI800** and **0.278396 in the LogC4 software encoding**. These are normalized encoded signals, not a measured screen brightness or a camera dynamic-range rating. See the [reference table]({{ '/notes/colorimetry/appendix-mathematics/' | relative_url }}#reference-values).

When mixing cameras, identify the exact RAW development settings or log/gamut pair. Use documented input transforms, then assess matching under the actual illumination. Brand-level claims about “natural,” “clinical,” or “film-like” color are not substitutes for those tests.

## What RAW actually records
{: #section-6-3}

A conventional Bayer block has two green-filtered sites, one red, and one blue. RGGB, BGGR, GRBG, and GBRG are different orientations of that pattern. Each site records a filtered intensity; demosaicing estimates the missing channels using neighboring samples. Other sensor layouts also exist.

{% include colorimetry/fig-6-3.html %}

The doubled green sampling supports spatial detail; it is not a direct copy of the human cone mosaic. Demosaicing, black-level subtraction, white balance, and color conversion all affect a developed image.

RAW tools and SDKs differ in supported cameras and output behavior. Retain their development settings with the image so a later application can reproduce the intended interpretation.

## Separate decoding from the manufacturer's look
{: #camera-comparison}

An ARRI display rendering LUT and an ACES input transform perform different jobs. The first can include rendering for a particular display; the second brings a specified camera encoding into ACES, which still needs its chosen rendering. Comparing the two as if they were competing LogC decoders confounds input conversion with appearance. ARRI's Look File 4 documentation explicitly separates the creative modification from display rendering. [ARRI workflow guide](https://www.arri.com/resource/blob/361314/b94c6d575feb013ad78a01d97989cbd4/arri-how-to-create-an-arri-look-file-4-workflow-guideline-en-data.pdf)

To compare an ARRI look, RED output rendering, or another managed pipeline, hold the source interpretation, exposure, white balance, output target, and viewing conditions fixed. Label the exact transform/version. Differences may be intended rendering choices; an attractive result does not establish a more accurate camera characterization. Avoid inventing a proprietary tone curve from an unrelated S-curve or attributing all highlight behavior to the log encoding.

## RAW to ACES needs a characterized conversion
{: #raw-to-aces}

The name of a decoder is not enough to specify its behavior. Current LibRaw lists output color 6 as ACES, but that does not establish that every executable called `dcraw` implements the same option. Nor does a 16-bit integer TIFF command establish an ACES half-float EXR interchange workflow. Check the exact executable, version, output scaling, and metadata. The ACES white is not D65. [LibRaw parameters](https://www.libraw.org/docs/API-datastruct-eng.html)

`rawtoaces` provides a dedicated conversion path using LibRaw, camera metadata, and spectral characterization when available. Its documented matrix methods include spectral data and metadata-based alternatives; the chosen method affects what can be claimed about the result. A metadata fallback is not a newly measured spectral characterization of that camera. [rawtoaces documentation](https://academysoftwarefoundation.github.io/rawtoaces/)

For a still-RAW conversion, retain the original file and record the decoder version, black-level handling, white-balance choice, matrix method and data source, exposure scaling, output primaries, and encoding. Validate a neutral ramp, a chart under the intended illumination, and unclipped highlights in a downstream ACES application. Commands alone cannot validate color accuracy, and demosaiced output is already a processed estimate rather than untouched sensor samples.
