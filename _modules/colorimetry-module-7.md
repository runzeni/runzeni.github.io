---
title: "Module 7: Color transforms"
short_title: "Color transforms"
series: colorimetry
module_number: 7
slug: module-7
permalink: /notes/colorimetry/module-7/
date: 2025-12-10
description: "Fitting a mapping—and knowing its limits."
math: false
colorimetry_interactive: true
updated: 2026-10-13
---

A color transform should be judged by its domain, residual errors, and failure cases—not only by its fit to a chart.

## 7.1 Fitting a transform
{: #section-7-1}

A 3×3 matrix gives a linear map between three-component vectors. It is useful for primary conversions and some camera fits. It is invertible only when nonsingular; a poorly conditioned matrix can amplify noise.

Nonlinear fits, including polynomial, radial-basis, and thin-plate-spline models, can reduce training error. They can also overfit, extrapolate badly, or fold the mapping. Evaluate held-out samples, gradients, neutrals, and exposures outside the fitting set.

{% include colorimetry/fig-7-1.html %}

The illustration compares a linear shear with a deliberately simple nonlinear bend. It is not a measured camera match or a thin-plate-spline implementation. A good fit to one chart cannot recover arbitrary spectral information lost at capture.

## 7.2 LUTs and inversion
{: #section-7-2}

A 3D LUT samples a mapping on a lattice. Interpolation estimates the values between samples. Grid size, domain, shaper, precision, and interpolation method all matter; tetrahedral interpolation is common, but cannot restore information already lost by the transform.

{% include colorimetry/fig-7-2.html %}

Clipping maps several inputs to the same output, so no unique inverse exists there. Even an invertible analytic transform can become difficult to reverse after quantization or coarse sampling. Use a documented inverse when available, test round trips over the relevant domain, and retain the source image.

## 7.3 What color transforms cannot protect
{: #section-7-3}

An unusual LUT or reversible channel transform is not encryption. It provides no cryptographic guarantee of confidentiality or authenticity. Protect production material with access control, authenticated encryption, secure transfer, and backups; use image transforms for image processing.
