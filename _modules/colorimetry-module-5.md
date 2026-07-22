---
title: "Module 5: The Display Ecosystem"
short_title: "The Display Ecosystem"
series: colorimetry
module_number: 5
slug: module-5
permalink: /notes/colorimetry/module-5/
date: 2025-12-10
description: "HDR standards (PQ/HLG), viewing environment effects, and system color management across platforms."
---

"The image does not exist until it hits the screen."

In Module 4, we built a standardized pipeline with <mark>ACES</mark>. But eventually, that data has to leave the pipeline and turn into photons.

This is where things get complicated again. We are entering the world of <mark>Display Colorimetry</mark>, where we have to deal with competing <mark>HDR</mark> standards, the physics of viewing environments, and the unpredictable behavior of operating systems (looking at you, macOS).

## 5.1 The HDR Landscape: PQ vs. HLG
{: #section-5-1}

<mark>High Dynamic Range (HDR)</mark> is not just "brighter." It changes how a signal is mapped to light. PQ and HLG are two widely used transfer systems with different design goals.

### A. Perceptual Quantizer (PQ / ST.2084)

- **Philosophy:** <mark>Absolute Luminance</mark>.
- **The Logic:** A code value in <mark>PQ</mark> corresponds to a specific number of <mark>Nits (cd/m²)</mark>.
  - Code Value <mark>0.508 ≈ 100 nits</mark>.
  - Code Value <mark>0.752 ≈ 1,000 nits</mark>.
- **The "Container":** The container is always <mark>0 to 10,000 nits</mark>.
- **Pros:** It carries an absolute luminance target through the mastering signal.
- **Limit:** If a display cannot reproduce that target, its tone-mapping behavior can change the result.
- **Used By:** <mark>Dolby Vision</mark>, <mark>HDR10</mark>, Cinema.

### B. Hybrid Log-Gamma (HLG)

- **Philosophy:** <mark>Relative Luminance</mark>.
- **The Logic:** It uses a relative signal and a display-dependent system gamma, rather than assigning one fixed luminance to each code value.
- **The "Container":** Its display behavior adapts to the target environment; monitoring and display transforms still matter.
- **Pros:** It can support an HDR production path while retaining a practical SDR compatibility story.
- **Limit:** The same signal can look different across display capabilities and viewing conditions.
- **Used By:** Broadcast (<mark>BBC/NHK</mark>), Live Sports, YouTube HDR.

<figure class="diagram-placeholder">
  <div class="diagram-container">
    <div class="placeholder-text">
      {% include colorimetry-figure-in-development.html %}
    </div>
  </div>
  <figcaption>Figure 5.1: PQ vs HLG transfer functions—absolute vs relative luminance encoding</figcaption>
</figure>

## 5.2 Viewing Environment & Perception
{: #section-5-2}

You cannot grade in a vacuum. The room you are sitting in changes the contrast you see on screen.

### The Bartleson-Breneman Effect

- **The Law:** A dark surround lowers the perceived contrast of an image.
- **The Fix:** If you view an image in a dark room (Cinema), you must boost the gamma of the display to make it look "normal."
  - **Cinema (Dark):** <mark>Gamma 2.6</mark>.
  - **Mastering Suite (Dim):** <mark>Gamma 2.4</mark> (<mark>BT.1886</mark>).
  - **Office/Web (Bright):** <mark>Gamma 2.2</mark> (<mark>sRGB</mark>).
- **Why this matters:** If you grade a commercial in a dark suite (Gamma 2.4) and watch it on a phone in daylight (Gamma 2.2), the shadows will look lifted and washed out. This isn't an error; it's the <mark>Bartleson-Breneman</mark> compensation at work.

### The Crispening Effect

- **The Phenomenon:** The eye is hypersensitive to color differences when the background is similar to the sample.
- **Example:** A grey square on a grey background looks "crisper" (more contrasty) than the same grey square on a white background.
- **DIT Application:** This is why UI designers hate "Grey on Grey" interfaces, and why colorists use <mark>Middle Grey</mark> surrounds in their GUI to keep their vision neutral.

<figure class="diagram-placeholder">
  <div class="diagram-container">
    <div class="placeholder-text">
      {% include colorimetry-figure-in-development.html %}
    </div>
  </div>
  <figcaption>Figure 5.2: Bartleson-Breneman effect—how viewing environment affects perceived contrast</figcaption>
</figure>

## 5.3 System Color Management: The OS Layer
{: #section-5-3}

Even if your file is perfect, the Operating System (OS) can ruin it.

### Apple EDR (Extended Dynamic Range)

If you work on a modern MacBook Pro or Pro Display XDR, you are using <mark>EDR</mark>.

- **Concept:** EDR is not a fixed mode; it is dynamic.
- **Headroom:** macOS defines "<mark>SDR White</mark>" (100-200 nits) as the baseline. Any brightness capability the screen has above that is called <mark>Headroom</mark>.
- **How it works:** You can have an SDR desktop window open next to an HDR video window. macOS allocates the "Headroom" pixels only to the HDR video, blasting them at 1,000+ nits, while keeping your email client at a comfortable 100 nits.
- **The Danger:** If you are grading in a windowed viewer, you might not be seeing true HDR if the OS has decided to limit Headroom to save battery or because the ambient light sensor triggered a dimming event. Always use a dedicated I/O breakout box (Blackmagic/AJA) for critical reference.

### The QuickTime Gamma Shift (NCLC Tags)

The most common question in forums: "Why does my render look washed out in QuickTime?"

- **The Cause:** Apple's <mark>ColorSync</mark> utility reads the <mark>NCLC tags</mark> (metadata) in your video file.
  - <mark>1-1-1 (Rec.709):</mark> Apple interprets this as <mark>Gamma 1.96</mark> (the old specific gamma of an Apple CRT from the 90s). It lifts the shadows.
  - <mark>1-2-1 (Rec.709 Gamma 2.4):</mark> Apple interprets this correctly as Gamma 2.4.
- **The Fix:** In DaVinci Resolve, you must manually tag your export as <mark>Rec.709-A</mark> (which forces the 1-1-1 tag but pre-distorts the gamma to look correct) OR accept that QuickTime is essentially a "Bright Environment" simulator and shouldn't be trusted for critical black-level checks.

> **Critical Takeaway:** The <mark>QuickTime Gamma Shift</mark> is not a bug—it's a feature designed for Apple's historical viewing environment assumptions. Always verify your exports on calibrated reference monitors via hardware I/O.

<figure class="diagram-placeholder">
  <div class="diagram-container">
    <div class="placeholder-text">
      {% include colorimetry-figure-in-development.html %}
    </div>
  </div>
  <figcaption>Figure 5.3: QuickTime gamma shift—NCLC tag interpretation and workarounds</figcaption>
</figure>

**Next Module:** We analyze the specific color pipelines of the titans: <mark>ARRI</mark>, <mark>RED</mark>, and the raw mechanics of sensors.

## References & Further Reading
- SMPTE ST 2084:2014. *High Dynamic Range Electro-Optical Transfer Function of Mastering Reference Displays*.
- ITU-R Recommendation BT.2100-2 (2018). *Image parameter values for high dynamic range television for use in production and international programme exchange*.
- ARIB STD-B67 (2015). *Essential Parameter Values for the Extended Image Dynamic Range Television (EIDRTV) System for Programme Production* (HLG standard).
- Bartleson, C.J. & Breneman, E.J. (1967). "Brightness perception in complex fields." *Journal of the Optical Society of America*, 57(7), 953-957.
- Apple Inc. (2021). *Extended Dynamic Range (EDR) on macOS*. Developer Documentation.
- Dolby Laboratories (2020). *Dolby Vision - Principles and Technologies*. White Paper Version 3.1.
