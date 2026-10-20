---
title: "Module 3: The image pipeline"
short_title: "The image pipeline"
series: colorimetry
module_number: 3
slug: module-3
permalink: /notes/colorimetry/module-3/
date: 2025-12-10
description: "From scene values to a rendered image."
math: false
colorimetry_interactive: true
updated: 2026-10-20
---

An image pipeline needs four separate descriptions: what the values represent, their primaries and white point, their encoding, and how they will be rendered.

## What the values mean
{: #section-3-1}

Scene-referred values describe captured or simulated scene light. They may be linear or log-encoded. Display-referred values describe an image prepared for an output condition; they can also be stored in linear form.

“Linear” and “scene-referred” are therefore not synonyms. Neither JPEG nor ProRes alone specifies the complete color interpretation of an image.

{% include colorimetry/fig-3-1.html %}

An exposure adjustment multiplies scene-linear values by 2 to the power of the stop change. Apply it before the view transform when that is the intended operation. A display brightness adjustment is a different operation.

<span id="section-3-2"></span>

RGB requires primaries, a white point, and an encoding. HSL and HSV reorganize encoded RGB values into convenient controls; their lightness/value coordinates are not perceptually uniform.

Y′CbCr separates a weighted sum of nonlinear R′G′B′ (*luma*, Y′) from chroma differences. Luma is not linear luminance Y. Matrix coefficients, signal range, and chroma sampling are part of the interpretation. Analog YUV and digital Y′CbCr are related concepts, not interchangeable names.

{% include colorimetry/fig-3-2.html %}

Choose a representation by the operation you need:

| Representation | Useful for | What it does not establish |
|---|---|---|
| Linear RGB with named primaries and white | Adding light, compositing, primary conversion | A perceptually uniform editing space |
| Encoded RGB such as sRGB or LogC4/AWG4 | Storage, exchange, or specified grading operations | Scene/display meaning from “RGB” alone |
| XYZ / xyY | Standard-observer measurement and chromaticity | Spectrum or complete appearance |
| Lab / Luv | Approximate perceptual comparison under specified reference conditions | An observer-independent visibility threshold |
| Y′CbCr | Video transport and chroma subsampling | Linear luminance or a camera RAW representation |
| ICtCp | The HDR signal representation specified in BT.2100 | A replacement name for every Y′CbCr signal |
| HSL / HSV | Convenient controls derived from RGB | Equal lightness or brightness at equal L/V |
| CMYK with a printing condition/profile | Ink separation and print reproduction | One universal four-channel color space |

The definitions of television signal representations come from [BT.709](https://www.itu.int/rec/R-REC-BT.709/en) and [BT.2100](https://www.itu.int/rec/R-REC-BT.2100/en); device interpretation is the role of [ICC profiles](https://www.color.org/getting-started/). For example, CMYK percentages depend on the inks, substrate, and separation. They are not a fixed inverse of RGB.

In 4:2:2, chroma has half the horizontal sampling density of luma; in 4:2:0, it has half in both directions for a progressive image. Chroma siting and filtering still matter. This sampling reduction can affect edges and keys even when a flat patch looks correct. The [appendix]({{ '/notes/colorimetry/appendix-mathematics/' | relative_url }}#video-signal) gives the BT.709 matrix and range conventions.

## Encoding and rendering
{: #section-3-3}

An OETF maps scene light to an encoded signal; an EOTF maps a signal to display light. The overall scene-to-display relationship is the OOTF. They need not be simple inverses once rendering intent and viewing conditions are included.

sRGB uses a linear segment near black and a power segment above it. A simple gamma power law is only an approximation. This explorer compares the equations; it does not simulate monitor brightness.

{% include colorimetry/fig-3-3.html %}

PQ is an absolute display-luminance encoding, defined up to 10,000 cd/m². HLG starts with a relative scene-light encoding and includes a system relationship to the display. Their independent variables differ; overlaying them without defining normalization is misleading. [ITU-R BT.2100-3](https://www.itu.int/rec/R-REC-BT.2100/en).

<span id="section-3-4"></span>

Tone mapping compresses an intensity range. Gamut mapping handles colors the target cannot reproduce. A useful view transform coordinates both; independently clipping RGB channels can change hue and erase distinctions.

{% include colorimetry/fig-3-4.html %}

Blender's AgX and Khronos PBR Neutral serve different rendering priorities. AgX handles a broad exposure range and desaturates bright highlights; PBR Neutral targets faithful base-color reproduction for well-exposed products under neutral illumination. Neither should be described as literal film chemistry. Use the actual versioned implementation for image comparisons, rather than labeling an arbitrary S-curve with a product name. [Blender](https://docs.blender.org/manual/en/5.0/render/color_management/displays_views.html), [Khronos](https://www.khronos.org/news/press/khronos-pbr-neutral-tone-mapper-released-for-true-to-life-color-rendering-of-3d-products).

## A transform changes values; a tag describes them
{: #transform-order}

Assigning the correct source interpretation tells a pipeline what the existing numbers mean. Converting changes the numbers to preserve a specified relationship in a new representation. Assigning sRGB to LogC data does not perform a LogC-to-sRGB conversion.

For a typical camera log input, the conceptual sequence is **decode the camera transfer → convert linear coordinates, including the specified white adaptation → work on the image → render for the target → encode the output**. Some applications combine these steps. Record their domains so that a camera LUT, managed timeline, and viewer do not each apply the same rendering.

Chromatic adaptation is especially important when converting D65 camera/display coordinates to the ACES white. It models a change in adopted white; it is not simply dividing the XYZ components by a new white or measuring the scene's illuminant. Use the adaptation specified by the input transform, not an extra correction added by eye. [ARRI LogC4 conversion to ACES, §4.3.2](https://www.arri.com/resource/blob/278790/bea879ac0d041a925bed27a096ab3ec2/2022-05-arri-logc4-specification-data.pdf)

A useful first diagnostic is an exposure ramp in scene-linear values. Move it by one stop before rendering, then repeat the adjustment on the encoded output. The operations generally differ because rendering and encoding are nonlinear. This explains why operation order belongs in the workflow specification.
