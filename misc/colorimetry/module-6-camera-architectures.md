---
title: "Module 6: Camera Architectures & Case Studies"
permalink: /misc/colorimetry/module-6/
layout: default
series: colorimetry
module_number: 6
prev_module: /misc/colorimetry/module-5/
next_module: /misc/colorimetry/module-7/
reading_time: 12
date: 2025-12-10
description: "A camera is just a sensor with an opinion. Analyzing ARRI's gold standard, the color wars (RED IPP2 vs. ACES), and RAW demosaicing mechanics."
---

<div class="site-breadcrumb">
  <nav class="breadcrumb-container" aria-label="Breadcrumb">
    <a href="/" class="breadcrumb-item">Home</a>
    <span class="breadcrumb-separator" aria-hidden="true">/</span>
    <a href="/misc/" class="breadcrumb-item">Misc</a>
    <span class="breadcrumb-separator" aria-hidden="true">/</span>
    <a href="/misc/colorimetry/" class="breadcrumb-item">Colorimetry</a>
    <span class="breadcrumb-separator" aria-hidden="true">/</span>
    <span class="breadcrumb-item breadcrumb-current" aria-current="page">Module 6</span>
  </nav>
</div>

<header class="module-header">
  <div class="module-meta">
    <span class="module-series-badge">Colorimetry Series</span>
    <span class="module-number-badge">Module 6 of 7</span>
  </div>
  <h1>Camera Architectures & Case Studies</h1>
  <div class="module-header-meta">
    <span class="module-reading-time">~12 min read</span>
    <span class="article-meta-separator">•</span>
    <span class="module-date">December 2025</span>
  </div>
</header>

<article class="module-content">

  <div class="module-intro">
    <p class="lead-paragraph">
      "A camera is just a sensor with an opinion."
    </p>
    <p>
      We have spent five modules talking about universal standards (<mark>ACES</mark>, <mark>CIE XYZ</mark>). Now, let's talk about the proprietary "Secret Sauce" that manufacturers bake into their cameras.
    </p>
    <p>
      Why does an <mark>ARRI Alexa</mark> look different from a <mark>RED V-Raptor</mark>? It's not just the sensor hardware; it's the math they wrap around it.
    </p>
  </div>

  <nav class="module-toc" aria-label="Table of contents">
    <h2 class="module-toc-title">In This Module</h2>
    <ul>
      <li><a href="#section-6-1">6.1 The ARRI Gold Standard</a></li>
      <li><a href="#section-6-2">6.2 The Color Wars</a></li>
      <li><a href="#section-6-3">6.3 RAW Mechanics</a></li>
    </ul>
  </nav>

  <section id="section-6-1" class="content-section">
    <h2>6.1 The ARRI Gold Standard</h2>

    <p>
      For over a decade, the <mark>ALEV III sensor</mark> (Alexa Classic through Mini LF) has been the benchmark for digital cinema. Why? Because ARRI prioritized <mark>Highlights</mark> over everything else.
    </p>

    <h3>The LogC Curve (LogC3 vs. LogC4)</h3>

    <p>
      ARRI's encoding is designed to mimic film density.
    </p>

    <ul>
      <li><strong>LogC3:</strong> The classic curve. It allocates a massive amount of data to the highlights (shoulder), ensuring that roll-off is gentle and desaturated.</li>
      <li><strong>LogC4</strong> (Alexa 35): With the new <mark>ALEV IV sensor</mark> (17 stops), LogC3 ran out of room. <mark>LogC4</mark> is a new curve that pulls <mark>Middle Grey down to 32%</mark> (from 39%) to make room for 2.5 extra stops of highlight information.</li>
    </ul>

    <p><strong>LogC3 Formula (ARRI Wide Gamut 3):</strong></p>

    $$
    y = \begin{cases}
    5.555556 \times x + 0.052272 & \text{if } x < 0.010591 \\
    0.247190 \times \log_{10}(5.555556 \times x + 0.047996) + 0.385537 & \text{otherwise}
    \end{cases}
    $$

    <p>
      Where $x$ is scene linear exposure (normalized) and $y$ is the LogC3 code value (0-1). Middle Grey (18% reflectance, $x = 0.18$) maps to <mark>$y = 0.39$</mark>.
    </p>

    <p><strong>LogC4 Formula (Alexa 35):</strong></p>

    $$
    y = \begin{cases}
    (x - 0.0011361) / 0.068512 & \text{if } x < 0.0059569 \\
    0.27861 \times \log_{10}(x \times 10.6723 + 1) + 0.33122 & \text{otherwise}
    \end{cases}
    $$

    <p>
      Where Middle Grey ($x = 0.18$) maps to <mark>$y = 0.32$</mark>. This shift from 39% to 32% creates headroom for 2.5 additional stops in highlights while maintaining 10-bit precision.
    </p>

    <blockquote>
      <strong>Why Middle Grey Matters:</strong> The position of Middle Grey determines how the 10-bit code values (0-1023) are distributed across the dynamic range. LogC3's 39% was optimal for 14 stops. LogC4's 32% accommodates 17 stops by "borrowing" code values from midtones and shadows—acceptable because modern sensors have lower noise.
    </blockquote>

    <h3>The "K1S1" Magic</h3>

    <p>
      The "Alexa Look" isn't just the Log curve; it's the <mark>Display Rendering Transform (DRT)</mark>.
    </p>

    <p>
      The famous <mark>K1S1</mark> (and later the <mark>ARRI Rec.709</mark> LUT) applies a very specific, non-linear tone map.
    </p>

    <ul>
      <li><strong>Shoulder Desaturation:</strong> As colors get brighter, ARRI's LUT aggressively desaturates them. A bright red taillight turns white/orange, not "digital red." This mimics how film emulsion runs out of dye.</li>
      <li><strong>Matrix Crosstalk:</strong> The ARRI matrix allows colors to "bleed" into each other slightly, creating a dense, organic palette rather than a sterile, separated one.</li>
    </ul>

    <figure class="diagram-placeholder">
      <div class="diagram-container">
        <div class="placeholder-text">
          [Future Interactive: LogC3 vs LogC4 Comparison - Side-by-side curves showing Middle Grey position (39% vs 32%) and highlight allocation with sample HDR image showing shoulder rolloff behavior]
        </div>
      </div>
      <figcaption>Figure 6.1: ARRI LogC3 vs LogC4—expanding dynamic range through curve optimization</figcaption>
    </figure>

  </section>

  <section id="section-6-2" class="content-section">
    <h2>6.2 The Color Wars</h2>

    <p>
      For years, camera manufacturers took different philosophical approaches to color science. ARRI favored <mark>Perceptual Pleasing</mark>, RED favored <mark>Mathematical Flexibility</mark>, and Sony/Canon positioned themselves somewhere in between.
    </p>

    <h3>RED IPP2 (Image Processing Pipeline 2)</h3>

    <p>
      For years, RED was the "Wild West." You had <mark>DragonColor</mark>, <mark>DragonColor2</mark>, <mark>RedGamma3</mark>, <mark>RedGamma4</mark>... it was a mess.
    </p>

    <p>
      Then came <mark>IPP2</mark>, which unified everything into a workflow remarkably similar to ACES.
    </p>

    <h4>The Separation of Church and State</h4>

    <p>
      IPP2 separates the Technical from the Creative.
    </p>

    <ol>
      <li><strong><mark>REDWideGamutRGB</mark>:</strong> The container. It encompasses every color the sensor can see.</li>
      <li><strong><mark>Log3G10</mark>:</strong> The curve. It defines Middle Grey and provides 10 stops of highlight headroom (hence "3G10" = 3 stops below, 10 above middle grey).</li>
    </ol>

    <p><strong>Log3G10 Formula (RED IPP2):</strong></p>

    $$
    y = \begin{cases}
    15.1927 \times x & \text{if } x < -0.01 \\
    0.224282 \times \log_{10}(x + 0.01) + 0.444666 & \text{otherwise}
    \end{cases}
    $$

    <p>
      Where $x$ is scene linear exposure and $y$ is the Log3G10 code value (0-1). The name "3G10" refers to the dynamic range allocation: <mark>3 stops below middle grey, 10 stops above</mark> = 13 stops total.
    </p>

    <blockquote>
      <strong>Technical Detail:</strong> Unlike LogC which uses $\log_{10}(ax + b)$, Log3G10 uses $\log_{10}(x + c)$ with a simpler offset. This makes the math cleaner for ACES transforms since both RED and ACES use similar logarithmic structures.
    </blockquote>

    <h4>The Output Transform</h4>

    <p>
      In the old days, you baked the look in the camera. In IPP2, the <mark>R3D</mark> file is always Log3G10. The "Look" (Contrast, Rolloff) is just metadata applied at the very end of the chain.
    </p>

    <blockquote>
      <strong>Why This Matters:</strong> This makes RED footage incredibly flexible in an ACES workflow because <mark>Log3G10 → ACES AP0</mark> is a clean, mathematically defined path.
    </blockquote>

    <h3>The Philosophical Divide</h3>

    <ul>
      <li><strong>ARRI Philosophy:</strong> "Give cinematographers a beautiful starting point that matches film." (Perceptually optimized from the start)</li>
      <li><strong>RED Philosophy:</strong> "Give colorists maximum data and let them decide." (Technically pure, creatively flexible)</li>
      <li><strong>Sony Venice:</strong> A hybrid approach—<mark>X-OCN</mark> (eXtended Original Camera Negative) with <mark>S-Gamut3.Cine</mark> attempts to balance both worlds by providing ACES-friendly primaries with perceptually tuned shoulder rolloff.</li>
    </ul>

    <figure class="diagram-placeholder">
      <div class="diagram-container">
        <div class="placeholder-text">
          [Future Interactive: Camera Gamut Comparison - CIE 1931 diagram showing ARRI Wide Gamut 3, REDWideGamutRGB, Sony S-Gamut3.Cine, and Canon Cinema Gamut overlaid with ACES AP0/AP1 and Rec.2020]
        </div>
      </div>
      <figcaption>Figure 6.2: Camera native gamuts—the "color wars" visualized on the CIE diagram</figcaption>
    </figure>

  </section>

  <section id="section-6-3" class="content-section">
    <h2>6.3 RAW Mechanics: The Bayer Pattern</h2>

    <p>
      Underneath the Log curves and LUTs, all these cameras (mostly) share the same anatomy: The <mark>Bayer Filter Array</mark>.
    </p>

    <h3>The Mosaic</h3>

    <p>
      Sensors are monochromatic. They only count photons. To see color, we place a mosaic of colored filters over the pixels.
    </p>

    <p>
      The pattern is <mark>BGGR</mark> (Blue, Green, Green, Red).
    </p>

    <ul>
      <li><strong>50% Green:</strong> Because the human eye (M-Cone) is most sensitive to green luminance.</li>
      <li><strong>25% Red / 25% Blue:</strong> We need less resolution for these colors.</li>
    </ul>

    <h3>Demosaicing (Debayering)</h3>

    <p>
      The process of turning this mosaic into an RGB image is called <mark>Demosaicing</mark>.
    </p>

    <p>
      The algorithm looks at a "Red" pixel (which has no Blue or Green data) and guesses the missing values by looking at its neighbors.
    </p>

    <ul>
      <li><strong>Debayer Quality:</strong> High-quality debayering (like <mark>ARRI ADA-7</mark>) looks for edges and textures to avoid "zippering" artifacts. Low-quality debayering just averages the neighbors, resulting in soft images.</li>
    </ul>

    <figure class="diagram-placeholder">
      <div class="diagram-container">
        <div class="placeholder-text">
          [Future Interactive: Bayer Pattern Visualizer - Magnified view of BGGR mosaic with toggles to show RAW sensor data, basic bilinear interpolation, and advanced edge-aware demosaicing (ADA-7 equivalent)]
        </div>
      </div>
      <figcaption>Figure 6.3: Bayer pattern demosaicing—from mosaic to RGB image</figcaption>
    </figure>

    <h3>The Hacker's Way: Dcraw & Libraw</h3>

    <p>
      If you want to see what the sensor actually saw—without ARRI's matrix or RED's IPP2 sauce—you need a command-line tool called <mark>dcraw</mark> (or its modern successor <mark>Libraw</mark>).
    </p>

    <p>
      This is for the DIT who wants to verify sensor noise or check for true clipping without any LUTs hiding the truth.
    </p>

    <h4>The "Truth" Command</h4>

    <p>
      Run this in your terminal to convert a RAW file to a linear TIFF with no white balance and no color interpolation:
    </p>

    <pre><code>dcraw -D -4 -T image.raw</code></pre>

    <ul>
      <li><code>-D</code>: Document mode. No debayering. You see the raw greyscale Bayer pattern.</li>
      <li><code>-4</code>: Linear 16-bit output. No gamma curve.</li>
      <li><code>-T</code>: Save as TIFF.</li>
    </ul>

    <h4>Converting to ACES</h4>

    <p>
      If you want to debayer straight to <mark>ACES AP0</mark> (bypassing the manufacturer's SDK):
    </p>

    <pre><code>dcraw -o 5 -4 -w -T image.raw</code></pre>

    <ul>
      <li><code>-o 5</code>: Output color space = XYZ (for ACES conversion).</li>
      <li><code>-w</code>: Use camera white balance.</li>
    </ul>

    <blockquote>
      <strong>Why do this?</strong> Sometimes manufacturer SDKs apply hidden noise reduction or sharpening. Dcraw gives you the raw, mathematical pixel data. It is the biologist's microscope for digital images.
    </blockquote>

    <p>
      <strong>Next Module:</strong> We finish the course with the "Final Boss"—<mark>Computational Color</mark>. Algorithms, Inverse LUTs, and Security.
    </p>

  </section>

  <section class="module-references">
    <h2>References & Further Reading</h2>
    <ul>
      <li>ARRI (2020). <em>ALEXA 35 - System and Workflow Overview</em>. ARRI Technical Documentation.</li>
      <li>ARRI (2017). <em>ALEXA LogC Curve - Usage in VFX</em>. ARRI White Paper WP-5.</li>
      <li>RED Digital Cinema (2021). <em>IPP2 White Paper - Color Science and Image Pipeline 2</em>.</li>
      <li>Sony (2018). <em>Venice Technical Manual - X-OCN and S-Gamut3.Cine</em>. Sony Professional Solutions.</li>
      <li>Coffin, D. (2023). <em>dcraw - Decoding RAW Digital Photos in Linux</em>. Available at: cybercom.net/~dcoffin/dcraw</li>
      <li>OpenImageIO Project. <em>RAW File Processing and Color Management</em>. Available at: openimageio.org</li>
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
      <a href="/misc/colorimetry/module-5/" class="module-nav-prev">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <span>Previous Module</span>
      </a>

      <a href="/misc/colorimetry/module-7/" class="module-nav-next">
        <span>Next Module</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </a>
    </div>
  </div>
</nav>
