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
updated: 2026-10-13
---

An image pipeline needs four separate descriptions: what the values represent, their primaries and white point, their encoding, and how they will be rendered.

## 3.1 Scene and display reference
{: #section-3-1}

Scene-referred values describe captured or simulated scene light. They may be linear or log-encoded. Display-referred values describe an image prepared for an output condition; they can also be stored in linear form.

“Linear” and “scene-referred” are therefore not synonyms. Neither JPEG nor ProRes alone specifies the complete color interpretation of an image.

{% include colorimetry/fig-3-1.html %}

An exposure adjustment multiplies scene-linear values by 2 to the power of the stop change. Apply it before the view transform when that is the intended operation. A display brightness adjustment is a different operation.

## 3.2 Color models
{: #section-3-2}

RGB requires primaries, a white point, and an encoding. HSL and HSV reorganize encoded RGB values into convenient controls; their lightness/value coordinates are not perceptually uniform.

Y′CbCr separates a weighted sum of nonlinear R′G′B′—*luma*, Y′—from chroma differences. Luma is not linear luminance Y. Matrix coefficients, signal range, and chroma sampling are part of the interpretation. Analog YUV and digital Y′CbCr are related concepts, not interchangeable names.

{% include colorimetry/fig-3-2.html %}

## 3.3 Transfer functions
{: #section-3-3}

An OETF maps scene light to an encoded signal; an EOTF maps a signal to display light. The overall scene-to-display relationship is the OOTF. They need not be simple inverses once rendering intent and viewing conditions are included.

sRGB uses a linear segment near black and a power segment above it. A simple gamma power law is only an approximation. This explorer compares the equations; it does not simulate monitor brightness.

{% include colorimetry/fig-3-3.html %}

PQ is an absolute display-luminance encoding, defined up to 10,000 cd/m². HLG starts with a relative scene-light encoding and includes a system relationship to the display. Their independent variables differ; overlaying them without defining normalization is misleading. [ITU-R BT.2100-3](https://www.itu.int/rec/R-REC-BT.2100/en).

## 3.4 Rendering for a display
{: #section-3-4}

Tone mapping compresses an intensity range. Gamut mapping handles colors the target cannot reproduce. A useful view transform coordinates both; independently clipping RGB channels can change hue and erase distinctions.

{% include colorimetry/fig-3-4.html %}

Blender's AgX and Khronos PBR Neutral serve different rendering priorities. AgX handles a broad exposure range and desaturates bright highlights; PBR Neutral targets faithful base-color reproduction for well-exposed products under neutral illumination. Neither should be described as literal film chemistry. Use the actual versioned implementation for image comparisons, rather than labeling an arbitrary S-curve with a product name. [Blender](https://docs.blender.org/manual/en/5.0/render/color_management/displays_views.html), [Khronos](https://www.khronos.org/news/press/khronos-pbr-neutral-tone-mapper-released-for-true-to-life-color-rendering-of-3d-products).
