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
updated: 2026-10-20
---


Two lights can look identical even when their spectra are different. CIE 1931 turns that observation into a measurement system. Its familiar horseshoe diagram is the end of a chain: visual matches, matching functions, XYZ, then xy.

## What observers actually matched
{: #section-2-2}

An observer looks at a small field divided into two halves. One half contains a test light; the other contains a mixture of three primaries. The observer adjusts the primaries until the boundary disappears in color and brightness. Repeating this across wavelengths gives three *color-matching functions*: how much of each primary is needed for each spectral test.

Wright's published study used ten observers for the spectral matches. His results and Guild's independent work underlie the 1931 standard. The experimental data had to be expressed in common primary coordinates and combined with the photopic luminous-efficiency function; XYZ was not obtained by directly recording three cone cells. [Wright's experiment](https://doi.org/10.1088/1475-4878/30/4/301), [Guild's study](https://doi.org/10.1098/rsta.1932.0005), [CIE historical account](https://cie.co.at/files/CCPR-CIE%20Workshop%20abstracts_May%2021.pdf).

The “2° observer” refers to the angular size of the matching field. A 2°-wide field is about 2.1 cm across at a viewing distance of 60 cm. It samples central vision under light-adapted conditions; it is not a claim that all human vision occupies two degrees. The CIE specifies the 1931 observer for roughly 1°–4° fields and the 1964 observer for larger fields under appropriate photopic conditions. [ISO/CIE 11664-1](https://www.cie.co.at/publications/colorimetry-part-1-cie-standard-colorimetric-observers-0)

**Why negative light appears in the arithmetic.** Three physical primaries cannot match every spectral light by addition on the mixture side alone. A primary sometimes has to be added to the test side. When that term is moved across the equation, its coefficient becomes negative. At 530 nm, for example:

$$
T+|R|P_R=GP_G+BP_B
\quad\Longleftrightarrow\quad
T=RP_R+GP_G+BP_B,\qquad R<0.
$$

**Try it:** select a wavelength. Watch which primary moves to the test side. These calculated matches use the CIE RGB basis associated with 700, 546.1, and 435.8 nm primaries, with the normalization documented in the appendix. They illustrate the experimental logic; the gray split field is a diagram, not a spectral-light simulator.

{% include colorimetry/fig-2-1.html %}

**From RGB to XYZ.** A linear change of coordinates preserves the matches while changing their numerical description. CIE XYZ was constructed so that the matching functions are nonnegative for physical spectra and $\bar y(\lambda)$ equals the standard photopic luminous-efficiency function. Y therefore carries the luminance information when the scale and units are specified. X and Z are not red and blue cone responses. The XYZ primaries are mathematical reference directions, not three lamps one could build. [1933 report of the 1931 system](https://opg.optica.org/josa/abstract.cfm?uri=josa-23-10-359)

Switch between CIE RGB and CIE XYZ below. The negative lobe disappears after the transformation, while the underlying matching relationships remain. This historical RGB basis is different from a display's sRGB primaries.

{% include colorimetry/fig-2-5.html %}

## Reading the chromaticity diagram
{: #section-2-3}

XYZ has three coordinates. Dividing by their sum removes the overall scale:

$$
x=\frac{X}{X+Y+Z},\qquad y=\frac{Y}{X+Y+Z},\qquad z=1-x-y.
$$

Only two of these normalized coordinates are independent, so we can draw them on a plane. The curved boundary is the *spectral locus*: monochromatic lights. The straight closing edge, called the line of purples, represents mixtures of the two ends of the locus. There is no single “purple wavelength.”

{% include colorimetry/fig-2-2.html %}

Equal-energy white E is at x = y = 1/3. D65 is near (0.3127, 0.3290). Neither is the center of a perceptually uniform space. The interior can contain many spectra at the same coordinate; xy does not identify an object's reflectance or a lamp's spectrum.

**Add light before dividing.** XYZ values add for additive mixtures. Consequently, the xy coordinates of a mixture lie on the straight line joining its components. Three fixed primaries can reach their triangle's interior by positive mixtures, which explains why a display cannot cover the whole spectral boundary.

**Try it:** mix 450 nm and 650 nm light. At 50% radiant power each, the diamond does not sit at the geometric midpoint. Each component contributes a different total X + Y + Z, so the position along the line is weighted by those totals. This is addition of light, not mixing paint.

{% include colorimetry/fig-2-6.html %}

**What disappeared when we divided?** Multiply X, Y, and Z by the same positive factor and xy stays unchanged. Choose Quarter, Half, and Full below: the light level changes while chromaticity does not. To retain the missing information, use xyY. At zero light, xy is undefined because the denominator is zero.

{% include colorimetry/fig-2-7.html %}

## Where the model stops
{: #section-2-4}

The standard observer is a reference, not a description of every eye. Wright already found differences between observers, including differences associated with macular pigment. A match for one observer need not hold for another. Later cone-fundamental-based CIE work explicitly considers field size and physiology; it does not make existing 1931 specifications interchangeable with newer observers. Name the observer when reporting coordinates. [Wright](https://doi.org/10.1088/1475-4878/30/4/301), [CIE physiological framework](https://www.cie.co.at/publications/fundamental-chromaticity-diagram-physiological-axes-part-2-spectral-luminous).

Equal distances in xy are not equal perceptual differences. CIELAB uses a reference white and nonlinear L\*, a\*, b\* coordinates to make distances more useful, but only approximately uniform. A ΔE of 1 is not a universal visibility threshold. MacAdam's discrimination experiments measured local differences under particular viewing conditions; the diagram below instead plots calculated equal-Lab steps and must not be read as measured ellipses. [CIE definition](https://cie.co.at/eilvterm/17-23-076)

{% include colorimetry/fig-2-3.html %}

The names of older spaces are easy to confuse. CIE 1960 UCS is a two-coordinate *u, v* chromaticity diagram; CIE 1964 U*V*W* is a three-coordinate space. CIELUV uses the later *u′, v′* coordinates. None is the analog-video YUV encoding. The 1964 uniform space is now obsolete apart from uses such as the traditional color-rendering-index calculation. [CIE definition](https://cie.co.at/eilvterm/17-23-078)

For image comparison, state the difference formula, reference white, observer, and normalization. ΔE₇₆ and CIEDE2000 are different computations. HDR television has a separate recommendation, ΔE_ITP, in BT.2124; do not feed PQ code values into a Lab distance calculation and call the result a perceptual error. [ITU-R BT.2124](https://www.itu.int/rec/R-REC-BT.2124/en)

<span id="section-2-1"></span>
Munsell addresses a different practical question: how to arrange surface colors by hue, value, and chroma. Value is lightness; chroma is departure from a neutral of the same value and is not interchangeable with saturation. Its available extent varies with hue and value, so the physical color solid is irregular.

{% include colorimetry/fig-2-0.html %}

## From film density to digital values
{: #section-2-5}

Film density measures transmission: D = −log₁₀(T). A photographic characteristic curve plots density against log exposure, typically with a toe, a near-straight region, and a shoulder. Its shape depends on the stock and processing.

{% include colorimetry/fig-2-4.html %}

In color-negative film, exposure creates a latent image in silver-halide emulsions. Color development produces dyes through reactions involving the developer and dye couplers; subsequent processing removes silver, leaving the dye image. The layers provide subtractive cyan, magenta, and yellow records. The orange mask compensates for unwanted dye absorptions; it is not caused by choosing a density-measurement standard. [Kodak, *Essential Reference Guide*, “How Film Works” and “Basic Sensitometry”](https://www.kodak.com/content/products-brochures/Film/kodak-essential-reference-guide-for-filmmakers.pdf)

Cineon-style scanning connects film density to digital code values. Kodak documents a conventional 10-bit mapping with 0.002 density units per code step and D-min at code 95. That gives 1.856 density units above D-min before code 1023. Its extended-range recommendations show why this mapping can clip dense highlights and why the scanner's actual density scale must be recorded. It is a scanning convention, not a universal exposure curve for every stock. [Kodak scanning recommendations](https://www.kodak.com/content/products-brochures/Film/Scanning-Recommendations-for-Extended-Dynamic-Range-Camera-Films-EN.pdf)

Keep three operations separate: the film's exposure-to-density response, the scanner's density-to-code mapping, and the rendering of the scan for viewing. A log DPX file does not specify all three. Ask the lab for stock and process, scanner calibration, encoding, and viewing transform before interpreting it.

Digital log encoding distributes code values across exposure stops. It does not reproduce film chemistry or determine a camera's highlight look. That distinction between measuring, encoding, and rendering leads into [the image pipeline]({{ '/notes/colorimetry/module-3/' | relative_url }}).

The [mathematical appendix]({{ '/notes/colorimetry/appendix-mathematics/' | relative_url }}#cie-rgb) records the RGB–XYZ transformation, units, and mixture calculations used here.
