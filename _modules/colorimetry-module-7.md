---
title: "Module 7: Color transforms"
short_title: "Color transforms"
series: colorimetry
module_number: 7
slug: module-7
permalink: /notes/colorimetry/module-7/
date: 2025-12-10
description: "Fitting a mapping and knowing its limits."
math: false
colorimetry_interactive: true
updated: 2026-10-20
---

A color transform should be judged by its domain, residual errors, and failure cases as well as its fit to a chart.

## Fit a useful mapping
{: #section-7-1}

A 3×3 matrix gives a linear map between three-component vectors. It is useful for primary conversions and some camera fits. It is invertible only when nonsingular; a poorly conditioned matrix can amplify noise.

For a chart fit, let rows of A contain linear camera RGB samples and rows of B contain reference XYZ or another declared linear RGB space. Solve A M ≈ B with QR or SVD, keeping the row-vector convention consistent. This is an empirical characterization under those capture conditions, distinct from the exact coordinate conversion between two defined RGB spaces.

Nonlinear fits, including polynomial, radial-basis, and thin-plate-spline models, can reduce training error. They can also overfit, extrapolate badly, or fold the mapping. Evaluate held-out samples, gradients, neutrals, and exposures outside the fitting set.

A useful constraint is exposure scaling: a linear matrix satisfies f(kx) = kf(x). Ordinary polynomial terms of different degrees generally break that relationship. Root-polynomial color correction was developed to retain exposure scaling while extending the fit beyond a 3×3 matrix. Its assumptions and handling of negative values still need attention. [Finlayson, Mackiewicz, and Hurlbert (2015)](https://doi.org/10.1109/TIP.2015.2405336)

Thin-plate-spline color transfer can smoothly warp a palette, but palette transfer and camera colorimetric characterization optimize different objectives. Grogan and Dahyot demonstrate a particular research method; it is not evidence that an unspecified commercial “Color Match” button uses the same algorithm. [Grogan and Dahyot (2019)](https://doi.org/10.1016/j.cviu.2019.02.002)

{% include colorimetry/fig-7-1.html %}

The illustration compares a linear shear with a deliberately simple nonlinear bend. It is not a measured camera match or a thin-plate-spline implementation. A good fit to one chart cannot recover arbitrary spectral information lost at capture.

## Know what can be reversed
{: #section-7-2}

A 3D LUT samples a mapping on a lattice. Interpolation estimates the values between samples. Grid size, domain, shaper, precision, and interpolation method all matter; tetrahedral interpolation is common, but cannot restore information already lost by the transform.

{% include colorimetry/fig-7-2.html %}

Clipping maps several inputs to the same output, so no unique inverse exists there. Even an invertible analytic transform can become difficult to reverse after quantization or coarse sampling. Use a documented inverse when available, test round trips over the relevant domain, and retain the source image.

An inverse is a property of the mapping over a stated domain, not a feature conferred by machine learning. Near a flat region, even a one-to-one function can amplify small errors: for y = f(x), the inverse slope is 1/f′(x) where the derivative is nonzero. In three dimensions, poor Jacobian conditioning plays a similar role. More LUT samples can reduce approximation error, but cannot recover clipped distinctions.

A 1D LUT applies independent channel functions. A 3D LUT can represent cross-channel dependencies. A shaper allocates the finite lattice across a chosen input range, which matters for wide-range scene-linear values. Trilinear and tetrahedral interpolation are different approximations; compare them against the reference transform over the intended domain instead of assuming one removes every artifact. OCIO exposes interpolation choices and inverse-transform facilities, but neither guarantees an inverse for arbitrary baked data. [OCIO interpolation and inversion options](https://opencolorio.readthedocs.io/en/v2.5.0/api/enums.html)

## Validate the whole handoff
{: #section-7-3}

Use one small, versioned test set throughout the course: a neutral ramp, saturated patches, a chart with measured references, and a real shot containing skin and highlights. Preserve the original data and label the illumination and exposure. The following is a proposed acceptance procedure; its tolerances must come from the production's requirements.

| Test | Compare | Failure it can reveal |
|---|---|---|
| Source interpretation | Known neutral and middle-gray values before rendering | Wrong log curve, gamut, range, or exposure scale |
| Exposure sweep | The same samples at several unclipped exposures | Nonlinear fit instability or hidden clipping |
| Held-out validation | Materials and lighting not used to fit the transform | Overfitting and spectral mismatch |
| Forward/inverse round trip | Recovered samples in the original domain | Noninvertibility, quantization, or poor conditioning |
| LUT versus reference | Off-grid samples and smooth gradients | Sampling, shaper, interpolation, or precision errors |
| Application handoff | Unmodified regions in a common linear space | Incorrect tags, config mismatch, or a baked view |
| Display review | Each intended SDR/HDR version under its target conditions | Rendering or viewing mismatch |

Report both aggregate and worst-case errors, with the measurement space and units. A small average can hide a damaged highlight or hue region. Distinguish numerical agreement between implementations from measured agreement with the scene, and both from a creative preference. The [appendix]({{ '/notes/colorimetry/appendix-mathematics/' | relative_url }}#validation-math) gives compact equations for the fitting and round-trip checks.

This closes the chain: measurement defines the reference, encoding defines the numbers, rendering defines the reproduction, and validation checks that the intended chain actually ran.
