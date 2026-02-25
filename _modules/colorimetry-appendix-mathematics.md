---
title: "Mathematical Appendix"
series: colorimetry
slug: appendix-mathematics
permalink: /misc/colorimetry/appendix-mathematics/
description: "Comprehensive mathematical reference for all formulas used in the Modern Color Science series"
---

<header class="module-header">
  <div class="module-meta">
    <span class="module-series-badge">Colorimetry</span>
  </div>
  <h1>Mathematical Appendix</h1>
  <div class="module-header-meta">
    <span class="article-meta-separator">Reference</span>
  </div>
</header>

<article class="module-content">

  <div class="module-intro">
    <p class="lead-paragraph">
      Centralized mathematical reference for all formulas in the series.
    </p>
    <p>
      This appendix collects all mathematical formulas, matrices, and primaries from Modules 1-7 in one place for quick reference.
    </p>
  </div>

  <nav class="module-toc" aria-label="Table of contents">
    <h2 class="module-toc-title">Contents</h2>
    <ul>
      <li><a href="#colorimetry">A.1 Colorimetric Calculations</a></li>
      <li><a href="#transfer">A.2 Transfer Functions</a></li>
      <li><a href="#aces">A.3 ACES Primaries & Transforms</a></li>
      <li><a href="#camera">A.4 Camera Log Curves</a></li>
      <li><a href="#gamuts">A.5 Gamut Primaries</a></li>
    </ul>
  </nav>

  <section id="colorimetry" class="content-section">
    <h2>A.1 Colorimetric Calculations</h2>

    <h3>CIE XYZ Tristimulus Values</h3>

    <p><em>From Module 2 - The integration formula payoff</em></p>

    $$
    \begin{align}
    X &= k \int_{380}^{780} S(\lambda) \cdot R(\lambda) \cdot \bar{x}(\lambda) \, d\lambda \\
    Y &= k \int_{380}^{780} S(\lambda) \cdot R(\lambda) \cdot \bar{y}(\lambda) \, d\lambda \\
    Z &= k \int_{380}^{780} S(\lambda) \cdot R(\lambda) \cdot \bar{z}(\lambda) \, d\lambda
    \end{align}
    $$

    <p>Where:</p>
    <ul>
      <li>$S(\lambda)$ = Spectral Power Distribution of illuminant</li>
      <li>$R(\lambda)$ = Reflectance spectrum (0-1)</li>
      <li>$\bar{x}(\lambda), \bar{y}(\lambda), \bar{z}(\lambda)$ = CIE Standard Observer color matching functions</li>
      <li>$k$ = Normalizing constant: $k = 100 / \int S(\lambda) \bar{y}(\lambda) d\lambda$</li>
    </ul>

    <h3>Chromaticity Coordinates (xyY)</h3>

    $$
    x = \frac{X}{X + Y + Z}, \quad y = \frac{Y}{X + Y + Z}
    $$

    <p>The luminance $Y$ is kept separately. Together, $(x, y, Y)$ fully describes a color.</p>

    <h3>CIELAB (L*a*b*) - Perceptually Uniform Space</h3>

    $$
    \begin{align}
    L^* &= 116 \, f(Y/Y_n) - 16 \\
    a^* &= 500 \left[ f(X/X_n) - f(Y/Y_n) \right] \\
    b^* &= 200 \left[ f(Y/Y_n) - f(Z/Z_n) \right]
    \end{align}
    $$

    <p>Where the piecewise function $f(t)$ is:</p>

    $$
    f(t) = \begin{cases}
    t^{1/3} & \text{if } t > \left(\frac{6}{29}\right)^3 \\
    \frac{1}{3}\left(\frac{29}{6}\right)^2 t + \frac{4}{29} & \text{otherwise}
    \end{cases}
    $$

    <p>And $(X_n, Y_n, Z_n)$ = XYZ values of reference white (typically D65)</p>

    <p><strong>Axes:</strong></p>
    <ul>
      <li>$L^*$: Lightness (0 = black, 100 = white)</li>
      <li>$a^*$: Red-Green axis (negative = green, positive = red)</li>
      <li>$b^*$: Blue-Yellow axis (negative = blue, positive = yellow)</li>
    </ul>

  </section>

  <section id="transfer" class="content-section">
    <h2>A.2 Transfer Functions</h2>

    <h3>Gamma 2.2 (Simple Power Function)</h3>

    <p><em>From Module 3 - Display EOTF</em></p>

    $$
    V_{\text{display}} = V_{\text{encoded}}^{2.2}
    $$

    <p>Encoding (OETF): $V_{\text{encoded}} = V_{\text{linear}}^{1/2.2} \approx V_{\text{linear}}^{0.4545}$</p>

    <h3>sRGB (Piecewise Transfer Function)</h3>

    $$
    V_{\text{srgb}} = \begin{cases}
    12.92 \times V_{\text{linear}} & \text{if } V_{\text{linear}} \leq 0.0031308 \\
    1.055 \times V_{\text{linear}}^{1/2.4} - 0.055 & \text{otherwise}
    \end{cases}
    $$

    <p>Effective gamma ~2.2, with linear segment for shadow detail preservation.</p>

    <h3>ST.2084 PQ (Perceptual Quantizer for HDR)</h3>

    <p><em>From Module 3 - Absolute luminance encoding</em></p>

    $$
    V = \left( \frac{\max[(L/10000)^{m_1} - c_1, 0]}{c_2 - c_3 (L/10000)^{m_1}} \right)^{m_2}
    $$

    <p>Constants:</p>
    <ul>
      <li>$m_1 = 0.1593017578125$ (2610/16384)</li>
      <li>$m_2 = 78.84375$ (2523/32)</li>
      <li>$c_1 = 0.8359375$ (3424/4096)</li>
      <li>$c_2 = 18.8515625$ (2413/128)</li>
      <li>$c_3 = 18.6875$ (2392/128)</li>
    </ul>

    <p>$L$ = luminance in nits (cd/m²), range: 0.0001 to 10,000 nits</p>

  </section>

  <section id="aces" class="content-section">
    <h2>A.3 ACES Primaries & Transforms</h2>

    <h3>ACES 2065-1 (AP0) Primaries</h3>

    <p><em>From Module 4 - The archive space with imaginary primaries</em></p>

    <table style="margin: 1em 0; border-collapse: collapse; width: 100%;">
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
        <td style="padding: 0.5em;">White Point</td>
        <td style="padding: 0.5em; text-align: right;">0.32168 (D60)</td>
        <td style="padding: 0.5em; text-align: right;">0.33767</td>
      </tr>
    </table>

    <h3>ACEScg (AP1) Primaries</h3>

    <p><em>The working space - all real primaries</em></p>

    <table style="margin: 1em 0; border-collapse: collapse; width: 100%;">
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
        <td style="padding: 0.5em;">White Point</td>
        <td style="padding: 0.5em; text-align: right;">0.32168 (D60)</td>
        <td style="padding: 0.5em; text-align: right;">0.33767</td>
      </tr>
    </table>

    <h3>Example ARRI Alexa IDT Matrix (Conceptual)</h3>

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

    <p><em>Note: Actual IDT includes LogC decoding + chromatic adaptation D65→D60</em></p>

  </section>

  <section id="camera" class="content-section">
    <h2>A.4 Camera Log Curves</h2>

    <h3>LogC3 (ARRI - Classic Curve)</h3>

    <p><em>From Module 6 - For ARRI Wide Gamut 3</em></p>

    $$
    y = \begin{cases}
    5.555556 \times x + 0.052272 & \text{if } x < 0.010591 \\
    0.247190 \times \log_{10}(5.555556 \times x + 0.047996) + 0.385537 & \text{otherwise}
    \end{cases}
    $$

    <ul>
      <li>$x$ = scene linear exposure (normalized 0-1)</li>
      <li>$y$ = LogC3 code value (0-1)</li>
      <li>Middle Grey (18%) → $y = 0.39$ (39%)</li>
      <li>Dynamic range: ~14 stops</li>
    </ul>

    <h3>LogC4 (ARRI Alexa 35)</h3>

    $$
    y = \begin{cases}
    (x - 0.0011361) / 0.068512 & \text{if } x < 0.0059569 \\
    0.27861 \times \log_{10}(x \times 10.6723 + 1) + 0.33122 & \text{otherwise}
    \end{cases}
    $$

    <ul>
      <li>Middle Grey (18%) → $y = 0.32$ (32%)</li>
      <li>Dynamic range: ~17 stops</li>
      <li>Shift from 39% to 32% creates room for 2.5 extra highlight stops</li>
    </ul>

    <h3>Log3G10 (RED IPP2)</h3>

    $$
    y = \begin{cases}
    15.1927 \times x & \text{if } x < -0.01 \\
    0.224282 \times \log_{10}(x + 0.01) + 0.444666 & \text{otherwise}
    \end{cases}
    $$

    <ul>
      <li>$x$ = scene linear exposure</li>
      <li>$y$ = Log3G10 code value (0-1)</li>
      <li>"3G10" = 3 stops below middle grey, 10 above = 13 stops total</li>
      <li>Simpler structure than LogC for cleaner ACES transforms</li>
    </ul>

  </section>

  <section id="gamuts" class="content-section">
    <h2>A.5 Camera & Display Gamut Primaries</h2>

    <h3>Camera Gamuts</h3>

    <table style="margin: 1em 0; border-collapse: collapse; width: 100%;">
      <tr style="border-bottom: 2px solid var(--color-border);">
        <th style="padding: 0.5em; text-align: left;">Gamut</th>
        <th style="padding: 0.5em; text-align: center;">Red (x, y)</th>
        <th style="padding: 0.5em; text-align: center;">Green (x, y)</th>
        <th style="padding: 0.5em; text-align: center;">Blue (x, y)</th>
        <th style="padding: 0.5em; text-align: center;">White</th>
      </tr>
      <tr>
        <td style="padding: 0.5em;">ARRI Wide Gamut 3</td>
        <td style="padding: 0.5em; text-align: center;">(0.6840, 0.3130)</td>
        <td style="padding: 0.5em; text-align: center;">(0.2210, 0.8480)</td>
        <td style="padding: 0.5em; text-align: center;">(0.0861, -0.1020)</td>
        <td style="padding: 0.5em; text-align: center;">D65</td>
      </tr>
      <tr>
        <td style="padding: 0.5em;">REDWideGamutRGB</td>
        <td style="padding: 0.5em; text-align: center;">(0.7803, 0.3043)</td>
        <td style="padding: 0.5em; text-align: center;">(0.1216, 1.4940)</td>
        <td style="padding: 0.5em; text-align: center;">(0.0956, -0.0846)</td>
        <td style="padding: 0.5em; text-align: center;">D65</td>
      </tr>
      <tr>
        <td style="padding: 0.5em;">S-Gamut3.Cine (Sony)</td>
        <td style="padding: 0.5em; text-align: center;">(0.766, 0.275)</td>
        <td style="padding: 0.5em; text-align: center;">(0.225, 0.800)</td>
        <td style="padding: 0.5em; text-align: center;">(0.089, -0.087)</td>
        <td style="padding: 0.5em; text-align: center;">D65</td>
      </tr>
    </table>

    <h3>Display Gamuts</h3>

    <table style="margin: 1em 0; border-collapse: collapse; width: 100%;">
      <tr style="border-bottom: 2px solid var(--color-border);">
        <th style="padding: 0.5em; text-align: left;">Gamut</th>
        <th style="padding: 0.5em; text-align: center;">Red (x, y)</th>
        <th style="padding: 0.5em; text-align: center;">Green (x, y)</th>
        <th style="padding: 0.5em; text-align: center;">Blue (x, y)</th>
        <th style="padding: 0.5em; text-align: center;">White</th>
      </tr>
      <tr>
        <td style="padding: 0.5em;">Rec.709 / sRGB</td>
        <td style="padding: 0.5em; text-align: center;">(0.640, 0.330)</td>
        <td style="padding: 0.5em; text-align: center;">(0.300, 0.600)</td>
        <td style="padding: 0.5em; text-align: center;">(0.150, 0.060)</td>
        <td style="padding: 0.5em; text-align: center;">D65</td>
      </tr>
      <tr>
        <td style="padding: 0.5em;">DCI-P3</td>
        <td style="padding: 0.5em; text-align: center;">(0.680, 0.320)</td>
        <td style="padding: 0.5em; text-align: center;">(0.265, 0.690)</td>
        <td style="padding: 0.5em; text-align: center;">(0.150, 0.060)</td>
        <td style="padding: 0.5em; text-align: center;">DCI (0.314, 0.351)</td>
      </tr>
      <tr>
        <td style="padding: 0.5em;">Rec.2020</td>
        <td style="padding: 0.5em; text-align: center;">(0.708, 0.292)</td>
        <td style="padding: 0.5em; text-align: center;">(0.170, 0.797)</td>
        <td style="padding: 0.5em; text-align: center;">(0.131, 0.046)</td>
        <td style="padding: 0.5em; text-align: center;">D65</td>
      </tr>
    </table>

  </section>

  <section class="module-references">
    <h2>Additional Resources</h2>
    <ul>
      <li>CIE (2004). <em>Colorimetry, 3rd Edition</em>. CIE Publication 15:2004.</li>
      <li>Poynton, C. (2012). <em>Digital Video and HDTV: Algorithms and Interfaces</em>, 2nd Ed. Morgan Kaufmann.</li>
      <li>SMPTE Standards Collection: ST.2065-1 (ACES), ST.2084 (PQ), ST.2067 series</li>
      <li>ITU-R Recommendations: BT.709, BT.2020, BT.2100</li>
      <li>ARRI, RED, and Sony technical documentation (referenced in Module 6)</li>
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
  </div>
</nav>
