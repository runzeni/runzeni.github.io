---
title: "Module 7: Computational Color & Advanced DIT Dev"
series: colorimetry
module_number: 7
slug: module-7
permalink: /misc/colorimetry/module-7/
date: 2025-12-10
description: "Working notes on color matching, LUT mathematics, and the boundary between image transforms and real security."
math: true
---

<header class="module-header">
  <div class="module-meta">
    <span class="module-series-badge">Colorimetry</span>
    <span class="module-number-badge">Module 7 of 7</span>
  </div>
  <h1>Computational Color & Advanced DIT Dev</h1>
  <div class="module-header-meta">
    <span class="module-date">December 2025</span>
  </div>
</header>

<article class="module-content">

  <div class="module-intro">
    <p class="lead-paragraph">
      "When the tools break, you have to build your own."
    </p>
    <p>
      Most DITs are operators. They know which buttons to push.
    </p>
    <p>
      This module is for the engineers. We are going to look at the raw mathematics that power the color engine, and how you can exploit them to solve problems that off-the-shelf software cannot.
    </p>
    <p>
      We will cover <mark>Color Matching Algorithms</mark>, <mark>The Danger of Inverse LUTs</mark>, and the boundary between image transforms and real security.
    </p>
  </div>

  <nav class="module-toc" aria-label="Table of contents">
    <h2 class="module-toc-title">In This Module</h2>
    <ul>
      <li><a href="#section-7-1">7.1 Advanced Color Matching</a></li>
      <li><a href="#section-7-2">7.2 LUT Mathematics</a></li>
      <li><a href="#section-7-3">7.3 Security: What Image Transforms Cannot Do</a></li>
    </ul>
  </nav>

  <section id="section-7-1" class="content-section">
    <h2>7.1 Advanced Color Matching</h2>

    <p>
      How do you make a Canon look like an ARRI? Or how do you match two specific lenses? You need a <mark>Color Transformation</mark>.
    </p>

    <h3>Level 1: The 3×3 Matrix (Linear)</h3>

    <p>
      The standard tool for color matching is the <mark>3×3 Matrix</mark>.
    </p>

    <ul>
      <li><strong>The Math:</strong> It multiplies the RGB values of one camera to approximate the other.</li>
      <li><strong>The Formula:</strong></li>
    </ul>

    $$
    \begin{bmatrix} R_{\text{out}} \\ G_{\text{out}} \\ B_{\text{out}} \end{bmatrix} =
    \begin{bmatrix} a & b & c \\ d & e & f \\ g & h & i \end{bmatrix} \times
    \begin{bmatrix} R_{\text{in}} \\ G_{\text{in}} \\ B_{\text{in}} \end{bmatrix}
    $$

    <ul>
      <li><strong>Pros:</strong> Simple, fast, fully invertible.</li>
      <li><strong>Cons:</strong> It is <mark>linear</mark>. If the Canon sensor has a non-linear twist in the shadows (hue shift), a matrix cannot fix it. It rotates the entire color cube at once.</li>
    </ul>

    <h3>Level 2: Thin-Plate Splines (Non-Linear)</h3>

    <p>
      When a matrix fails, we use <mark>Thin-Plate Splines (TPS)</mark> or <mark>Radial Basis Functions (RBF)</mark>.
    </p>

    <ul>
      <li><strong>The Concept:</strong> Imagine printing the color space on a rubber sheet. You pin down specific colors (e.g., "This Skin Tone must match exactly," "This Coke Can Red must match exactly").</li>
      <li><strong>The Warp:</strong> The algorithm bends the rubber sheet to align the pins, smoothly warping the colors in between.</li>
      <li><strong>Application:</strong> These methods can support highly specific local corrections, but a production-grade match still depends on measured targets, illuminant control, and validation footage.</li>
    </ul>

    <figure class="diagram-placeholder">
      <div class="diagram-container">
        <div class="placeholder-text">
          {% include colorimetry-figure-in-development.html %}
        </div>
      </div>
      <figcaption>Figure 7.1: Color matching algorithms—linear matrix vs non-linear thin-plate splines</figcaption>
    </figure>

  </section>

  <section id="section-7-2" class="content-section">
    <h2>7.2 LUT Mathematics: The Inverse Problem</h2>

    <p>
      A common request: "We applied the wrong LUT on set. Can you just invert it?"
    </p>

    <p>
      Mathematically, yes. Practically, it's a minefield.
    </p>

    <h3>The Jitter Problem</h3>

    <p>
      A <mark>3D LUT</mark> is a lattice of points (e.g., <mark>$33 \times 33 \times 33$</mark>). When you apply it, you are interpolating between these points.
    </p>

    <p>
      When you try to <mark>Invert</mark> it, you are reversing the interpolation.
    </p>

    <ul>
      <li><strong>The Issue:</strong> Small rounding errors (<mark>quantization</mark>) in the forward LUT get magnified in the inverse LUT.</li>
      <li><strong>The Result:</strong> <mark>Jitter</mark>. The inverse LUT often introduces high-frequency noise, especially in gradients. A smooth sky becomes a blocky, noisy mess.</li>
    </ul>

    <h3>Solutions</h3>

    <ol>
      <li><strong><mark>Tetrahedral Interpolation</mark>:</strong> Always use tetrahedral (not trilinear) interpolation when applying LUTs to minimize the initial error.</li>
      <li><strong>Geometric Smoothing:</strong> In Python (<mark>colour-science</mark> library), we can use geometric optimization to smooth the inverse lattice, sacrificing a tiny bit of accuracy for a much cleaner, noise-free result.</li>
    </ol>

    <blockquote>
      <strong>Critical Warning:</strong> Never blindly invert a LUT without testing on a gradient ramp. The <mark>inverse jitter</mark> can destroy smooth tonal transitions in skies, skin, and shadows.
    </blockquote>

    <figure class="diagram-placeholder">
      <div class="diagram-container">
        <div class="placeholder-text">
          {% include colorimetry-figure-in-development.html %}
        </div>
      </div>
      <figcaption>Figure 7.2: LUT inversion jitter—why blindly inverting LUTs breaks gradients</figcaption>
    </figure>

  </section>

  <section id="section-7-3" class="content-section">
    <h2>7.3 Security: What Image Transforms Cannot Do</h2>

    <p>
      Pixel shuffling, a reversible DCTL, or a password delivered with a viewing transform can obscure an image, but none of those mechanisms is encryption. Anyone who receives the transform and its inputs can reproduce the reversal.
    </p>

    <p>
      That distinction matters for dailies: a look should be treated as a look, not as a security boundary. This series will not ship a “visual encryption” demo because it would imply protection that client-side image obfuscation cannot provide.
    </p>

    <h3>What belongs in a production security plan</h3>

    <ul>
      <li><strong>Encrypted storage and transfer:</strong> use approved systems with encryption in transit and at rest, plus access revocation and audit trails.</li>
      <li><strong>Least-privilege access:</strong> distribute only the media, proxy resolution, and permissions a collaborator needs.</li>
      <li><strong>Forensic watermarking:</strong> use approved visible or invisible watermarking when accountability matters.</li>
      <li><strong>Vendor review:</strong> coordinate security requirements with production, post, and the platform provider rather than relying on a grade-side workaround.</li>
    </ul>

    <blockquote>
      <strong>Practical rule:</strong> if a player can decode the media without a trusted key-management system, treat the protection as presentation-layer obfuscation rather than confidentiality.
    </blockquote>
  </section>

  <div class="module-conclusion">
    <h2>Conclusion: The Biology, Physics, and Math of Color</h2>

    <p>
      We have traveled from the rods and cones of the human eye, through the spectral locus of <mark>CIE 1931</mark>, down the logarithmic curves of film emulation, and finally into the raw code of the GPU.
    </p>

    <p>
      Color is not just art. It is a <mark>biological hallucination</mark> constrained by physics and managed by math.
    </p>

    <p>
      As a DIT or Colorist, your job is to be the translator. You translate the DoP's emotion into the sensor's data, and the sensor's data into the audience's experience.
    </p>

    <blockquote>
      <strong>Class dismissed.</strong>
    </blockquote>

    <p>
      <em>Thank you for completing the Modern Color Science for Motion Picture Production series.</em>
    </p>
  </div>

  <section class="module-references">
    <h2>References & Further Reading</h2>
    <ul>
      <li>Bookstein, F.L. (1989). "Principal Warps: Thin-Plate Splines and the Decomposition of Deformations." <em>IEEE Transactions on Pattern Analysis and Machine Intelligence</em>, 11(6), 567-585.</li>
      <li>Mansencal, T. et al. (2019). <em>Colour Science for Python</em>. Available at: <a href="https://github.com/colour-science/colour" target="_blank">github.com/colour-science/colour</a></li>
      <li>Malvar, H.S., He, L.W., & Cutler, R. (2004). "High-Quality Linear Interpolation for Demosaicing of Bayer-Patterned Color Images." <em>IEEE ICASSP</em>, 3, 485-488.</li>
      <li>Kasson, J.M. & Plouffe, W. (1992). "An Analysis of Selected Computer Interchange Color Spaces." <em>ACM Transactions on Graphics</em>, 11(4), 373-405.</li>
      <li>OpenColorIO Project. <em>OCIO Configurations and LUT Formats</em>. Available at: <a href="https://opencolorio.org" target="_blank">opencolorio.org</a></li>
    </ul>
  </section>

</article>
