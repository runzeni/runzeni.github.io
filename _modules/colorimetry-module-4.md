---
title: "Module 4: ACES"
short_title: "ACES"
series: colorimetry
module_number: 4
slug: module-4
permalink: /notes/colorimetry/module-4/
date: 2025-12-10
description: "Encodings, rendering, and reproducible workflows."
math: false
colorimetry_interactive: true
updated: 2026-10-13
---

ACES provides defined encodings and transforms for moving images across capture, post-production, and output. Its value depends on using the right transforms and recording their versions.

## 4.1 Encodings and primaries
{: #section-4-1}

| Encoding | Primaries | Transfer | Typical role |
|---|---|---|---|
| ACES2065-1 | AP0 | Linear | Interchange and archival |
| ACEScg | AP1 | Linear | Rendering and compositing |
| ACEScc / ACEScct | AP1 | Logarithmic | Grading |

AP0 is a broad coordinate system, not a display gamut. AP1 is smaller and useful for computation, but its primaries are not all physically realizable either. Enlarging a container cannot recover information absent from the capture. [ACEScg specification](https://docs.acescentral.com/encodings/acescg/).

{% include colorimetry/fig-4-1.html %}

An input transform interprets a particular camera encoding. Decoding a log curve and changing RGB coordinates are separate steps. A change of white point may also require chromatic adaptation. Do not apply a primary-conversion matrix directly to log-encoded values.

## 4.2 Gamut and rendering
{: #section-4-2}

A negative RGB component can represent a valid color outside the positive-primary triangle of the working space. Clamping it to zero discards information and may shift hue. The appropriate handling depends on the stage of the pipeline.

{% include colorimetry/fig-4-2.html %}

ACES 1.3 Reference Gamut Compression addresses problematic scene-referred values. It is distinct from fitting the rendered image into an output display gamut. ACES 2 output rendering uses a JMh appearance representation derived from a simplified Hellwig 2022 model, with coordinated tone, chroma, and gamut stages. This differs materially from the ACES 1 rendering architecture. [ACES output transforms](https://docs.acescentral.com/system-components/output-transforms/).

The simple compression plot above teaches the difference between clipping and a smooth mapping. It is not an implementation of either ACES transform.

## 4.3 A reproducible workflow
{: #section-4-3}

{% include colorimetry/fig-4-3.html %}

Record the input interpretation, working encoding, look, output transform, and configuration version. In Blender or another OCIO application, select a compatible configuration and assign each asset's input space deliberately. A scene-linear EXR is not automatically ACEScg; an EXR exported through a display view is a different deliverable.

An ACES Metadata File can carry transform identifiers and workflow information. It does not guarantee identical output if an application lacks those transforms or interprets the file differently. [AMF specification](https://docs.acescentral.com/amf/specification/).

A LUT can contain a technical conversion, a creative look, or both. Its input and output domains must be documented. Reusing a scene-referred grade can help with SDR and HDR versions, but each output still needs review and may need trims.
