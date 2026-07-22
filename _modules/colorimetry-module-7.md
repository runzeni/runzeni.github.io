---
title: "Module 7: Computational Color & Advanced DIT Dev"
short_title: "Computational Color & Advanced DIT Dev"
series: colorimetry
module_number: 7
slug: module-7
permalink: /notes/colorimetry/module-7/
date: 2025-12-10
description: "Working notes on color matching, LUT mathematics, and the boundary between image transforms and real security."
math: true
---

"When the tools break, you have to build your own."

Most DITs are operators. They know which buttons to push.

This module is for the engineers. We are going to look at the raw mathematics that power the color engine, and how you can exploit them to solve problems that off-the-shelf software cannot.

We will cover <mark>Color Matching Algorithms</mark>, <mark>The Danger of Inverse LUTs</mark>, and the boundary between image transforms and real security.

## 7.1 Advanced Color Matching
{: #section-7-1}

How do you make a Canon look like an ARRI? Or how do you match two specific lenses? You need a <mark>Color Transformation</mark>.

### Level 1: The 3×3 Matrix (Linear)

The standard tool for color matching is the <mark>3×3 Matrix</mark>.

- **The Math:** It multiplies the RGB values of one camera to approximate the other.
- **The Formula:**

$$
\begin{bmatrix} R_{\text{out}} \\ G_{\text{out}} \\ B_{\text{out}} \end{bmatrix} =
\begin{bmatrix} a & b & c \\ d & e & f \\ g & h & i \end{bmatrix} \times
\begin{bmatrix} R_{\text{in}} \\ G_{\text{in}} \\ B_{\text{in}} \end{bmatrix}
$$

- **Pros:** Simple, fast, fully invertible.
- **Cons:** It is <mark>linear</mark>. If the Canon sensor has a non-linear twist in the shadows (hue shift), a matrix cannot fix it. It rotates the entire color cube at once.

### Level 2: Thin-Plate Splines (Non-Linear)

When a matrix fails, we use <mark>Thin-Plate Splines (TPS)</mark> or <mark>Radial Basis Functions (RBF)</mark>.

- **The Concept:** Imagine printing the color space on a rubber sheet. You pin down specific colors (e.g., "This Skin Tone must match exactly," "This Coke Can Red must match exactly").
- **The Warp:** The algorithm bends the rubber sheet to align the pins, smoothly warping the colors in between.
- **Application:** These methods can support highly specific local corrections, but a production-grade match still depends on measured targets, illuminant control, and validation footage.

<figure class="diagram-placeholder">
  <div class="diagram-container">
    <div class="placeholder-text">
      {% include colorimetry-figure-in-development.html %}
    </div>
  </div>
  <figcaption>Figure 7.1: Color matching algorithms—linear matrix vs non-linear thin-plate splines</figcaption>
</figure>

## 7.2 LUT Mathematics: The Inverse Problem
{: #section-7-2}

A common request: "We applied the wrong LUT on set. Can you just invert it?"

Mathematically, yes. Practically, it's a minefield.

### The Jitter Problem

A <mark>3D LUT</mark> is a lattice of points (e.g., <mark>$33 \times 33 \times 33$</mark>). When you apply it, you are interpolating between these points.

When you try to <mark>Invert</mark> it, you are reversing the interpolation.

- **The Issue:** Small rounding errors (<mark>quantization</mark>) in the forward LUT get magnified in the inverse LUT.
- **The Result:** <mark>Jitter</mark>. The inverse LUT often introduces high-frequency noise, especially in gradients. A smooth sky becomes a blocky, noisy mess.

### Solutions

1. **<mark>Tetrahedral Interpolation</mark>:** Always use tetrahedral (not trilinear) interpolation when applying LUTs to minimize the initial error.
1. **Geometric Smoothing:** In Python (<mark>colour-science</mark> library), we can use geometric optimization to smooth the inverse lattice, sacrificing a tiny bit of accuracy for a much cleaner, noise-free result.

> **Critical Warning:** Never blindly invert a LUT without testing on a gradient ramp. The <mark>inverse jitter</mark> can destroy smooth tonal transitions in skies, skin, and shadows.

<figure class="diagram-placeholder">
  <div class="diagram-container">
    <div class="placeholder-text">
      {% include colorimetry-figure-in-development.html %}
    </div>
  </div>
  <figcaption>Figure 7.2: LUT inversion jitter—why blindly inverting LUTs breaks gradients</figcaption>
</figure>

## 7.3 Security: What Image Transforms Cannot Do
{: #section-7-3}

Pixel shuffling, a reversible DCTL, or a password delivered with a viewing transform can obscure an image, but none of those mechanisms is encryption. Anyone who receives the transform and its inputs can reproduce the reversal.

That distinction matters for dailies: a look should be treated as a look, not as a security boundary. This series will not ship a “visual encryption” demo because it would imply protection that client-side image obfuscation cannot provide.

### What belongs in a production security plan

- **Encrypted storage and transfer:** use approved systems with encryption in transit and at rest, plus access revocation and audit trails.
- **Least-privilege access:** distribute only the media, proxy resolution, and permissions a collaborator needs.
- **Forensic watermarking:** use approved visible or invisible watermarking when accountability matters.
- **Vendor review:** coordinate security requirements with production, post, and the platform provider rather than relying on a grade-side workaround.

> **Practical rule:** if a player can decode the media without a trusted key-management system, treat the protection as presentation-layer obfuscation rather than confidentiality.

  <div class="module-conclusion">
## Conclusion: The Biology, Physics, and Math of Color

We have traveled from the rods and cones of the human eye, through the spectral locus of <mark>CIE 1931</mark>, down the logarithmic curves of film emulation, and finally into the raw code of the GPU.

Color is not just art. It is a <mark>biological hallucination</mark> constrained by physics and managed by math.

As a DIT or Colorist, your job is to be the translator. You translate the DoP's emotion into the sensor's data, and the sensor's data into the audience's experience.

> **Class dismissed.**

*Thank you for completing the Modern Color Science for Motion Picture Production series.*

  </div>

## References & Further Reading
- Bookstein, F.L. (1989). "Principal Warps: Thin-Plate Splines and the Decomposition of Deformations." *IEEE Transactions on Pattern Analysis and Machine Intelligence*, 11(6), 567-585.
- Mansencal, T. et al. (2019). *Colour Science for Python*. Available at: <a href="https://github.com/colour-science/colour" target="_blank" rel="noopener noreferrer">github.com/colour-science/colour</a>
- Malvar, H.S., He, L.W., & Cutler, R. (2004). "High-Quality Linear Interpolation for Demosaicing of Bayer-Patterned Color Images." *IEEE ICASSP*, 3, 485-488.
- Kasson, J.M. & Plouffe, W. (1992). "An Analysis of Selected Computer Interchange Color Spaces." *ACM Transactions on Graphics*, 11(4), 373-405.
- OpenColorIO Project. *OCIO Configurations and LUT Formats*. Available at: <a href="https://opencolorio.org" target="_blank" rel="noopener noreferrer">opencolorio.org</a>
