---
title: "Module 4: ACES & Modern Color Management"
series: colorimetry
module_number: 4
slug: module-4
permalink: /notes/colorimetry/module-4/
date: 2025-12-10
description: "ACES architecture, AP0/AP1 working spaces, gamut compression, and practical workflows."
math: true
colorimetry_interactive: true
---

<header class="module-header">
  <div class="module-meta">
    <span class="module-series-badge">Colorimetry</span>
    <span class="module-number-badge">Module 4 of 7</span>
  </div>
  <h1>ACES & Modern Color Management</h1>
  <div class="module-header-meta">
    <span class="module-date">December 2025</span>
  </div>
</header>

<article class="module-content">

  <div class="module-intro">
    <p class="lead-paragraph">
      "A file format is not a workflow. ACES is a workflow."
    </p>
    <p>
      In Module 3, we discussed the chaos of "The Pipeline"—log curves, gamma shifts, and the struggle to fit reality into a monitor.
    </p>
    <p>
      The <mark>Academy Color Encoding System (ACES)</mark> was built to end that chaos. It is not just a file format; it is a rigid architecture designed to unify every camera, monitor, and VFX tool into a single mathematical language.
    </p>
    <p>
      But ACES is not magic. It has flaws, artifacts, and confusing terminology. This module breaks down the architecture and the "Blue Light" monsters that hide inside it.
    </p>
  </div>

  <nav class="module-toc" aria-label="Table of contents">
    <h2 class="module-toc-title">In This Module</h2>
    <ul>
      <li><a href="#section-4-1">4.1 The Architecture</a></li>
      <li><a href="#section-4-2">4.2 The Gamut Problem (Advanced ACES)</a></li>
      <li><a href="#section-4-3">4.3 Practical ACES Workflows</a></li>
    </ul>
  </nav>

  <section id="section-4-1" class="content-section">
    <h2>4.1 The Architecture: IDT, AP0, and AP1</h2>

    <p>
      The core philosophy of ACES is <mark>Input Independence</mark>. It shouldn't matter if you shot on an ARRI Alexa, a RED V-Raptor, or an iPhone. Once the footage enters the pipeline, it becomes "ACES Data."
    </p>

    <h3>The Input Device Transform (IDT)</h3>

    <p>
      This is the bouncer at the door. The <mark>IDT</mark> (or "Input Transform") takes the camera's proprietary format (e.g., <mark>ARRI LogC3 / ARRI Wide Gamut 3</mark>) and mathematically un-twists it into the standard ACES container.
    </p>

    <ul>
      <li><strong>Goal:</strong> Linearize the light and map the camera's unique primaries to ACES primaries.</li>
    </ul>

    <h3>The Two Spaces: AP0 vs. AP1</h3>

    <p>
      This is the #1 point of confusion. ACES has two sets of primaries (Gamuts).
    </p>

    <h4>1. ACES 2065-1 (AP0 Primaries)</h4>

    <ul>
      <li><strong>The "Archive" Space.</strong></li>
      <li><strong>Size:</strong> Massive. It encompasses the entire <mark>CIE Spectral Locus</mark>. It includes colors that humans can see but no screen can show, and even "imaginary" colors that don't exist.</li>
      <li><strong>Use Case:</strong> Storage, interchange, and archival (<mark>EXR</mark> files). It is usually not the preferred working space for grading or rendering.</li>
      <li><strong>Why?</strong> It is future-proof. If we invent a laser display in 2050 that can show pure spectral cyan, your AP0 file already contains that data.</li>
    </ul>

    <h4>2. ACEScg / ACEScct (AP1 Primaries)</h4>

    <ul>
      <li><strong>The "Working" Space.</strong></li>
      <li><strong>Size:</strong> Smaller than AP0, but still larger than <mark>Rec.2020</mark>.</li>
      <li><strong>Use Case:</strong> Grading, CGI Rendering, Compositing.</li>
      <li><strong>Why?</strong> AP0 is too big.
        <ul>
          <li><strong>Math Issue:</strong> The very wide AP0 primaries can produce unintuitive channel values during creative operations.</li>
          <li><strong>CGI Issue:</strong> Intermediate RGB components can become negative in a wide or imaginary-primary coordinate system. That is a coordinate-system result, not negative physical light.</li>
          <li><strong>Working Choice:</strong> <mark>AP1</mark> is smaller and closer to common production gamuts, which makes it a practical working space for many ACES tools.</li>
        </ul>
      </li>
    </ul>

    <blockquote>
      <strong>Practical convention:</strong> archive or interchange in <mark>AP0</mark> when the pipeline calls for it; use an appropriate working space such as <mark>AP1</mark> for the actual creative operation.
    </blockquote>

    <h3>The Mathematics: Primaries and Matrices</h3>

    <p>
      Let's make this concrete. Here are the actual CIE xy chromaticity coordinates for ACES primaries:
    </p>

    <p><strong>ACES 2065-1 (AP0) Primaries:</strong></p>

    <table style="margin: 1em 0; border-collapse: collapse;">
      <tr style="border-bottom: 2px solid var(--color-border);">
        <th style="padding: 0.5em; text-align: left;">Primary</th>
        <th style="padding: 0.5em; text-align: right;">x</th>
        <th style="padding: 0.5em; text-align: right;">y</th>
      </tr>
      <tr>
        <td style="padding: 0.5em;">Red</td>
        <td style="padding: 0.5em; text-align: right;">0.7347</td>
        <td style="padding: 0.5em; text-align: right;">0.2653</td>
      </tr>
      <tr>
        <td style="padding: 0.5em;">Green</td>
        <td style="padding: 0.5em; text-align: right;">0.0000</td>
        <td style="padding: 0.5em; text-align: right;">1.0000</td>
      </tr>
      <tr>
        <td style="padding: 0.5em;">Blue</td>
        <td style="padding: 0.5em; text-align: right;">0.0001</td>
        <td style="padding: 0.5em; text-align: right;">-0.0770</td>
      </tr>
      <tr style="border-top: 1px solid var(--color-border);">
        <td style="padding: 0.5em;">White (D60)</td>
        <td style="padding: 0.5em; text-align: right;">0.32168</td>
        <td style="padding: 0.5em; text-align: right;">0.33767</td>
      </tr>
    </table>

    <p>
      Notice the Green and Blue primaries have <mark>y values outside 0-1</mark>. These are imaginary primaries—they cannot be created by physical lights.
    </p>

    <p><strong>ACEScg (AP1) Primaries:</strong></p>

    <table style="margin: 1em 0; border-collapse: collapse;">
      <tr style="border-bottom: 2px solid var(--color-border);">
        <th style="padding: 0.5em; text-align: left;">Primary</th>
        <th style="padding: 0.5em; text-align: right;">x</th>
        <th style="padding: 0.5em; text-align: right;">y</th>
      </tr>
      <tr>
        <td style="padding: 0.5em;">Red</td>
        <td style="padding: 0.5em; text-align: right;">0.713</td>
        <td style="padding: 0.5em; text-align: right;">0.293</td>
      </tr>
      <tr>
        <td style="padding: 0.5em;">Green</td>
        <td style="padding: 0.5em; text-align: right;">0.165</td>
        <td style="padding: 0.5em; text-align: right;">0.830</td>
      </tr>
      <tr>
        <td style="padding: 0.5em;">Blue</td>
        <td style="padding: 0.5em; text-align: right;">0.128</td>
        <td style="padding: 0.5em; text-align: right;">0.044</td>
      </tr>
      <tr style="border-top: 1px solid var(--color-border);">
        <td style="padding: 0.5em;">White (D60)</td>
        <td style="padding: 0.5em; text-align: right;">0.32168</td>
        <td style="padding: 0.5em; text-align: right;">0.33767</td>
      </tr>
    </table>

    <p>
      All AP1 values are within the spectral locus—these are real primaries. This is why AP1 is used for rendering and grading.
    </p>

    <p><strong>Example: ARRI Alexa IDT (Conceptual):</strong></p>

    <p>
      An IDT performs two operations: (1) Decode the log curve (LogC3 → Linear), (2) Transform camera primaries to ACES AP0. The second step uses a 3×3 matrix:
    </p>

    $$
    \begin{bmatrix}
    R_{\text{ACES}} \\
    G_{\text{ACES}} \\
    B_{\text{ACES}}
    \end{bmatrix}
    =
    \begin{bmatrix}
    0.680206 & 0.236137 & 0.083657 \\
    0.035735 & 0.950071 & 0.014194 \\
    0.000000 & 0.002932 & 0.997068
    \end{bmatrix}
    \begin{bmatrix}
    R_{\text{camera}} \\
    G_{\text{camera}} \\
    B_{\text{camera}}
    \end{bmatrix}
    $$

    <p>
      <em>(Note: Actual IDTs include chromatic adaptation from D65 to D60, and LogC3 decoding. This matrix is simplified for clarity.)</em>
    </p>

    <blockquote>
      <strong>Critical Understanding:</strong> An IDT is NOT just a LUT. It's a mathematical transform (matrix + curve + white point adaptation) specific to each camera model. This is why you need the correct IDT for your camera—guessing creates color shifts.
    </blockquote>

    <figure class="colorimetry-widget" data-colorimetry-widget="gamut-coordinates" data-locus-url="{{ '/assets/data/cie-1931-2deg-5nm.json' | relative_url }}" aria-labelledby="gamut-coordinates-title">
      <p class="colorimetry-widget__eyebrow">Interactive study</p>
      <h4 class="colorimetry-widget__title" id="gamut-coordinates-title">Primary-coordinate explorer</h4>
      <p class="colorimetry-widget__note">Compare named primary triangles against the CIE 1931 2° spectral locus. Move through wavelength to inspect the official chromaticity coordinates.</p>
      <div class="colorimetry-widget__canvas">
        <svg data-gamut-svg role="img" aria-labelledby="gamut-coordinates-svg-title gamut-coordinates-svg-description"></svg>
      </div>
      <div class="colorimetry-widget__controls">
        <label class="colorimetry-widget__control" for="locus-wavelength">
          <span>Wavelength</span>
          <output class="colorimetry-widget__output" id="locus-wavelength-output" data-locus-wavelength-output></output>
          <input id="locus-wavelength" data-locus-wavelength type="range" min="360" max="700" step="5" value="555">
        </label>
        <fieldset class="colorimetry-widget__checkboxes">
          <legend class="visually-hidden">Show gamut primary coordinates</legend>
          <label><input data-gamut-toggle type="checkbox" value="rec709" checked>Rec.709</label>
          <label><input data-gamut-toggle type="checkbox" value="rec2020">Rec.2020</label>
          <label><input data-gamut-toggle type="checkbox" value="ap1" checked>ACES AP1</label>
          <label><input data-gamut-toggle type="checkbox" value="ap0">ACES AP0</label>
        </fieldset>
      </div>
      <p class="colorimetry-widget__readout" data-gamut-readout role="status" aria-live="polite"></p>
      <noscript><p class="colorimetry-widget__fallback">JavaScript is off. The AP0 and AP1 coordinate tables above remain the source for this comparison.</p></noscript>
      <figcaption>Figure 4.1: Primary-coordinate comparison. The spectral locus uses the <a href="https://doi.org/10.25039/CIE.DS.mifmy4x4">CIE 1931 2° dataset</a>, sampled here at 5 nm; AP0/AP1 values follow the tables above.</figcaption>
    </figure>

  </section>

  <section id="section-4-2" class="content-section">
    <h2>4.2 The Gamut Problem (The "Blue Light" Artifact)</h2>

    <p>
      ACES is mathematically pure, but cameras are messy.
    </p>

    <h3>The Issue</h3>

    <p>
      Digital sensors often see high-intensity narrow-band light (like Police Sirens or cheap Blue LEDs) as "more saturated" than the ACES AP1 gamut allows.
    </p>

    <p>
      When the IDT tries to map this intense Blue into ACES, the math breaks.
    </p>

    <ul>
      <li>To keep the "brightness" correct while pushing the "saturation" out, the math forces the Red and Green channels into <mark>Negative Values</mark>.</li>
      <li><strong>Visual Artifact:</strong> The blue light turns into a solid, clipped block of magenta/purple artifacts. It looks like "digital broken glass."</li>
    </ul>

    <h3>The Fixes</h3>

    <h4>1. LMT (Look Modification Transform)</h4>

    <p>
      In ACES 1.0, we used a "Blue Light Artifact Fix" <mark>LMT</mark>. It was a band-aid that globally desaturated blue highlights.
    </p>

    <h4>2. RGC (Reference Gamut Compression)</h4>

    <p>
      Introduced in <mark>ACES 1.3</mark>.
    </p>

    <ul>
      <li><strong>Algorithm:</strong> It analyzes pixels. If a pixel is "Out of Gamut" (Negative values), it calculates the distance from the neutral axis and softly compresses it back into the AP1 "Zone of Trust."</li>
      <li><strong>Result:</strong> It "heals" the broken pixels without affecting the rest of the image.</li>
    </ul>

    <h3>ACES 2</h3>

    <p>
      <mark>ACES 2</mark> revises the output-transform approach with the goal of more consistent rendering across SDR and HDR display targets. Check the current Academy documentation before choosing a production implementation.
    </p>

    <ul>
      <li><strong>Unified tone scale:</strong> The updated output transforms aim for more consistent perceptual behavior across display targets.</li>
      <li><strong>Gamut handling:</strong> Treat the exact tool and transform version as part of the show-specific pipeline, not as a generic fix for every saturated-light issue.</li>
    </ul>

    <figure class="diagram-placeholder">
      <div class="diagram-container">
        <div class="placeholder-text">
          {% include colorimetry-figure-in-development.html %}
        </div>
      </div>
      <figcaption>Figure 4.2: Blue light artifact demonstration—gamut compression healing negative values</figcaption>
    </figure>

  </section>

  <section id="section-4-3" class="content-section">
    <h2>4.3 Practical ACES Workflows</h2>

    <h3>Blender & ACES (OCIO)</h3>

    <p>
      Blender (Cycles/Eevee) is a <mark>Scene-Referred</mark> renderer. It wants <mark>Linear</mark> data.
    </p>

    <p>
      While Blender 4.0+ introduced <mark>AgX</mark> (a fantastic view transform), it is not "ACES."
    </p>

    <h4>The Professional Setup (OCIO):</h4>

    <p>
      To make Blender speak ACES, you must bypass its internal color management using <mark>OpenColorIO (OCIO)</mark>.
    </p>

    <ol>
      <li>Download the <mark>ACES OCIO Config</mark> (e.g., ACES 1.3 Studio).</li>
      <li>Set your Environment Variable (<code>OCIO = /path/to/config.ocio</code>).</li>
      <li><strong>Input:</strong> Load textures as <mark>Utility - sRGB - Texture</mark> (for JPGs) or <mark>ACEScg</mark> (for EXRs).</li>
      <li><strong>Render:</strong> Render in <mark>ACEScg</mark>.</li>
      <li><strong>Output:</strong> Save as <mark>EXR (Multilayer)</mark>. Do not bake the <mark>ODT</mark>.
        <ul>
          <li><strong>Why?</strong> You want the Compositor (Nuke/Resolve) to handle the final conversion to display.</li>
        </ul>
      </li>
    </ol>

    <h3>AMF (ACES Metadata File)</h3>

    <p>
      The biggest weakness of ACES was tracking. "I applied a cool vintage look (LMT) on set. How does the VFX house know which LMT I used?"
    </p>

    <p>
      <mark>AMF</mark> is the sidecar XML file that solves this. It contains the "Recipe":
    </p>

    <ol>
      <li><strong>System Version:</strong> (e.g., ACES 1.3)</li>
      <li><strong>Input Transform:</strong> (e.g., Sony Venice 2)</li>
      <li><strong>Look Transform (LMT):</strong> (e.g., Vintage_Kodak_Emulation.clf)</li>
      <li><strong>Output Transform:</strong> (e.g., <mark>Rec.709 100 nits</mark>)</li>
    </ol>

    <p>
      By passing the AMF along with the raw footage, the DIT ensures the VFX artist sees exactly what the DoP saw on the monitor.
    </p>

    <h3>ACES vs. LUTs</h3>

    <p>
      Why not just use a LUT?
    </p>

    <ul>
      <li><strong>LUTs are Display-Referred:</strong> They bake the look and the display into one destructive layer. You cannot easily convert a <mark>Rec.709</mark> LUT to HDR.</li>
      <li><strong>ACES is Scene-Referred:</strong> The "Look" is separate from the "Display." You can grade once, then swap the <mark>ODT</mark> to export Rec.709, <mark>DCI-P3</mark>, and <mark>Dolby Vision PQ</mark> from the same timeline without re-grading.</li>
    </ul>

    <figure class="diagram-placeholder">
      <div class="diagram-container">
        <div class="placeholder-text">
          {% include colorimetry-figure-in-development.html %}
        </div>
      </div>
      <figcaption>Figure 4.3: ACES workflow architecture—from camera to display with separation of concerns</figcaption>
    </figure>

    <p>
      <strong>Next Module:</strong> Now that we have managed the color pipeline, we need to understand the screen itself. It's time for <mark>HDR</mark>, <mark>Dolby Vision</mark>, and the Apple XDR ecosystem.
    </p>

  </section>

  <section class="module-references">
    <h2>References & Further Reading</h2>
    <ul>
      <li>SMPTE ST 2065-1:2021. <em>Academy Color Encoding Specification (ACES)</em>.</li>
      <li>Duiker, H.P. (2015). <em>ACES Version 1.0 User Experience</em>. Academy of Motion Picture Arts and Sciences.</li>
      <li>Mansencal, T. et al. (2020). "OpenColorIO: A Color Management Framework for Visual Effects and Animation." <em>ACM Transactions on Graphics</em>, 39(4), Article 135.</li>
      <li>Sobotka, T. & Haarm, P. (2016). <em>ACES Output Transforms</em>. Academy ACES Technical Documentation.</li>
      <li>Blender Foundation (2023). <em>AgX Display Transform Documentation</em>. Available at: docs.blender.org</li>
      <li>Academy ACES Central: <a href="https://acescentral.com" target="_blank" rel="noopener noreferrer">acescentral.com</a> (Official forums and technical resources)</li>
    </ul>
  </section>

</article>
