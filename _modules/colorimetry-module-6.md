---
title: "Module 6: Camera Architectures & Case Studies"
short_title: "Camera Architectures & Case Studies"
series: colorimetry
module_number: 6
slug: module-6
permalink: /notes/colorimetry/module-6/
date: 2025-12-10
description: "ARRI's LogC pipeline, RED IPP2 vs ACES, and RAW demosaicing mechanics."
math: true
---

"A camera is just a sensor with an opinion."

We have spent five modules talking about universal standards (<mark>ACES</mark>, <mark>CIE XYZ</mark>). Now, let's talk about the proprietary "Secret Sauce" that manufacturers bake into their cameras.

Why does an <mark>ARRI Alexa</mark> look different from a <mark>RED V-Raptor</mark>? It's not just the sensor hardware; it's the math they wrap around it.

## 6.1 The ARRI Gold Standard
{: #section-6-1}

For over a decade, the <mark>ALEV III sensor</mark> (Alexa Classic through Mini LF) has been the benchmark for digital cinema. Why? Because ARRI prioritized <mark>Highlights</mark> over everything else.

### The LogC Curve (LogC3 vs. LogC4)

ARRI's encoding is designed to mimic film density.

- **LogC3:** The classic curve. It allocates a massive amount of data to the highlights (shoulder), ensuring that roll-off is gentle and desaturated.
- **LogC4** (Alexa 35): With the new <mark>ALEV IV sensor</mark> (17 stops), LogC3 ran out of room. <mark>LogC4</mark> is a new curve that pulls <mark>Middle Grey down to 32%</mark> (from 39%) to make room for 2.5 extra stops of highlight information.

**LogC3 Formula (ARRI Wide Gamut 3):**

$$
y = \begin{cases}
5.555556 \times x + 0.052272 & \text{if } x < 0.010591 \\
0.247190 \times \log_{10}(5.555556 \times x + 0.047996) + 0.385537 & \text{otherwise}
\end{cases}
$$

Where $x$ is scene linear exposure (normalized) and $y$ is the LogC3 code value (0-1). Middle Grey (18% reflectance, $x = 0.18$) maps to <mark>$y = 0.39$</mark>.

**LogC4 Formula (Alexa 35):**

$$
y = \begin{cases}
(x - 0.0011361) / 0.068512 & \text{if } x < 0.0059569 \\
0.27861 \times \log_{10}(x \times 10.6723 + 1) + 0.33122 & \text{otherwise}
\end{cases}
$$

Where Middle Grey ($x = 0.18$) maps to <mark>$y = 0.32$</mark>. This shift from 39% to 32% creates headroom for 2.5 additional stops in highlights while maintaining 10-bit precision.

> **Why Middle Grey Matters:** The position of Middle Grey determines how the 10-bit code values (0-1023) are distributed across the dynamic range. LogC3's 39% was optimal for 14 stops. LogC4's 32% accommodates 17 stops by "borrowing" code values from midtones and shadows—acceptable because modern sensors have lower noise.

### The "K1S1" Magic

The "Alexa Look" isn't just the Log curve; it's the <mark>Display Rendering Transform (DRT)</mark>.

The famous <mark>K1S1</mark> (and later the <mark>ARRI Rec.709</mark> LUT) applies a very specific, non-linear tone map.

- **Shoulder Desaturation:** As colors get brighter, ARRI's LUT aggressively desaturates them. A bright red taillight turns white/orange, not "digital red." This mimics how film emulsion runs out of dye.
- **Matrix Crosstalk:** The ARRI matrix allows colors to "bleed" into each other slightly, creating a dense, organic palette rather than a sterile, separated one.

<figure class="diagram-placeholder">
  <div class="diagram-container">
    <div class="placeholder-text">
      {% include colorimetry-figure-in-development.html %}
    </div>
  </div>
  <figcaption>Figure 6.1: ARRI LogC3 vs LogC4—expanding dynamic range through curve optimization</figcaption>
</figure>

## 6.2 The Color Wars
{: #section-6-2}

For years, camera manufacturers took different philosophical approaches to color science. ARRI favored <mark>Perceptual Pleasing</mark>, RED favored <mark>Mathematical Flexibility</mark>, and Sony/Canon positioned themselves somewhere in between.

### RED IPP2 (Image Processing Pipeline 2)

For years, RED was the "Wild West." You had <mark>DragonColor</mark>, <mark>DragonColor2</mark>, <mark>RedGamma3</mark>, <mark>RedGamma4</mark>... it was a mess.

Then came <mark>IPP2</mark>, which unified everything into a workflow remarkably similar to ACES.

#### The Separation of Church and State

IPP2 separates the Technical from the Creative.

1. **<mark>REDWideGamutRGB</mark>:** The container. It encompasses every color the sensor can see.
1. **<mark>Log3G10</mark>:** The curve. It defines Middle Grey and provides 10 stops of highlight headroom (hence "3G10" = 3 stops below, 10 above middle grey).

**Log3G10 Formula (RED IPP2):**

$$
y = \begin{cases}
15.1927 \times x & \text{if } x < -0.01 \\
0.224282 \times \log_{10}(x + 0.01) + 0.444666 & \text{otherwise}
\end{cases}
$$

Where $x$ is scene linear exposure and $y$ is the Log3G10 code value (0-1). The name "3G10" refers to the dynamic range allocation: <mark>3 stops below middle grey, 10 stops above</mark> = 13 stops total.

> **Technical Detail:** Unlike LogC which uses $\log_{10}(ax + b)$, Log3G10 uses $\log_{10}(x + c)$ with a simpler offset. This makes the math cleaner for ACES transforms since both RED and ACES use similar logarithmic structures.

#### The Output Transform

In the old days, you baked the look in the camera. In IPP2, the <mark>R3D</mark> file is always Log3G10. The "Look" (Contrast, Rolloff) is just metadata applied at the very end of the chain.

> **Why This Matters:** This makes RED footage incredibly flexible in an ACES workflow because <mark>Log3G10 → ACES AP0</mark> is a clean, mathematically defined path.

### The Philosophical Divide

- **ARRI Philosophy:** "Give cinematographers a beautiful starting point that matches film." (Perceptually optimized from the start)
- **RED Philosophy:** "Give colorists maximum data and let them decide." (Technically pure, creatively flexible)
- **Sony Venice:** A hybrid approach—<mark>X-OCN</mark> (eXtended Original Camera Negative) with <mark>S-Gamut3.Cine</mark> attempts to balance both worlds by providing ACES-friendly primaries with perceptually tuned shoulder rolloff.

<figure class="diagram-placeholder">
  <div class="diagram-container">
    <div class="placeholder-text">
      {% include colorimetry-figure-in-development.html %}
    </div>
  </div>
  <figcaption>Figure 6.2: Camera native gamuts—the "color wars" visualized on the CIE diagram</figcaption>
</figure>

## 6.3 RAW Mechanics: The Bayer Pattern
{: #section-6-3}

Underneath the Log curves and LUTs, all these cameras (mostly) share the same anatomy: The <mark>Bayer Filter Array</mark>.

### The Mosaic

Sensors are monochromatic. They only count photons. To see color, we place a mosaic of colored filters over the pixels.

The pattern is <mark>BGGR</mark> (Blue, Green, Green, Red).

- **50% Green:** Because the human eye (M-Cone) is most sensitive to green luminance.
- **25% Red / 25% Blue:** We need less resolution for these colors.

### Demosaicing (Debayering)

The process of turning this mosaic into an RGB image is called <mark>Demosaicing</mark>.

The algorithm looks at a "Red" pixel (which has no Blue or Green data) and guesses the missing values by looking at its neighbors.

- **Debayer Quality:** High-quality debayering (like <mark>ARRI ADA-7</mark>) looks for edges and textures to avoid "zippering" artifacts. Low-quality debayering just averages the neighbors, resulting in soft images.

<figure class="diagram-placeholder">
  <div class="diagram-container">
    <div class="placeholder-text">
      {% include colorimetry-figure-in-development.html %}
    </div>
  </div>
  <figcaption>Figure 6.3: Bayer pattern demosaicing—from mosaic to RGB image</figcaption>
</figure>

### The Hacker's Way: Dcraw & Libraw

If you want to see what the sensor actually saw—without ARRI's matrix or RED's IPP2 sauce—you need a command-line tool called <mark>dcraw</mark> (or its modern successor <mark>Libraw</mark>).

This is for the DIT who wants to verify sensor noise or check for true clipping without any LUTs hiding the truth.

#### The "Truth" Command

Run this in your terminal to convert a RAW file to a linear TIFF with no white balance and no color interpolation:

<pre><code>dcraw -D -4 -T image.raw</code></pre>

- <code>-D</code>: Document mode. No debayering. You see the raw greyscale Bayer pattern.
- <code>-4</code>: Linear 16-bit output. No gamma curve.
- <code>-T</code>: Save as TIFF.

#### Converting to ACES

If you want to debayer straight to <mark>ACES AP0</mark> (bypassing the manufacturer's SDK):

<pre><code>dcraw -o 5 -4 -w -T image.raw</code></pre>

- <code>-o 5</code>: Output color space = XYZ (for ACES conversion).
- <code>-w</code>: Use camera white balance.

> **Why do this?** Sometimes manufacturer SDKs apply hidden noise reduction or sharpening. Dcraw gives you the raw, mathematical pixel data. It is the biologist's microscope for digital images.

**Next Module:** We finish the course with the "Final Boss"—<mark>Computational Color</mark>. Algorithms, Inverse LUTs, and Security.

## References & Further Reading
- ARRI (2020). *ALEXA 35 - System and Workflow Overview*. ARRI Technical Documentation.
- ARRI (2017). *ALEXA LogC Curve - Usage in VFX*. ARRI White Paper WP-5.
- RED Digital Cinema (2021). *IPP2 White Paper - Color Science and Image Pipeline 2*.
- Sony (2018). *Venice Technical Manual - X-OCN and S-Gamut3.Cine*. Sony Professional Solutions.
- Coffin, D. (2023). *dcraw - Decoding RAW Digital Photos in Linux*. Available at: cybercom.net/~dcoffin/dcraw
- OpenImageIO Project. *RAW File Processing and Color Management*. Available at: openimageio.org
