---
title: "Module 4: ACES & Modern Color Management"
series: colorimetry
module_number: 4
slug: module-4
permalink: /misc/colorimetry/module-4/
date: 2025-12-10
description: "ACES architecture, AP0/AP1 working spaces, gamut compression, and practical workflows."
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
      <li><strong>Use Case:</strong> Storage, Interchange, and Archival (<mark>EXR</mark> files). You never grade or render in <mark>AP0</mark>.</li>
      <li><strong>Why?</strong> It is future-proof. If we invent a laser display in 2050 that can show pure spectral cyan, your AP0 file already contains that data.</li>
    </ul>

    <h4>2. ACEScg / ACEScct (AP1 Primaries)</h4>

    <ul>
      <li><strong>The "Working" Space.</strong></li>
      <li><strong>Size:</strong> Smaller than AP0, but still larger than <mark>Rec.2020</mark>.</li>
      <li><strong>Use Case:</strong> Grading, CGI Rendering, Compositing.</li>
      <li><strong>Why?</strong> AP0 is too big.
        <ul>
          <li><strong>Math Issue:</strong> Calculating drag/lift/gamma operations in AP0 feels "weird" to colorists because the primaries are so far apart.</li>
          <li><strong>CGI Issue:</strong> Calculating light bounces in AP0 can result in <mark>negative energy</mark> (physically impossible) because the primaries are imaginary.</li>
          <li><strong>Solution:</strong> <mark>AP1</mark> uses "Real" primaries (closer to Rec.2020) that make grading knobs feel responsive and CGI light calculations stable.</li>
        </ul>
      </li>
    </ul>

    <blockquote>
      <strong>The Rule:</strong> Save files in <mark>AP0</mark>. Work on pixels in <mark>AP1</mark>.
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

    <figure class="diagram-placeholder">
      <div class="diagram-container">
        <div class="placeholder-text">
          [Future Interactive: AP0 vs AP1 Gamut Comparison - CIE 1931 diagram showing AP0 (spectral locus boundary), AP1, Rec.2020, DCI-P3, and Rec.709 gamut triangles with toggles]
        </div>
      </div>
      <figcaption>Figure 4.1: ACES gamut comparison—AP0 vs AP1 on the CIE 1931 chromaticity diagram</figcaption>
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

    <h3>ACES 2.0 (The Future)</h3>

    <p>
      <mark>ACES 2.0</mark> (released 2024/2025) is a massive overhaul aimed at the "SDR vs. HDR" problem.
    </p>

    <ul>
      <li><strong>Unified Tone Scale:</strong> In ACES 1.x, the SDR and HDR transforms looked different. Grading for theatrical (48 nits) often felt completely different from Home HDR (1000 nits). ACES 2.0 aligns these looks perceptually.</li>
      <li><strong>Native Gamut Compression:</strong> Better handling of the "Blue Light" issues built directly into the transforms.</li>
    </ul>

    <figure class="diagram-placeholder">
      <div class="diagram-container">
        <div class="placeholder-text">
          [Future Interactive: Blue Light Artifact - Before/after comparison showing police siren LED with broken magenta artifacts (no RGC) vs clean blue gradient (with RGC), including pixel value inspection]
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
          [Future Interactive: ACES Pipeline Flowchart - Camera RAW → IDT → ACES2065-1 (AP0 Archive) → ACEScg (AP1 Working) → LMT (Look) → RRT+ODT (Display) with branching outputs for Rec.709/P3/HDR]
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
      <li>Academy ACES Central: <a href="https://acescentral.com" target="_blank">acescentral.com</a> (Official forums and technical resources)</li>
    </ul>
  </section>

</article>

<nav class="module-navigation" aria-label="Module navigation">
  <div class="module-nav-container">

    <a href="/misc/colorimetry/" class="module-nav-overview">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
      <span>Back to Overview</span>
    </a>

    <div class="module-nav-arrows">
      <a href="/misc/colorimetry/module-3/" class="module-nav-prev">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <span>Previous Module</span>
      </a>

      <a href="/misc/colorimetry/module-5/" class="module-nav-next">
        <span>Next Module</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </a>
    </div>
  </div>
</nav>
