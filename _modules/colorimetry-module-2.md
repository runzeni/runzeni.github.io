---
title: "Module 2: Measuring Color (History & Standards)"
series: colorimetry
module_number: 2
slug: module-2
permalink: /notes/colorimetry/module-2/
date: 2025-12-10
description: "From early color-matching experiments to the CIE 1931 XYZ standard, perceptual uniformity, and the analog legacy of film."
math: true
---

<header class="module-header">
  <div class="module-meta">
    <span class="module-series-badge">Colorimetry</span>
    <span class="module-number-badge">Module 2 of 7</span>
  </div>
  <h1>Measuring Color: History & Standards</h1>
  <div class="module-header-meta">
    <span class="module-date">December 2025</span>
  </div>
</header>

<article class="module-content">

  <div class="module-intro">
    <p class="lead-paragraph">
      "If you can't measure it, you can't manage it."
    </p>
    <p>
      In Module 1, we learned that human vision is a chaotic mix of overlapping cone sensitivities, logarithmic processing, and psychological auto-corrections.
    </p>
    <p>
      This created a massive problem for scientists in the early 20th century. If I say "Coca-Cola Red" and you say "Ferrari Red," how do we know if we are talking about the same color? We needed a ruler for color.
    </p>
    <p>
      This module traces the journey from guesswork to the <mark>CIE 1931 XYZ</mark> system—the grandfather of all digital color management.
    </p>
  </div>

  <nav class="module-toc" aria-label="Table of contents">
    <h2 class="module-toc-title">In This Module</h2>
    <ul>
      <li><a href="#section-2-1">2.1 A History of Guesswork</a></li>
      <li><a href="#section-2-2">2.2 The Wright-Guild Experiments</a></li>
      <li><a href="#section-2-3">2.3 The Holy Grail: CIE 1931 XYZ</a></li>
      <li><a href="#section-2-4">2.4 The Flaw: Perceptual Uniformity</a></li>
      <li><a href="#section-2-5">2.5 The Analog Legacy</a></li>
    </ul>
  </nav>

  <section id="section-2-1" class="content-section">
    <h2>2.1 A History of Guesswork</h2>

    <p>
      Before we had math, we had swatches.
    </p>

    <h3>The Munsell System (1905)</h3>

    <p>
      Albert Munsell, an artist, was the first to organize color into a 3D solid based on how humans actually see it. He defined three axes:
    </p>

    <ul>
      <li><strong>Hue:</strong> The color itself (Red, Blue, etc.)</li>
      <li><strong>Value:</strong> Lightness (Black to White)</li>
      <li><strong>Chroma:</strong> Saturation (purity)</li>
    </ul>

    <p>
      Munsell is still used today (it's why we say "skin tone is near <mark>5YR</mark>"), but it had a fatal flaw: it was physical. You had to buy a book of painted chips. If the paint faded, your standard was gone. We needed numbers, not paint.
    </p>

    <figure class="diagram-placeholder">
      <div class="diagram-container">
        <div class="placeholder-text">
          {% include colorimetry-figure-in-development.html %}
        </div>
      </div>
      <figcaption>Figure 2.0: Munsell Color Solid—the first perceptually-organized 3D color space</figcaption>
    </figure>

  </section>

  <section id="section-2-2" class="content-section">
    <h2>2.2 The Wright-Guild Experiments (1920s)</h2>

    <p>
      In the late 1920s, two researchers—<strong>W.D. Wright</strong> and <strong>John Guild</strong>—independently ran experiments to quantify human vision. They didn't use brain scans; they used a game.
    </p>

    <h3>The Setup</h3>

    <p>
      They built a device with a split screen (a <mark>bipartite field</mark>).
    </p>

    <ul>
      <li><strong>Left Side:</strong> A test color (a pure spectral wavelength, e.g., 500nm Cyan)</li>
      <li><strong>Right Side:</strong> Three primary lights (Red, Green, Blue) that the observer could mix</li>
    </ul>

    <p>
      <strong>The task:</strong> "Turn the knobs on the RGB lights until the Right side matches the Left side perfectly."
    </p>

    <p>
      They repeated this for every wavelength in the visible spectrum with multiple observers.
    </p>

    <figure class="diagram-placeholder">
      <div class="diagram-container">
        <div class="placeholder-text">
          {% include colorimetry-figure-in-development.html %}
        </div>
      </div>
      <figcaption>Figure 2.1: Wright-Guild experimental setup—color matching with three primaries</figcaption>
    </figure>

    <h3>The "Negative Light" Problem</h3>

    <p>
      They hit a wall. When trying to match a pure Cyan (around 500nm), observers couldn't do it. The Red light in the mix desaturated the result too much. It was physically impossible to match.
    </p>

    <p>
      To solve this, they allowed observers to add Red light to the <em>Left</em> side (the test side). Mathematically, this is the same as having <mark>Negative Red</mark> on the Right side.
    </p>

    $$
    \text{Cyan} = \text{Green} + \text{Blue} - \text{Red}
    $$

    <blockquote>
      <strong>Critical Insight:</strong> This proved that no set of three physical RGB primaries can create all the colors humans can see. There will always be "Out of Gamut" colors.
    </blockquote>

  </section>

  <section id="section-2-3" class="content-section">
    <h2>2.3 The Holy Grail: CIE 1931 XYZ</h2>

    <p>
      In 1931, the <mark>CIE</mark> (International Commission on Illumination) took the Wright-Guild data and made a radical decision. Negative numbers are annoying for engineers. So, they performed a matrix transformation to create a new, theoretical color space called <mark>CIE XYZ</mark>.
    </p>

    <h3>The "Imaginary" Primaries</h3>

    <p>
      X, Y, and Z are not real lights. You cannot build an "X" LED. They are mathematical abstractions designed to have specific properties:
    </p>

    <ul>
      <li><strong>No Negatives:</strong> All visible colors have positive XYZ values</li>
      <li><strong>Y = Luminance:</strong> They deliberately aligned the "Y" axis to match the human brightness sensitivity curve ($V(\lambda)$). This means <mark>Y is brightness</mark>, while X and Z contain the color information.</li>
    </ul>

    <h3>Computing XYZ: From Theory to Practice</h3>

    <p>
      <strong>Remember the integration formula from Module 1?</strong> This is where it becomes real. To calculate the XYZ tristimulus values for any color, we use:
    </p>

    $$
    \begin{align}
    X &= k \int_{380}^{780} S(\lambda) \cdot R(\lambda) \cdot \bar{x}(\lambda) \, d\lambda \\
    Y &= k \int_{380}^{780} S(\lambda) \cdot R(\lambda) \cdot \bar{y}(\lambda) \, d\lambda \\
    Z &= k \int_{380}^{780} S(\lambda) \cdot R(\lambda) \cdot \bar{z}(\lambda) \, d\lambda
    \end{align}
    $$

    <p>Where:</p>
    <ul>
      <li>$S(\lambda)$ = Spectral Power Distribution of the light source (e.g., D65, tungsten)</li>
      <li>$R(\lambda)$ = Reflectance spectrum of the object (0-1 at each wavelength)</li>
      <li>$\bar{x}(\lambda), \bar{y}(\lambda), \bar{z}(\lambda)$ = <mark>CIE Standard Observer</mark> color matching functions</li>
      <li>$k$ = Normalizing constant: $k = 100 / \int S(\lambda) \bar{y}(\lambda) d\lambda$</li>
    </ul>

    <blockquote>
      <strong>Critical Connection:</strong> The CIE color matching functions ($\bar{x}, \bar{y}, \bar{z}$) replaced the biological LMS cone sensitivities from Module 1. They are mathematically derived from the Wright-Guild RGB data, transformed to eliminate negative values. This is the "imaginary observer" that defines all modern colorimetry.
    </blockquote>

    <p>
      Once you have XYZ, you can convert to <mark>chromaticity coordinates</mark> (x, y) to plot on the horseshoe diagram:
    </p>

    $$
    x = \frac{X}{X + Y + Z}, \quad y = \frac{Y}{X + Y + Z}
    $$

    <p>
      The luminance Y is kept separately. Together, $(x, y, Y)$ fully describes a color: $(x, y)$ tells you the hue and saturation, $Y$ tells you the brightness.
    </p>

    <h3>The Chromaticity Diagram (The Horseshoe)</h3>

    <p>
      If we ignore brightness (Y) and just look at color ($x$ and $y$), we get the famous <mark>CIE 1931 Chromaticity Diagram</mark>.
    </p>

    <ul>
      <li><strong>The Spectral Locus:</strong> The curved edge representing pure, monochromatic light (lasers)</li>
      <li><strong>The Purple Line:</strong> The straight bottom edge connecting Blue (380nm) and Red (700nm). These colors do not exist in the rainbow; they only exist in our brain when Red and Blue cones are stimulated simultaneously.</li>
      <li><strong>The White Point:</strong> The center where <mark>x=0.33, y=0.33</mark></li>
    </ul>

    <blockquote>
      <strong>Key Takeaway:</strong> Any triangle drawn inside this horseshoe represents a <mark>Gamut</mark> (like Rec.709 or DCI-P3). If a color falls outside your triangle, your monitor cannot display it.
    </blockquote>

    <figure class="diagram-placeholder">
      <div class="diagram-container">
        <div class="placeholder-text">
          {% include colorimetry-figure-in-development.html %}
        </div>
      </div>
      <figcaption>Figure 2.2: CIE 1931 xy Chromaticity Diagram—the horseshoe that defines all visible colors</figcaption>
    </figure>

  </section>

  <section id="section-2-4" class="content-section">
    <h2>2.4 The Flaw: Perceptual Uniformity</h2>

    <p>
      CIE 1931 XYZ is mathematically perfect but perceptually broken. It is <mark>Non-Uniform</mark>.
    </p>

    <h3>MacAdam Ellipses (1942)</h3>

    <p>
      David MacAdam tested how much you could change a color before a human noticed. He plotted these <mark>Just Noticeable Differences (JNDs)</mark> on the chart.
    </p>

    <ul>
      <li><strong>The Result:</strong> The ellipses are tiny in the Blue region but huge in the Green region</li>
      <li><strong>The Meaning:</strong> You can change Green a lot before anyone notices, but a tiny shift in Blue is obvious. This makes XYZ bad for grading interfaces because the controls feel inconsistent.</li>
    </ul>

    <p>
      This led to <mark>CIELAB (L*a*b*)</mark> in 1976, which warped the space to make the ellipses circular (uniform). This is why grading tools (like DaVinci Resolve's Warper) often work in Lab* math under the hood.
    </p>

    <h3>The Lab* Solution: Perceptual Uniformity</h3>

    <p>
      Lab* transforms XYZ into a perceptually uniform space using cube-root compression and opponent color axes:
    </p>

    $$
    \begin{align}
    L^* &= 116 \, f(Y/Y_n) - 16 \\
    a^* &= 500 \left[ f(X/X_n) - f(Y/Y_n) \right] \\
    b^* &= 200 \left[ f(Y/Y_n) - f(Z/Z_n) \right]
    \end{align}
    $$

    <p>Where the function $f(t)$ is defined as:</p>

    $$
    f(t) = \begin{cases}
    t^{1/3} & \text{if } t > \left(\frac{6}{29}\right)^3 \\
    \frac{1}{3}\left(\frac{29}{6}\right)^2 t + \frac{4}{29} & \text{otherwise}
    \end{cases}
    $$

    <p>And $(X_n, Y_n, Z_n)$ are the XYZ values of the reference white (usually D65).</p>

    <p><strong>What the axes mean:</strong></p>
    <ul>
      <li><mark>L* (Lightness):</mark> 0 = black, 100 = white (perceptually uniform)</li>
      <li><mark>a* (Red-Green):</mark> Negative = green, Positive = red</li>
      <li><mark>b* (Blue-Yellow):</mark> Negative = blue, Positive = yellow</li>
    </ul>

    <blockquote>
      <strong>Why This Matters:</strong> In Lab*, a ΔE (color difference) of 1.0 is approximately one Just Noticeable Difference across the entire color space. This makes it ideal for algorithmic color grading, skin tone correction, and gamut mapping. You'll see Lab* referenced again in Module 3 when we discuss color models.
    </blockquote>

    <figure class="diagram-placeholder">
      <div class="diagram-container">
        <div class="placeholder-text">
          {% include colorimetry-figure-in-development.html %}
        </div>
      </div>
      <figcaption>Figure 2.3: MacAdam Ellipses (10× magnified)—visualizing perceptual non-uniformity of CIE 1931 XYZ</figcaption>
    </figure>

  </section>

  <section id="section-2-5" class="content-section">
    <h2>2.5 The Analog Legacy: Hurter & Driffield</h2>

    <p>
      Before we finish, we must respect the chemical history that dictates our digital present.
    </p>

    <p>
      In 1890, <strong>Hurter and Driffield</strong> studied how film emulsion responds to light. They plotted <mark>Log Exposure</mark> (x-axis) against <mark>Density</mark> (y-axis), creating the <mark>Characteristic Curve</mark> (or H-D Curve).
    </p>

    <h3>The Structure of Film</h3>

    <ul>
      <li><strong>The Toe:</strong> Shadows. Gentle rolloff, low contrast</li>
      <li><strong>The Straight Line:</strong> Midtones. Linear response (in Log space)</li>
      <li><strong>The Shoulder:</strong> Highlights. Gentle rolloff, never hard-clipping</li>
    </ul>

    <h3>Why Digital Cameras use "Log"</h3>

    <p>
      When you switch your ARRI or RED camera to <mark>LogC</mark> or <mark>Log3G10</mark>, you are essentially telling the sensor to emulate a film negative.
    </p>

    <ul>
      <li>Linear sensor data is wildly inefficient (allocating thousands of code values to highlights and few to shadows)</li>
      <li>Log Encoding redistributes these values to match the <mark>Weber-Fechner Law</mark> (Module 1) and the H-D Curve, mimicking the human/film response to light</li>
    </ul>

    <blockquote>
      <strong>Critical Understanding:</strong> Digital Log is not a "flat look" for style; it is a data compression method based on 19th-century photochemistry.
    </blockquote>

    <figure class="diagram-placeholder">
      <div class="diagram-container">
        <div class="placeholder-text">
          {% include colorimetry-figure-in-development.html %}
        </div>
      </div>
      <figcaption>Figure 2.4: Hurter & Driffield Characteristic Curve—the analog foundation of digital Log encoding</figcaption>
    </figure>

    <p>
      <strong>Next Module:</strong> We tackle the most confusing pivot point in modern workflows—<mark>Scene Referred vs. Display Referred</mark>.
    </p>

  </section>

  <section class="module-references">
    <h2>References & Further Reading</h2>
    <ul>
      <li>Wright, W.D. (1928). "A re-determination of the trichromatic coefficients of the spectral colours." <em>Transactions of the Optical Society</em>, 30(4), 141-164.</li>
      <li>Guild, J. (1931). "The colorimetric properties of the spectrum." <em>Philosophical Transactions of the Royal Society A</em>, 230, 149-187.</li>
      <li>CIE (2004). <em>Colorimetry, 3rd Edition</em>. CIE Publication 15:2004. ISBN: 978-3-901906-33-6.</li>
      <li>MacAdam, D.L. (1942). "Visual Sensitivities to Color Differences in Daylight." <em>Journal of the Optical Society of America</em>, 32(5), 247-274.</li>
      <li>Hurter, F. & Driffield, V.C. (1890). "Photo-Chemical Investigations and a New Method of Determination of the Sensitiveness of Photographic Plates." <em>Journal of the Society of Chemical Industry</em>, 9(5), 455-469.</li>
      <li>Fairchild, M.D. (2013). <em>Color Appearance Models, 3rd Edition</em>. Wiley. ISBN: 978-1-119-96703-3.</li>
    </ul>
  </section>

</article>
