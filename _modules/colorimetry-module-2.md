---
title: "Module 2: Measuring Color (History & Standards)"
short_title: "Measuring Color (History & Standards)"
series: colorimetry
module_number: 2
slug: module-2
permalink: /notes/colorimetry/module-2/
date: 2025-12-10
description: "From early color-matching experiments to the CIE 1931 XYZ standard, perceptual uniformity, and the analog legacy of film."
math: true
---

"If you can't measure it, you can't manage it."

In Module 1, we learned that human vision is a chaotic mix of overlapping cone sensitivities, logarithmic processing, and psychological auto-corrections.

This created a massive problem for scientists in the early 20th century. If I say "Coca-Cola Red" and you say "Ferrari Red," how do we know if we are talking about the same color? We needed a ruler for color.

This module traces the journey from guesswork to the <mark>CIE 1931 XYZ</mark> system—the grandfather of all digital color management.

## 2.1 A History of Guesswork
{: #section-2-1}

Before we had math, we had swatches.

### The Munsell System (1905)

Albert Munsell, an artist, was the first to organize color into a 3D solid based on how humans actually see it. He defined three axes:

- **Hue:** The color itself (Red, Blue, etc.)
- **Value:** Lightness (Black to White)
- **Chroma:** Saturation (purity)

Munsell is still used today (it's why we say "skin tone is near <mark>5YR</mark>"), but it had a fatal flaw: it was physical. You had to buy a book of painted chips. If the paint faded, your standard was gone. We needed numbers, not paint.

<figure class="diagram-placeholder">
  <div class="diagram-container">
    <div class="placeholder-text">
      {% include colorimetry-figure-in-development.html %}
    </div>
  </div>
  <figcaption>Figure 2.0: Munsell Color Solid—the first perceptually-organized 3D color space</figcaption>
</figure>

## 2.2 The Wright-Guild Experiments (1920s)
{: #section-2-2}

In the late 1920s, two researchers—**W.D. Wright** and **John Guild**—independently ran experiments to quantify human vision. They didn't use brain scans; they used a game.

### The Setup

They built a device with a split screen (a <mark>bipartite field</mark>).

- **Left Side:** A test color (a pure spectral wavelength, e.g., 500nm Cyan)
- **Right Side:** Three primary lights (Red, Green, Blue) that the observer could mix

**The task:** "Turn the knobs on the RGB lights until the Right side matches the Left side perfectly."

They repeated this for every wavelength in the visible spectrum with multiple observers.

<figure class="diagram-placeholder">
  <div class="diagram-container">
    <div class="placeholder-text">
      {% include colorimetry-figure-in-development.html %}
    </div>
  </div>
  <figcaption>Figure 2.1: Wright-Guild experimental setup—color matching with three primaries</figcaption>
</figure>

### The "Negative Light" Problem

They hit a wall. When trying to match a pure Cyan (around 500nm), observers couldn't do it. The Red light in the mix desaturated the result too much. It was physically impossible to match.

To solve this, they allowed observers to add Red light to the *Left* side (the test side). Mathematically, this is the same as having <mark>Negative Red</mark> on the Right side.

$$
\text{Cyan} = \text{Green} + \text{Blue} - \text{Red}
$$

> **Critical Insight:** This proved that no set of three physical RGB primaries can create all the colors humans can see. There will always be "Out of Gamut" colors.

## 2.3 The Holy Grail: CIE 1931 XYZ
{: #section-2-3}

In 1931, the <mark>CIE</mark> (International Commission on Illumination) took the Wright-Guild data and made a radical decision. Negative numbers are annoying for engineers. So, they performed a matrix transformation to create a new, theoretical color space called <mark>CIE XYZ</mark>.

### The "Imaginary" Primaries

X, Y, and Z are not real lights. You cannot build an "X" LED. They are mathematical abstractions designed to have specific properties:

- **No Negatives:** All visible colors have positive XYZ values
- **Y = Luminance:** They deliberately aligned the "Y" axis to match the human brightness sensitivity curve ($V(\lambda)$). This means <mark>Y is brightness</mark>, while X and Z contain the color information.

### Computing XYZ: From Theory to Practice

**Remember the integration formula from Module 1?** This is where it becomes real. To calculate the XYZ tristimulus values for any color, we use:

$$
\begin{align}
X &= k \int_{380}^{780} S(\lambda) \cdot R(\lambda) \cdot \bar{x}(\lambda) \, d\lambda \\
Y &= k \int_{380}^{780} S(\lambda) \cdot R(\lambda) \cdot \bar{y}(\lambda) \, d\lambda \\
Z &= k \int_{380}^{780} S(\lambda) \cdot R(\lambda) \cdot \bar{z}(\lambda) \, d\lambda
\end{align}
$$

Where:

- $S(\lambda)$ = Spectral Power Distribution of the light source (e.g., D65, tungsten)
- $R(\lambda)$ = Reflectance spectrum of the object (0-1 at each wavelength)
- $\bar{x}(\lambda), \bar{y}(\lambda), \bar{z}(\lambda)$ = <mark>CIE Standard Observer</mark> color matching functions
- $k$ = Normalizing constant: $k = 100 / \int S(\lambda) \bar{y}(\lambda) d\lambda$

> **Critical Connection:** The CIE color matching functions ($\bar{x}, \bar{y}, \bar{z}$) replaced the biological LMS cone sensitivities from Module 1. They are mathematically derived from the Wright-Guild RGB data, transformed to eliminate negative values. This is the "imaginary observer" that defines all modern colorimetry.

Once you have XYZ, you can convert to <mark>chromaticity coordinates</mark> (x, y) to plot on the horseshoe diagram:

$$
x = \frac{X}{X + Y + Z}, \quad y = \frac{Y}{X + Y + Z}
$$

The luminance Y is kept separately. Together, $(x, y, Y)$ fully describes a color: $(x, y)$ tells you the hue and saturation, $Y$ tells you the brightness.

### The Chromaticity Diagram (The Horseshoe)

If we ignore brightness (Y) and just look at color ($x$ and $y$), we get the famous <mark>CIE 1931 Chromaticity Diagram</mark>.

- **The Spectral Locus:** The curved edge representing pure, monochromatic light (lasers)
- **The Purple Line:** The straight bottom edge connecting Blue (380nm) and Red (700nm). These colors do not exist in the rainbow; they only exist in our brain when Red and Blue cones are stimulated simultaneously.
- **The White Point:** The center where <mark>x=0.33, y=0.33</mark>

> **Key Takeaway:** Any triangle drawn inside this horseshoe represents a <mark>Gamut</mark> (like Rec.709 or DCI-P3). If a color falls outside your triangle, your monitor cannot display it.

<figure class="diagram-placeholder">
  <div class="diagram-container">
    <div class="placeholder-text">
      {% include colorimetry-figure-in-development.html %}
    </div>
  </div>
  <figcaption>Figure 2.2: CIE 1931 xy Chromaticity Diagram—the horseshoe that defines all visible colors</figcaption>
</figure>

## 2.4 The Flaw: Perceptual Uniformity
{: #section-2-4}

CIE 1931 XYZ is mathematically perfect but perceptually broken. It is <mark>Non-Uniform</mark>.

### MacAdam Ellipses (1942)

David MacAdam tested how much you could change a color before a human noticed. He plotted these <mark>Just Noticeable Differences (JNDs)</mark> on the chart.

- **The Result:** The ellipses are tiny in the Blue region but huge in the Green region
- **The Meaning:** You can change Green a lot before anyone notices, but a tiny shift in Blue is obvious. This makes XYZ bad for grading interfaces because the controls feel inconsistent.

This led to <mark>CIELAB (L*a*b*)</mark> in 1976, which warped the space to make the ellipses circular (uniform). This is why grading tools (like DaVinci Resolve's Warper) often work in Lab* math under the hood.

### The Lab* Solution: Perceptual Uniformity

Lab* transforms XYZ into a perceptually uniform space using cube-root compression and opponent color axes:

$$
\begin{align}
L^* &= 116 \, f(Y/Y_n) - 16 \\
a^* &= 500 \left[ f(X/X_n) - f(Y/Y_n) \right] \\
b^* &= 200 \left[ f(Y/Y_n) - f(Z/Z_n) \right]
\end{align}
$$

Where the function $f(t)$ is defined as:

$$
f(t) = \begin{cases}
t^{1/3} & \text{if } t > \left(\frac{6}{29}\right)^3 \\
\frac{1}{3}\left(\frac{29}{6}\right)^2 t + \frac{4}{29} & \text{otherwise}
\end{cases}
$$

And $(X_n, Y_n, Z_n)$ are the XYZ values of the reference white (usually D65).

**What the axes mean:**

- <mark>L* (Lightness):</mark> 0 = black, 100 = white (perceptually uniform)
- <mark>a* (Red-Green):</mark> Negative = green, Positive = red
- <mark>b* (Blue-Yellow):</mark> Negative = blue, Positive = yellow

> **Why This Matters:** In Lab*, a ΔE (color difference) of 1.0 is approximately one Just Noticeable Difference across the entire color space. This makes it ideal for algorithmic color grading, skin tone correction, and gamut mapping. You'll see Lab* referenced again in Module 3 when we discuss color models.

<figure class="diagram-placeholder">
  <div class="diagram-container">
    <div class="placeholder-text">
      {% include colorimetry-figure-in-development.html %}
    </div>
  </div>
  <figcaption>Figure 2.3: MacAdam Ellipses (10× magnified)—visualizing perceptual non-uniformity of CIE 1931 XYZ</figcaption>
</figure>

## 2.5 The Analog Legacy: Hurter & Driffield
{: #section-2-5}

Before we finish, we must respect the chemical history that dictates our digital present.

In 1890, **Hurter and Driffield** studied how film emulsion responds to light. They plotted <mark>Log Exposure</mark> (x-axis) against <mark>Density</mark> (y-axis), creating the <mark>Characteristic Curve</mark> (or H-D Curve).

### The Structure of Film

- **The Toe:** Shadows. Gentle rolloff, low contrast
- **The Straight Line:** Midtones. Linear response (in Log space)
- **The Shoulder:** Highlights. Gentle rolloff, never hard-clipping

### Why Digital Cameras use "Log"

When you switch your ARRI or RED camera to <mark>LogC</mark> or <mark>Log3G10</mark>, you are essentially telling the sensor to emulate a film negative.

- Linear sensor data is wildly inefficient (allocating thousands of code values to highlights and few to shadows)
- Log Encoding redistributes these values to match the <mark>Weber-Fechner Law</mark> (Module 1) and the H-D Curve, mimicking the human/film response to light

> **Critical Understanding:** Digital Log is not a "flat look" for style; it is a data compression method based on 19th-century photochemistry.

<figure class="diagram-placeholder">
  <div class="diagram-container">
    <div class="placeholder-text">
      {% include colorimetry-figure-in-development.html %}
    </div>
  </div>
  <figcaption>Figure 2.4: Hurter & Driffield Characteristic Curve—the analog foundation of digital Log encoding</figcaption>
</figure>

**Next Module:** We tackle the most confusing pivot point in modern workflows—<mark>Scene Referred vs. Display Referred</mark>.

## References & Further Reading
- Wright, W.D. (1928). "A re-determination of the trichromatic coefficients of the spectral colours." *Transactions of the Optical Society*, 30(4), 141-164.
- Guild, J. (1931). "The colorimetric properties of the spectrum." *Philosophical Transactions of the Royal Society A*, 230, 149-187.
- CIE (2004). *Colorimetry, 3rd Edition*. CIE Publication 15:2004. ISBN: 978-3-901906-33-6.
- MacAdam, D.L. (1942). "Visual Sensitivities to Color Differences in Daylight." *Journal of the Optical Society of America*, 32(5), 247-274.
- Hurter, F. & Driffield, V.C. (1890). "Photo-Chemical Investigations and a New Method of Determination of the Sensitiveness of Photographic Plates." *Journal of the Society of Chemical Industry*, 9(5), 455-469.
- Fairchild, M.D. (2013). *Color Appearance Models, 3rd Edition*. Wiley. ISBN: 978-1-119-96703-3.
