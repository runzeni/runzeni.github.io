---
title: "Mathematical Appendix"
series: colorimetry
slug: appendix-mathematics
permalink: /notes/colorimetry/appendix-mathematics/
description: "Comprehensive mathematical reference for all formulas used in the Modern Color Science series"
math: true
---

Centralized mathematical reference for all formulas in the series.

This appendix collects all mathematical formulas, matrices, and primaries from Modules 1-7 in one place for quick reference.

## A.1 Colorimetric Calculations
{: #colorimetry}

### CIE XYZ Tristimulus Values

*From Module 2 - The integration formula payoff*

$$
\begin{align}
X &= k \int_{380}^{780} S(\lambda) \cdot R(\lambda) \cdot \bar{x}(\lambda) \, d\lambda \\
Y &= k \int_{380}^{780} S(\lambda) \cdot R(\lambda) \cdot \bar{y}(\lambda) \, d\lambda \\
Z &= k \int_{380}^{780} S(\lambda) \cdot R(\lambda) \cdot \bar{z}(\lambda) \, d\lambda
\end{align}
$$

Where:

- $S(\lambda)$ = Spectral Power Distribution of illuminant
- $R(\lambda)$ = Reflectance spectrum (0-1)
- $\bar{x}(\lambda), \bar{y}(\lambda), \bar{z}(\lambda)$ = CIE Standard Observer color matching functions
- $k$ = Normalizing constant: $k = 100 / \int S(\lambda) \bar{y}(\lambda) d\lambda$

### Chromaticity Coordinates (xyY)

$$
x = \frac{X}{X + Y + Z}, \quad y = \frac{Y}{X + Y + Z}
$$

The luminance $Y$ is kept separately. Together, $(x, y, Y)$ fully describes a color.

### CIELAB (L*a*b*) - Perceptually Uniform Space

$$
\begin{align}
L^* &= 116 \, f(Y/Y_n) - 16 \\
a^* &= 500 \left[ f(X/X_n) - f(Y/Y_n) \right] \\
b^* &= 200 \left[ f(Y/Y_n) - f(Z/Z_n) \right]
\end{align}
$$

Where the piecewise function $f(t)$ is:

$$
f(t) = \begin{cases}
t^{1/3} & \text{if } t > \left(\frac{6}{29}\right)^3 \\
\frac{1}{3}\left(\frac{29}{6}\right)^2 t + \frac{4}{29} & \text{otherwise}
\end{cases}
$$

And $(X_n, Y_n, Z_n)$ = XYZ values of reference white (typically D65)

**Axes:**

- $L^*$: Lightness (0 = black, 100 = white)
- $a^*$: Red-Green axis (negative = green, positive = red)
- $b^*$: Blue-Yellow axis (negative = blue, positive = yellow)

## A.2 Transfer Functions
{: #transfer}

### Gamma 2.2 (Simple Power Function)

*From Module 3 - Display EOTF*

$$
V_{\text{display}} = V_{\text{encoded}}^{2.2}
$$

Encoding (OETF): $V_{\text{encoded}} = V_{\text{linear}}^{1/2.2} \approx V_{\text{linear}}^{0.4545}$

### sRGB (Piecewise Transfer Function)

$$
V_{\text{srgb}} = \begin{cases}
12.92 \times V_{\text{linear}} & \text{if } V_{\text{linear}} \leq 0.0031308 \\
1.055 \times V_{\text{linear}}^{1/2.4} - 0.055 & \text{otherwise}
\end{cases}
$$

Effective gamma ~2.2, with linear segment for shadow detail preservation.

### ST.2084 PQ (Perceptual Quantizer for HDR)

*From Module 3 - Absolute luminance encoding*

$$
V = \left( \frac{\max[(L/10000)^{m_1} - c_1, 0]}{c_2 - c_3 (L/10000)^{m_1}} \right)^{m_2}
$$

Constants:

- $m_1 = 0.1593017578125$ (2610/16384)
- $m_2 = 78.84375$ (2523/32)
- $c_1 = 0.8359375$ (3424/4096)
- $c_2 = 18.8515625$ (2413/128)
- $c_3 = 18.6875$ (2392/128)

$L$ = luminance in nits (cd/m²), range: 0.0001 to 10,000 nits

## A.3 ACES Primaries & Transforms
{: #aces}

### ACES 2065-1 (AP0) Primaries

*From Module 4 - The archive space with imaginary primaries*

| Primary | x | y |
| --- | --- | --- |
| Red | 0.7347 | 0.2653 |
| Green | 0.0000 | 1.0000 |
| Blue | 0.0001 | -0.0770 |
| White Point | 0.32168 (D60) | 0.33767 |

### ACEScg (AP1) Primaries

*The working space - all real primaries*

| Primary | x | y |
| --- | --- | --- |
| Red | 0.713 | 0.293 |
| Green | 0.165 | 0.830 |
| Blue | 0.128 | 0.044 |
| White Point | 0.32168 (D60) | 0.33767 |

### Example ARRI Alexa IDT Matrix (Conceptual)

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

*Note: Actual IDT includes LogC decoding + chromatic adaptation D65→D60*

## A.4 Camera Log Curves
{: #camera}

### LogC3 (ARRI - Classic Curve)

*From Module 6 - For ARRI Wide Gamut 3*

$$
y = \begin{cases}
5.555556 \times x + 0.052272 & \text{if } x < 0.010591 \\
0.247190 \times \log_{10}(5.555556 \times x + 0.047996) + 0.385537 & \text{otherwise}
\end{cases}
$$

- $x$ = scene linear exposure (normalized 0-1)
- $y$ = LogC3 code value (0-1)
- Middle Grey (18%) → $y = 0.39$ (39%)
- Dynamic range: ~14 stops

### LogC4 (ARRI Alexa 35)

$$
y = \begin{cases}
(x - 0.0011361) / 0.068512 & \text{if } x < 0.0059569 \\
0.27861 \times \log_{10}(x \times 10.6723 + 1) + 0.33122 & \text{otherwise}
\end{cases}
$$

- Middle Grey (18%) → $y = 0.32$ (32%)
- Dynamic range: ~17 stops
- Shift from 39% to 32% creates room for 2.5 extra highlight stops

### Log3G10 (RED IPP2)

$$
y = \begin{cases}
15.1927 \times x & \text{if } x < -0.01 \\
0.224282 \times \log_{10}(x + 0.01) + 0.444666 & \text{otherwise}
\end{cases}
$$

- $x$ = scene linear exposure
- $y$ = Log3G10 code value (0-1)
- "3G10" = 3 stops below middle grey, 10 above = 13 stops total
- Simpler structure than LogC for cleaner ACES transforms

## A.5 Camera & Display Gamut Primaries
{: #gamuts}

### Camera Gamuts

| Gamut | Red (x, y) | Green (x, y) | Blue (x, y) | White |
| --- | --- | --- | --- | --- |
| ARRI Wide Gamut 3 | (0.6840, 0.3130) | (0.2210, 0.8480) | (0.0861, -0.1020) | D65 |
| REDWideGamutRGB | (0.7803, 0.3043) | (0.1216, 1.4940) | (0.0956, -0.0846) | D65 |
| S-Gamut3.Cine (Sony) | (0.766, 0.275) | (0.225, 0.800) | (0.089, -0.087) | D65 |

### Display Gamuts

| Gamut | Red (x, y) | Green (x, y) | Blue (x, y) | White |
| --- | --- | --- | --- | --- |
| Rec.709 / sRGB | (0.640, 0.330) | (0.300, 0.600) | (0.150, 0.060) | D65 |
| DCI-P3 | (0.680, 0.320) | (0.265, 0.690) | (0.150, 0.060) | DCI (0.314, 0.351) |
| Rec.2020 | (0.708, 0.292) | (0.170, 0.797) | (0.131, 0.046) | D65 |

## Additional Resources
- CIE (2004). *Colorimetry, 3rd Edition*. CIE Publication 15:2004.
- Poynton, C. (2012). *Digital Video and HDTV: Algorithms and Interfaces*, 2nd Ed. Morgan Kaufmann.
- SMPTE Standards Collection: ST.2065-1 (ACES), ST.2084 (PQ), ST.2067 series
- ITU-R Recommendations: BT.709, BT.2020, BT.2100
- ARRI, RED, and Sony technical documentation (referenced in Module 6)
