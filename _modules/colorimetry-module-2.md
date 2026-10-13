---
title: "Module 2: Measuring color"
short_title: "Measuring color"
series: colorimetry
module_number: 2
slug: module-2
permalink: /notes/colorimetry/module-2/
date: 2025-12-10
description: "Coordinates for describing and comparing color."
math: true
colorimetry_interactive: true
updated: 2026-10-13
---

Color notation becomes useful when its coordinates, observer, and reference conditions are explicit.

## 2.1 Describing a color
{: #section-2-1}

Munsell organizes surface colors by hue, value, and chroma. Value describes lightness; chroma describes departure from a neutral of the same value. Chroma is not interchangeable with saturation. The available extent changes with hue and value, so the physical color solid is irregular.

{% include colorimetry/fig-2-0.html %}

## 2.2 Matching with three primaries
{: #section-2-2}

A color-matching experiment compares a test field with an adjustable mixture of three primaries. Some test colors cannot be matched by adding those primaries on the mixture side alone. Moving a primary to the test side gives a match represented mathematically by a negative coefficient. It does not require negative physical light.

{% include colorimetry/fig-2-1.html %}

## 2.3 XYZ and chromaticity
{: #section-2-3}

CIE XYZ is a linear transformation of color-matching results. Its standard color-matching functions are nonnegative, and Y is proportional to luminance for the specified observer. X and Z are not red and blue channels.

Chromaticity removes the overall scale:

$$x=\frac{X}{X+Y+Z},\qquad y=\frac{Y}{X+Y+Z}.$$

The pair (x, y) needs Y to recover XYZ. It is undefined at X = Y = Z = 0. The curved boundary is the spectral locus; the straight closing segment represents mixtures of the endpoint wavelengths. This diagram describes chromaticities, not the full appearance or luminance of all visible colors.

{% include colorimetry/fig-2-2.html %}

Equal-energy white E has x = y = 1/3. D65 is near (0.3127, 0.3290). A “white point” must always be named.

## 2.4 Unequal distances
{: #section-2-4}

Equal distances in xy do not imply equal perceived differences. MacAdam's classic matching experiments demonstrated that discrimination varies with chromaticity and experimental conditions. Their ellipses should not be treated as a universal visibility threshold.

CIELAB instead uses a specified reference white and nonlinear coordinates L\*, a\*, b\*. It is approximately uniform, not exact; even a ΔE value of 1 is not a universal just-noticeable difference. The figure calculates equal-radius Lab circles at fixed lightness and maps them into xy. It is a coordinate example, not a reproduction of measured MacAdam ellipses. [CIE definition](https://cie.co.at/eilvterm/17-23-076).

{% include colorimetry/fig-2-3.html %}

## 2.5 Film density and log exposure
{: #section-2-5}

A photographic characteristic curve plots optical density against log exposure. A typical negative has a toe, a roughly straight region, and a shoulder; its actual shape depends on the stock and processing. Density is D = −log₁₀(T), where T is transmittance.

{% include colorimetry/fig-2-4.html %}

Digital log encoding also allocates code values across exposure stops, but it does not reproduce film chemistry or determine a camera's highlight appearance. Keep the encoding curve separate from the rendering transform.

The [mathematical appendix]({{ '/notes/colorimetry/appendix-mathematics/' | relative_url }}) defines XYZ, xyY, and Lab calculations used in the figures.
