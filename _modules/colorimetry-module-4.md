---
title: "Module 4: ACES & Modern Color Management"
short_title: "ACES & Modern Color Management"
series: colorimetry
module_number: 4
slug: module-4
permalink: /notes/colorimetry/module-4/
date: 2025-12-10
description: "ACES architecture, AP0/AP1 working spaces, gamut compression, and practical workflows."
math: true
colorimetry_interactive: true
---

"A file format is not a workflow. ACES is a workflow."

In Module 3, we discussed the chaos of "The Pipeline"—log curves, gamma shifts, and the struggle to fit reality into a monitor.

The <mark>Academy Color Encoding System (ACES)</mark> was built to end that chaos. It is not just a file format; it is a rigid architecture designed to unify every camera, monitor, and VFX tool into a single mathematical language.

But ACES is not magic. It has flaws, artifacts, and confusing terminology. This module breaks down the architecture and the "Blue Light" monsters that hide inside it.

## 4.1 The Architecture: IDT, AP0, and AP1
{: #section-4-1}

The core philosophy of ACES is <mark>Input Independence</mark>. It shouldn't matter if you shot on an ARRI Alexa, a RED V-Raptor, or an iPhone. Once the footage enters the pipeline, it becomes "ACES Data."

### The Input Device Transform (IDT)

This is the bouncer at the door. The <mark>IDT</mark> (or "Input Transform") takes the camera's proprietary format (e.g., <mark>ARRI LogC3 / ARRI Wide Gamut 3</mark>) and mathematically un-twists it into the standard ACES container.

- **Goal:** Linearize the light and map the camera's unique primaries to ACES primaries.

### The Two Spaces: AP0 vs. AP1

This is the #1 point of confusion. ACES has two sets of primaries (Gamuts).

#### 1. ACES 2065-1 (AP0 Primaries)

- **The "Archive" Space.**
- **Size:** Massive. It encompasses the entire <mark>CIE Spectral Locus</mark>. It includes colors that humans can see but no screen can show, and even "imaginary" colors that don't exist.
- **Use Case:** Storage, interchange, and archival (<mark>EXR</mark> files). It is usually not the preferred working space for grading or rendering.
- **Why?** It is future-proof. If we invent a laser display in 2050 that can show pure spectral cyan, your AP0 file already contains that data.

#### 2. ACEScg / ACEScct (AP1 Primaries)

- **The "Working" Space.**
- **Size:** Smaller than AP0, but still larger than <mark>Rec.2020</mark>.
- **Use Case:** Grading, CGI Rendering, Compositing.
- **Why?** AP0 is too big.
  - **Math Issue:** The very wide AP0 primaries can produce unintuitive channel values during creative operations.
  - **CGI Issue:** Intermediate RGB components can become negative in a wide or imaginary-primary coordinate system. That is a coordinate-system result, not negative physical light.
  - **Working Choice:** <mark>AP1</mark> is smaller and closer to common production gamuts, which makes it a practical working space for many ACES tools.

> **Practical convention:** archive or interchange in <mark>AP0</mark> when the pipeline calls for it; use an appropriate working space such as <mark>AP1</mark> for the actual creative operation.

### The Mathematics: Primaries and Matrices

Let's make this concrete. Here are the actual CIE xy chromaticity coordinates for ACES primaries:

**ACES 2065-1 (AP0) Primaries:**

| Primary | x | y |
| --- | --- | --- |
| Red | 0.7347 | 0.2653 |
| Green | 0.0000 | 1.0000 |
| Blue | 0.0001 | -0.0770 |
| White (D60) | 0.32168 | 0.33767 |

Notice the Green and Blue primaries have <mark>y values outside 0-1</mark>. These are imaginary primaries—they cannot be created by physical lights.

**ACEScg (AP1) Primaries:**

| Primary | x | y |
| --- | --- | --- |
| Red | 0.713 | 0.293 |
| Green | 0.165 | 0.830 |
| Blue | 0.128 | 0.044 |
| White (D60) | 0.32168 | 0.33767 |

All AP1 values are within the spectral locus—these are real primaries. This is why AP1 is used for rendering and grading.

**Example: ARRI Alexa IDT (Conceptual):**

An IDT performs two operations: (1) Decode the log curve (LogC3 → Linear), (2) Transform camera primaries to ACES AP0. The second step uses a 3×3 matrix:

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

*(Note: Actual IDTs include chromatic adaptation from D65 to D60, and LogC3 decoding. This matrix is simplified for clarity.)*

> **Critical Understanding:** An IDT is NOT just a LUT. It's a mathematical transform (matrix + curve + white point adaptation) specific to each camera model. This is why you need the correct IDT for your camera—guessing creates color shifts.

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

## 4.2 The Gamut Problem (The "Blue Light" Artifact)
{: #section-4-2}

ACES is mathematically pure, but cameras are messy.

### The Issue

Digital sensors often see high-intensity narrow-band light (like Police Sirens or cheap Blue LEDs) as "more saturated" than the ACES AP1 gamut allows.

When the IDT tries to map this intense Blue into ACES, the math breaks.

- To keep the "brightness" correct while pushing the "saturation" out, the math forces the Red and Green channels into <mark>Negative Values</mark>.
- **Visual Artifact:** The blue light turns into a solid, clipped block of magenta/purple artifacts. It looks like "digital broken glass."

### The Fixes

#### 1. LMT (Look Modification Transform)

In ACES 1.0, we used a "Blue Light Artifact Fix" <mark>LMT</mark>. It was a band-aid that globally desaturated blue highlights.

#### 2. RGC (Reference Gamut Compression)

Introduced in <mark>ACES 1.3</mark>.

- **Algorithm:** It analyzes pixels. If a pixel is "Out of Gamut" (Negative values), it calculates the distance from the neutral axis and softly compresses it back into the AP1 "Zone of Trust."
- **Result:** It "heals" the broken pixels without affecting the rest of the image.

### ACES 2

<mark>ACES 2</mark> revises the output-transform approach with the goal of more consistent rendering across SDR and HDR display targets. Check the current Academy documentation before choosing a production implementation.

- **Unified tone scale:** The updated output transforms aim for more consistent perceptual behavior across display targets.
- **Gamut handling:** Treat the exact tool and transform version as part of the show-specific pipeline, not as a generic fix for every saturated-light issue.

<figure class="diagram-placeholder">
  <div class="diagram-container">
    <div class="placeholder-text">
      {% include colorimetry-figure-in-development.html %}
    </div>
  </div>
  <figcaption>Figure 4.2: Blue light artifact demonstration—gamut compression healing negative values</figcaption>
</figure>

## 4.3 Practical ACES Workflows
{: #section-4-3}

### Blender & ACES (OCIO)

Blender (Cycles/Eevee) is a <mark>Scene-Referred</mark> renderer. It wants <mark>Linear</mark> data.

While Blender 4.0+ introduced <mark>AgX</mark> (a fantastic view transform), it is not "ACES."

#### The Professional Setup (OCIO):

To make Blender speak ACES, you must bypass its internal color management using <mark>OpenColorIO (OCIO)</mark>.

1. Download the <mark>ACES OCIO Config</mark> (e.g., ACES 1.3 Studio).
1. Set your Environment Variable (<code>OCIO = /path/to/config.ocio</code>).
1. **Input:** Load textures as <mark>Utility - sRGB - Texture</mark> (for JPGs) or <mark>ACEScg</mark> (for EXRs).
1. **Render:** Render in <mark>ACEScg</mark>.
1. **Output:** Save as <mark>EXR (Multilayer)</mark>. Do not bake the <mark>ODT</mark>. - **Why?** You want the Compositor (Nuke/Resolve) to handle the final conversion to display.

### AMF (ACES Metadata File)

The biggest weakness of ACES was tracking. "I applied a cool vintage look (LMT) on set. How does the VFX house know which LMT I used?"

<mark>AMF</mark> is the sidecar XML file that solves this. It contains the "Recipe":

1. **System Version:** (e.g., ACES 1.3)
1. **Input Transform:** (e.g., Sony Venice 2)
1. **Look Transform (LMT):** (e.g., Vintage_Kodak_Emulation.clf)
1. **Output Transform:** (e.g., <mark>Rec.709 100 nits</mark>)

By passing the AMF along with the raw footage, the DIT ensures the VFX artist sees exactly what the DoP saw on the monitor.

### ACES vs. LUTs

Why not just use a LUT?

- **LUTs are Display-Referred:** They bake the look and the display into one destructive layer. You cannot easily convert a <mark>Rec.709</mark> LUT to HDR.
- **ACES is Scene-Referred:** The "Look" is separate from the "Display." You can grade once, then swap the <mark>ODT</mark> to export Rec.709, <mark>DCI-P3</mark>, and <mark>Dolby Vision PQ</mark> from the same timeline without re-grading.

<figure class="diagram-placeholder">
  <div class="diagram-container">
    <div class="placeholder-text">
      {% include colorimetry-figure-in-development.html %}
    </div>
  </div>
  <figcaption>Figure 4.3: ACES workflow architecture—from camera to display with separation of concerns</figcaption>
</figure>

**Next Module:** Now that we have managed the color pipeline, we need to understand the screen itself. It's time for <mark>HDR</mark>, <mark>Dolby Vision</mark>, and the Apple XDR ecosystem.

## References & Further Reading
- SMPTE ST 2065-1:2021. *Academy Color Encoding Specification (ACES)*.
- Duiker, H.P. (2015). *ACES Version 1.0 User Experience*. Academy of Motion Picture Arts and Sciences.
- Mansencal, T. et al. (2020). "OpenColorIO: A Color Management Framework for Visual Effects and Animation." *ACM Transactions on Graphics*, 39(4), Article 135.
- Sobotka, T. & Haarm, P. (2016). *ACES Output Transforms*. Academy ACES Technical Documentation.
- Blender Foundation (2023). *AgX Display Transform Documentation*. Available at: docs.blender.org
- Academy ACES Central: <a href="https://acescentral.com" target="_blank" rel="noopener noreferrer">acescentral.com</a> (Official forums and technical resources)
