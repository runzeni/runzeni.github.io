---
title: "Module 3: The Digital Image Pipeline"
series: colorimetry
module_number: 3
slug: module-3
permalink: /misc/colorimetry/module-3/
date: 2025-12-10
description: "Scene-referred vs. display-referred workflows, color models, transfer functions, and the view transform."
math: true
colorimetry_interactive: true
---

<header class="module-header">
  <div class="module-meta">
    <span class="module-series-badge">Colorimetry</span>
    <span class="module-number-badge">Module 3 of 7</span>
  </div>
  <h1>The Digital Image Pipeline</h1>
  <div class="module-header-meta">
    <span class="module-date">December 2025</span>
  </div>
</header>

<article class="module-content">

  <div class="module-intro">
    <p class="lead-paragraph">
      "The camera does not take pictures. It collects data."
    </p>
    <p>
      In Module 2, we learned how to measure color (<mark>CIE XYZ</mark>). Now, we need to move that data from the sensor to the screen.
    </p>
    <p>
      This journey—the <mark>Image Pipeline</mark>—is where 90% of workflow errors happen. Why does your RAW file look dark? Why does the fire look yellow instead of red? Why does the LUT break the image?
    </p>
    <p>
      The answer lies in the fundamental divide between Physics (The Scene) and Perception (The Display).
    </p>
  </div>

  <nav class="module-toc" aria-label="Table of contents">
    <h2 class="module-toc-title">In This Module</h2>
    <ul>
      <li><a href="#section-3-1">3.1 Scene-Referred vs. Display-Referred</a></li>
      <li><a href="#section-3-2">3.2 The Zoo of Color Models</a></li>
      <li><a href="#section-3-3">3.3 Transfer Functions (OETF & EOTF)</a></li>
      <li><a href="#section-3-4">3.4 Tone Mapping & The View Transform</a></li>
    </ul>
  </nav>

  <section id="section-3-1" class="content-section">
    <h2>3.1 Scene-Referred vs. Display-Referred</h2>

    <p>
      This is the "Old Testament" vs. "New Testament" of color science.
    </p>

    <h3>Scene-Referred (The Reality)</h3>

    <ul>
      <li><strong>Definition:</strong> The data represents the actual light intensity in the physical world.</li>
      <li><strong>Math:</strong> <mark>Linear</mark> (1 photon + 1 photon = 2 photons).</li>
      <li><strong>Range:</strong> Unbounded. The sun is not "1.0"; it might be 16,000.0.</li>
      <li><strong>Who lives here?</strong> The Sensor, The Renderer (Blender/Unreal), The Compositor (Nuke).</li>
    </ul>

    <h3>Display-Referred (The Monitor)</h3>

    <ul>
      <li><strong>Definition:</strong> The data represents the voltage sent to the screen to create a perceptual image.</li>
      <li><strong>Math:</strong> <mark>Non-Linear</mark> (Gamma Encoded).</li>
      <li><strong>Range:</strong> Bounded <mark>[0.0 to 1.0]</mark>. You cannot go brighter than "Maximum White" on the monitor.</li>
      <li><strong>Who lives here?</strong> The JPG, The ProRes export, The Monitor.</li>
    </ul>

    <h3>The Middle Grey Battle</h3>

    <p>
      The disconnect between these two worlds is best summarized by <mark>Middle Grey</mark>.
    </p>

    <ul>
      <li><strong>In Physics (Scene):</strong> An 18% grey card reflects 18% of the light. The value is <mark>0.18</mark>.</li>
      <li><strong>In Perception (Display):</strong> To the human eye (<mark>Weber-Fechner Law</mark>), that card looks "halfway" between black and white. We encode it to <mark>~0.50</mark>.</li>
    </ul>

    <blockquote>
      <strong>The Pivot:</strong> The job of a Color Pipeline (and the DIT) is to map that <mark>0.18 Scene Value</mark> to the <mark>0.50 Display Value</mark> without destroying the data in between.
    </blockquote>

    <figure class="diagram-placeholder">
      <div class="diagram-container">
        <div class="placeholder-text">
          {% include colorimetry-figure-in-development.html %}
        </div>
      </div>
      <figcaption>Figure 3.1: Scene-referred linear encoding vs display-referred gamma encoding</figcaption>
    </figure>

  </section>

  <section id="section-3-2" class="content-section">
    <h2>3.2 The Zoo of Color Models (And Why Some Bite)</h2>

    <p>
      Let's talk about the "containers" we put color data into. Not all color models are created equal.
    </p>

    <h3>A. RGB (Red, Green, Blue)</h3>

    <ul>
      <li><strong>Type:</strong> Device-Dependent.</li>
      <li><strong>The Trap:</strong> "<mark>RGB</mark>" means nothing without a standard (<mark>sRGB</mark>, <mark>Rec.2020</mark>). $R=255$ on your phone is not the same color as $R=255$ on a projector.</li>
    </ul>

    <h3>B. YCbCr (Y'UV)</h3>

    <ul>
      <li><strong>Type:</strong> Transmission.</li>
      <li><strong>The Logic:</strong> Since the eye is less sensitive to color detail (Module 1), we separate Brightness (Y) from Color (Cb, Cr) and compress the color (<mark>4:2:0 subsampling</mark>).</li>
      <li><strong>The Math:</strong> It's just a matrix rotation of RGB.</li>
    </ul>

    <h3>C. HSL / HSV (Hue, Saturation, Lightness)</h3>

    <ul>
      <li><strong>Type:</strong> The "Artist's Lie."</li>
      <li><strong>The Trap:</strong> <mark>HSL</mark> attempts to make color intuitive, but it is perceptually broken.
        <ul>
          <li>In HSL, Pure Blue $(0,0,255)$ and Pure Green $(0,255,0)$ both have Lightness = 50%.</li>
          <li>Reality: Your eye sees Green as 5× brighter than Blue.</li>
        </ul>
      </li>
      <li><strong>Consequence:</strong> If you desaturate an image using HSL controls, you will shift the perceived brightness unevenly. Never use HSL for critical grading. Use <mark>Lab*</mark> (from Module 2) or <mark>ICtCp</mark> instead. DaVinci Resolve's <strong>Warper</strong> tool uses Lab* math under the hood specifically because it's perceptually uniform.</li>
    </ul>

    <figure class="diagram-placeholder">
      <div class="diagram-container">
        <div class="placeholder-text">
          {% include colorimetry-figure-in-development.html %}
        </div>
      </div>
      <figcaption>Figure 3.2: Comparing color models—RGB (device), HSL (artist), Lab* (perceptual)</figcaption>
    </figure>

  </section>

  <section id="section-3-3" class="content-section">
    <h2>3.3 The Transfer Functions (OETF & EOTF)</h2>

    <p>
      To move between Scene and Display, we use <mark>Transfer Functions</mark>. You likely know them as "Gamma Curves" or "Log Curves," but let's be precise.
    </p>

    <h3>OETF (Opto-Electronic Transfer Function)</h3>

    <ul>
      <li><strong>Direction:</strong> Optical Light (Scene) $\rightarrow$ Electrical Signal (Data).</li>
      <li><strong>Example:</strong> <mark>ARRI LogC3</mark>.</li>
      <li><strong>Purpose:</strong> Compression. We don't need 16,000 values for the sun. We need more values in the shadows where the human eye is sensitive. The <mark>OETF</mark> compresses the linear dynamic range into a usable file format.</li>
    </ul>

    <h3>EOTF (Electro-Optical Transfer Function)</h3>

    <ul>
      <li><strong>Direction:</strong> Electrical Signal (Data) $\rightarrow$ Optical Light (Screen).</li>
      <li><strong>Example:</strong> a <mark>BT.1886-style gamma 2.4</mark> display transform for SDR reference viewing, or <mark>ST.2084 PQ</mark> for HDR.</li>
      <li><strong>Purpose:</strong> Decoding. It tells the monitor: "When you see code value 0.5, emit X nits of light."</li>
    </ul>

    <h3>The "Gamma" Myth</h3>

    <p>
      We often say "<mark>Gamma 2.2</mark>" because legacy CRT monitors naturally darkened the image (a physical EOTF of 2.2). We applied a "Gamma correction" (OETF of 1/2.2) to the signal to cancel it out.
    </p>

    <blockquote>
      <strong>Modern Reality:</strong> Today, display systems are more complex than CRT gamma. Power-law curves remain useful approximations because they allocate code values efficiently, but the exact behavior depends on the encoding, display transform, surround, and mastering target.
    </blockquote>

    <h3>Transfer Function Mathematics</h3>

    <p>
      Let's make this concrete. Here are the actual formulas for common transfer functions:
    </p>

    <p><strong>1. Gamma 2.2 (Simple Power Function):</strong></p>

    $$
    V_{\text{display}} = V_{\text{encoded}}^{2.2}
    $$

    <p>
      Where $V$ is normalized (0-1). This is the EOTF. The OETF (encoding) is the inverse: $V_{\text{encoded}} = V_{\text{linear}}^{1/2.2}$.
    </p>

    <p><strong>2. sRGB (Piecewise for Shadow Detail):</strong></p>

    $$
    V_{\text{srgb}} = \begin{cases}
    12.92 \times V_{\text{linear}} & \text{if } V_{\text{linear}} \leq 0.0031308 \\
    1.055 \times V_{\text{linear}}^{1/2.4} - 0.055 & \text{otherwise}
    \end{cases}
    $$

    <p>
      Notice the linear segment below 0.0031308. It defines the low-end behavior near black; the often-quoted “gamma 2.2” is only an approximation of this hybrid function.
    </p>

    <p><strong>3. LogC3 (ARRI - Simplified):</strong></p>

    $$
    y = c \times \log_{10}(a \times x + b) + d
    $$

    <p>
      Where $a=5.556$, $b=0.048$, $c=0.247$, $d=0.386$ (for ARRI Wide Gamut 3). This maps scene linear exposure $x$ to code value $y$ (0-1). Middle Grey (18% reflectance) → <mark>0.39 (39% code value)</mark>.
    </p>

    <p><strong>4. ST.2084 PQ (HDR - Absolute Luminance):</strong></p>

    $$
    V = \left( \frac{\max[(L/10000)^{m_1} - c_1, 0]}{c_2 - c_3 (L/10000)^{m_1}} \right)^{m_2}
    $$

    <p>
      Where: $m_1 = 0.1593$, $m_2 = 78.8438$, $c_1 = 0.8359$, $c_2 = 18.8516$, $c_3 = 18.6875$, and $L$ is luminance in nits. PQ is designed to allocate code values perceptually across a reference range up to 10,000 nits.
    </p>

    <blockquote>
      <strong>Critical Insight:</strong> PQ is <mark>absolute</mark>: code value 0.7518 maps to approximately 1,000 nits on the reference EOTF. Gamma and log encodings are <mark>relative</mark>. A real display may still apply tone mapping when its capabilities differ from the mastered signal.
    </blockquote>

    <figure class="colorimetry-widget" data-colorimetry-widget="transfer-curves" aria-labelledby="transfer-curves-title">
      <p class="colorimetry-widget__eyebrow">Interactive study</p>
      <h4 class="colorimetry-widget__title" id="transfer-curves-title">Transfer-curve explorer</h4>
      <p class="colorimetry-widget__note">Compare scene-linear, sRGB, and a simple power-law encoding. This is deliberately a formula study, not a camera-profile or display simulation.</p>
      <div class="colorimetry-widget__canvas">
        <svg data-transfer-svg role="img" aria-labelledby="transfer-curves-svg-title transfer-curves-svg-description"></svg>
      </div>
      <div class="colorimetry-widget__controls">
        <label class="colorimetry-widget__control" for="transfer-gamma">
          <span>Reference gamma</span>
          <output class="colorimetry-widget__output" id="transfer-gamma-output" data-transfer-gamma-output></output>
          <input id="transfer-gamma" data-transfer-gamma type="range" min="1.8" max="2.6" step="0.1" value="2.4">
        </label>
        <ul class="colorimetry-widget__legend" aria-label="Transfer curve legend">
          <li class="colorimetry-widget__legend-item"><span class="colorimetry-widget__swatch" style="--swatch-color: #858585"></span>Scene-linear</li>
          <li class="colorimetry-widget__legend-item"><span class="colorimetry-widget__swatch" style="--swatch-color: #2f6b85"></span>sRGB</li>
          <li class="colorimetry-widget__legend-item"><span class="colorimetry-widget__swatch" style="--swatch-color: #a2492a"></span>Reference gamma</li>
        </ul>
      </div>
      <p class="colorimetry-widget__readout" data-transfer-readout role="status" aria-live="polite"></p>
      <noscript><p class="colorimetry-widget__fallback">JavaScript is off. The equations above remain the source for this study.</p></noscript>
      <figcaption>Figure 3.3: Transfer-function comparison using the sRGB encoding equation and a simple gamma power law.</figcaption>
    </figure>

  </section>

  <section id="section-3-4" class="content-section">
    <h2>3.4 Tone Mapping & The View Transform</h2>

    <p>
      Here is the problem: Your Scene data is <mark>High Dynamic Range</mark> (0 to 16,000). Your Display is <mark>Low Dynamic Range</mark> (0 to 1). How do you fit an Elephant into a Fridge?
    </p>

    <p>
      You need a <mark>View Transform</mark> (or <mark>Tone Mapper</mark>). This is the "Development" stage.
    </p>

    <h3>Case Study: Blender's AgX vs. Filmic</h3>

    <p>
      If you work in 3D or VFX, you've seen the shift from Filmic to AgX. This is a perfect lesson in Tone Mapping.
    </p>

    <h4>1. The "Notorious 6" Problem (Filmic)</h4>

    <p>
      Standard sRGB/Filmic transforms suffer from a digital artifact: as a color gets brighter, it skews toward the primary colors (Red, Green, Blue) and eventually hits White.
    </p>

    <ul>
      <li><strong>Visual Artifact:</strong> A bright fire looks Yellow → White. It loses the deep Red/Orange core.</li>
      <li><strong>Cause:</strong> The transform clips individual channels (R, G, B) as they hit 1.0.</li>
    </ul>

    <h4>2. The AgX Solution (Analog Emulation)</h4>

    <p>
      <mark>AgX</mark> (named after Silver Halide crystals) mimics film chemistry.
    </p>

    <ul>
      <li><strong>Method:</strong> As exposure increases, AgX desaturates the color towards white <em>before</em> it clips.</li>
      <li><strong>Visual Result:</strong> A bright fire looks Red → Orange → White. It looks "real" because it preserves the relationship between channels, even as they blow out.</li>
    </ul>

    <h4>3. Khronos PBR Neutral (The Product Viz Standard)</h4>

    <p>
      Sometimes "Filmic" is bad. If you are selling a sneaker, you don't want "cinematic desaturation"; you want the exact brand color.
    </p>

    <ul>
      <li><strong>Method:</strong> A 1:1 mapping for most of the range, with a very soft rolloff only at the extreme highlights. It prioritizes <mark>Colorimetric Accuracy</mark> over Dynamic Range.</li>
    </ul>

    <blockquote>
      <strong>Takeaway:</strong> The View Transform is not just a technical setting; it is a creative choice. It defines how light "breaks" in your image.
    </blockquote>

    <figure class="diagram-placeholder">
      <div class="diagram-container">
        <div class="placeholder-text">
          {% include colorimetry-figure-in-development.html %}
        </div>
      </div>
      <figcaption>Figure 3.4: View transform comparison—how different tone mappers handle highlights</figcaption>
    </figure>

    <h3>Gamut Mapping: The Color Boundary Problem</h3>

    <p>
      Even after tone mapping, you might have colors that don't exist on your display. A laser-saturated cyan in <mark>Rec.2020</mark> cannot be shown on a <mark>Rec.709</mark> monitor.
    </p>

    <p>
      This requires <mark>Gamut Mapping</mark>—the process of compressing out-of-gamut colors into the displayable range without creating visual artifacts.
    </p>

    <ul>
      <li><strong>Naive Clipping:</strong> Just clip the RGB values at 1.0. Result: Ugly, artificial-looking colors.</li>
      <li><strong>Perceptual Compression:</strong> Gradually compress colors as they approach the gamut boundary. Result: Smooth, natural-looking (but less saturated).</li>
      <li><strong>ACES Gamut Compress:</strong> A hybrid approach that preserves hue and luminance while compressing saturation in problematic regions (cyan, blue).</li>
    </ul>

    <p>
      <strong>Next Module:</strong> We enter the standardized future. It is time to talk about <mark>ACES</mark>.
    </p>

  </section>

  <section class="module-references">
    <h2>References & Further Reading</h2>
    <ul>
      <li>ITU-R Recommendation BT.709-6 (2015). <em>Parameter values for the HDTV standards for production and international programme exchange</em>.</li>
      <li>IEC 61966-2-1:1999. <em>Multimedia systems and equipment - Colour measurement and management - Part 2-1: Colour management - Default RGB colour space - sRGB</em>.</li>
      <li>ARRI (2017). <em>ALEXA LogC Curve - Usage in VFX</em>. ARRI Technical Note.</li>
      <li>SMPTE ST 2084:2014. <em>High Dynamic Range Electro-Optical Transfer Function of Mastering Reference Displays</em>.</li>
      <li>Duiker, H.P. & Heckbert, P. (2010). <em>Academy Color Encoding System (ACES)</em>. AMPAS White Paper.</li>
      <li>Sobotka, T. (2022). <em>AgX - A New Film-Like Tone Mapper for Blender</em>. Blender Foundation Documentation.</li>
      <li>Poynton, C. (2012). <em>Digital Video and HDTV: Algorithms and Interfaces</em>, 2nd Ed. Morgan Kaufmann. ISBN: 978-0123919267.</li>
    </ul>
  </section>

</article>
