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
updated: 2026-10-13
---

A camera's sensor, color encoding, and viewing transform answer different questions. Compare them separately.

## 6.1 LogC3 and LogC4
{: #section-6-1}

Log encodings distribute code values efficiently across exposure. They do not create sensor dynamic range or, by themselves, determine a highlight look.

{% include colorimetry/fig-6-1.html %}

The plot uses LogC3's EI800 exposure-value formula, including its linear branch, and the LogC4 software formula. LogC3 parameters vary with exposure index; LogC4's software encoding has a fixed definition. The latter must not be confused with its in-camera hardware encoding. [ARRI LogC3 specification](https://www.arri.com/resource/blob/31918/66f56e6abb6e5b6553929edf9aa7483e/2017-03-alexa-logc-curve-in-vfx-data.pdf), [ARRI LogC4 specification](https://www.arri.com/resource/blob/278790/bea879ac0d041a925bed27a096ab3ec2/2022-05-arri-logc4-specification-data.pdf).

## 6.2 Camera working spaces
{: #section-6-2}

ARRI Wide Gamut 3 and 4 define RGB coordinates; LogC3 and LogC4 define transfer functions. A large primary triangle is not a measurement of a sensor's spectral accuracy or the colors it captures.

{% include colorimetry/fig-6-2.html %}

RED's Log3G10 name refers to 18% gray near one third of the signal range and ten stops above it near 1.0—not three stops below gray. R3D is a RAW format; RWG/Log3G10 is one developed representation, not an inherent display interpretation of every R3D file. [RED white paper](https://s3.amazonaws.com/red_3/downloads/other/white-papers/WhitePaperREDWideGamutRGBandLog3G10.pdf).

When mixing cameras, identify the exact RAW development settings or log/gamut pair. Use documented input transforms, then assess matching under the actual illumination. Brand-level claims about “natural,” “clinical,” or “film-like” color are not substitutes for those tests.

## 6.3 RAW and the Bayer mosaic
{: #section-6-3}

A conventional Bayer block has two green-filtered sites, one red, and one blue. RGGB, BGGR, GRBG, and GBRG are different orientations of that pattern. Each site records a filtered intensity; demosaicing estimates the missing channels using neighboring samples. Other sensor layouts also exist.

{% include colorimetry/fig-6-3.html %}

The doubled green sampling supports spatial detail; it is not a direct copy of the human cone mosaic. Demosaicing, black-level subtraction, white balance, and color conversion all affect a developed image.

RAW tools and SDKs differ in supported cameras and output behavior. Do not assume a generic command exports ACES: for example, dcraw's `-o 5` selects XYZ, not ACES. Verify the tool's documentation, output metadata, and a known test image before relying on a conversion. [LibRaw output parameters](https://www.libraw.org/docs/API-datastruct-eng.html).
