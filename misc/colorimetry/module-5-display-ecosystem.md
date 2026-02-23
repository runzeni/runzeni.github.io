---
title: "Module 5: The Display Ecosystem"
breadcrumb_title: Module 5
permalink: /misc/colorimetry/module-5/
layout: default
series: colorimetry
module_number: 5
prev_module: /misc/colorimetry/module-4/
next_module: /misc/colorimetry/module-6/
reading_time: 10
date: 2025-12-10
description: "The image does not exist until it hits the screen. Understanding HDR standards (PQ/HLG), viewing environment effects, and system color management."
---

<header class="module-header">
  <div class="module-meta">
    <span class="module-series-badge">Colorimetry Series</span>
    <span class="module-number-badge">Module 5 of 7</span>
  </div>
  <h1>The Display Ecosystem</h1>
  <div class="module-header-meta">
    <span class="module-reading-time">~10 min read</span>
    <span class="article-meta-separator">•</span>
    <span class="module-date">December 2025</span>
  </div>
</header>

<article class="module-content">

  <div class="module-intro">
    <p class="lead-paragraph">
      "The image does not exist until it hits the screen."
    </p>
    <p>
      In Module 4, we built a standardized pipeline with <mark>ACES</mark>. But eventually, that data has to leave the pipeline and turn into photons.
    </p>
    <p>
      This is where things get complicated again. We are entering the world of <mark>Display Colorimetry</mark>, where we have to deal with competing <mark>HDR</mark> standards, the physics of viewing environments, and the unpredictable behavior of operating systems (looking at you, macOS).
    </p>
  </div>

  <nav class="module-toc" aria-label="Table of contents">
    <h2 class="module-toc-title">In This Module</h2>
    <ul>
      <li><a href="#section-5-1">5.1 The HDR Landscape</a></li>
      <li><a href="#section-5-2">5.2 Viewing Environment & Perception</a></li>
      <li><a href="#section-5-3">5.3 System Color Management</a></li>
    </ul>
  </nav>

  <section id="section-5-1" class="content-section">
    <h2>5.1 The HDR Landscape: PQ vs. HLG</h2>

    <p>
      <mark>High Dynamic Range (HDR)</mark> is not just "brighter." It is a fundamental shift in how we map signal to light. There are two competing standards, and they work on completely different philosophies.
    </p>

    <h3>A. Perceptual Quantizer (PQ / ST.2084)</h3>

    <ul>
      <li><strong>Philosophy:</strong> <mark>Absolute Luminance</mark>.</li>
      <li><strong>The Logic:</strong> A code value in <mark>PQ</mark> corresponds to a specific number of <mark>Nits (cd/m²)</mark>.
        <ul>
          <li>Code Value <mark>0.51 = Exactly 100 nits</mark>.</li>
          <li>Code Value <mark>0.75 = Exactly 1,000 nits</mark>.</li>
        </ul>
      </li>
      <li><strong>The "Container":</strong> The container is always <mark>0 to 10,000 nits</mark>.</li>
      <li><strong>Pros:</strong> It preserves the artistic intent perfectly. If you graded a lamp at 500 nits, it will play at 500 nits on any PQ TV.</li>
      <li><strong>Cons:</strong> If the TV cannot reach 500 nits, it must "<mark>Tone Map</mark>" (clip or roll off) the signal. The TV makes a guess, which can change the look.</li>
      <li><strong>Used By:</strong> <mark>Dolby Vision</mark>, <mark>HDR10</mark>, Cinema.</li>
    </ul>

    <h3>B. Hybrid Log-Gamma (HLG)</h3>

    <ul>
      <li><strong>Philosophy:</strong> <mark>Relative Luminance</mark>.</li>
      <li><strong>The Logic:</strong> It works like traditional SDR gamma. The signal is a percentage of the display's peak capability.
        <ul>
          <li>Code Value <mark>0.5 = "50% of whatever this TV can do."</mark></li>
        </ul>
      </li>
      <li><strong>The "Container":</strong> It is "stretchy." On a 1,000 nit TV, the image is bright. On a 300 nit TV, the image is dimmer, but nothing is clipped.</li>
      <li><strong>Pros:</strong> Backwards compatible with SDR TVs. No tone mapping required (the display just shows what it can).</li>
      <li><strong>Cons:</strong> The artistic intent is fluid. The image looks different on every screen.</li>
      <li><strong>Used By:</strong> Broadcast (<mark>BBC/NHK</mark>), Live Sports, YouTube HDR.</li>
    </ul>

    <figure class="diagram-placeholder">
      <div class="diagram-container">
        <div class="placeholder-text">
          [Future Interactive: PQ vs HLG Curves - Side-by-side comparison showing PQ absolute mapping (code value → nits) vs HLG relative mapping (code value → % of peak), with adjustable display peak brightness slider]
        </div>
      </div>
      <figcaption>Figure 5.1: PQ vs HLG transfer functions—absolute vs relative luminance encoding</figcaption>
    </figure>

  </section>

  <section id="section-5-2" class="content-section">
    <h2>5.2 Viewing Environment & Perception</h2>

    <p>
      You cannot grade in a vacuum. The room you are sitting in changes the contrast you see on screen.
    </p>

    <h3>The Bartleson-Breneman Effect</h3>

    <ul>
      <li><strong>The Law:</strong> A dark surround lowers the perceived contrast of an image.</li>
      <li><strong>The Fix:</strong> If you view an image in a dark room (Cinema), you must boost the gamma of the display to make it look "normal."
        <ul>
          <li><strong>Cinema (Dark):</strong> <mark>Gamma 2.6</mark>.</li>
          <li><strong>Mastering Suite (Dim):</strong> <mark>Gamma 2.4</mark> (<mark>BT.1886</mark>).</li>
          <li><strong>Office/Web (Bright):</strong> <mark>Gamma 2.2</mark> (<mark>sRGB</mark>).</li>
        </ul>
      </li>
      <li><strong>Why this matters:</strong> If you grade a commercial in a dark suite (Gamma 2.4) and watch it on a phone in daylight (Gamma 2.2), the shadows will look lifted and washed out. This isn't an error; it's the <mark>Bartleson-Breneman</mark> compensation at work.</li>
    </ul>

    <h3>The Crispening Effect</h3>

    <ul>
      <li><strong>The Phenomenon:</strong> The eye is hypersensitive to color differences when the background is similar to the sample.</li>
      <li><strong>Example:</strong> A grey square on a grey background looks "crisper" (more contrasty) than the same grey square on a white background.</li>
      <li><strong>DIT Application:</strong> This is why UI designers hate "Grey on Grey" interfaces, and why colorists use <mark>Middle Grey</mark> surrounds in their GUI to keep their vision neutral.</li>
    </ul>

    <figure class="diagram-placeholder">
      <div class="diagram-container">
        <div class="placeholder-text">
          [Future Interactive: Viewing Environment Simulator - Same image shown in dark surround (Gamma 2.6), dim surround (Gamma 2.4), and bright surround (Gamma 2.2) with adjustable ambient light slider demonstrating Bartleson-Breneman effect]
        </div>
      </div>
      <figcaption>Figure 5.2: Bartleson-Breneman effect—how viewing environment affects perceived contrast</figcaption>
    </figure>

  </section>

  <section id="section-5-3" class="content-section">
    <h2>5.3 System Color Management: The OS Layer</h2>

    <p>
      Even if your file is perfect, the Operating System (OS) can ruin it.
    </p>

    <h3>Apple EDR (Extended Dynamic Range)</h3>

    <p>
      If you work on a modern MacBook Pro or Pro Display XDR, you are using <mark>EDR</mark>.
    </p>

    <ul>
      <li><strong>Concept:</strong> EDR is not a fixed mode; it is dynamic.</li>
      <li><strong>Headroom:</strong> macOS defines "<mark>SDR White</mark>" (100-200 nits) as the baseline. Any brightness capability the screen has above that is called <mark>Headroom</mark>.</li>
      <li><strong>How it works:</strong> You can have an SDR desktop window open next to an HDR video window. macOS allocates the "Headroom" pixels only to the HDR video, blasting them at 1,000+ nits, while keeping your email client at a comfortable 100 nits.</li>
      <li><strong>The Danger:</strong> If you are grading in a windowed viewer, you might not be seeing true HDR if the OS has decided to limit Headroom to save battery or because the ambient light sensor triggered a dimming event. Always use a dedicated I/O breakout box (Blackmagic/AJA) for critical reference.</li>
    </ul>

    <h3>The QuickTime Gamma Shift (NCLC Tags)</h3>

    <p>
      The most common question in forums: "Why does my render look washed out in QuickTime?"
    </p>

    <ul>
      <li><strong>The Cause:</strong> Apple's <mark>ColorSync</mark> utility reads the <mark>NCLC tags</mark> (metadata) in your video file.
        <ul>
          <li><mark>1-1-1 (Rec.709):</mark> Apple interprets this as <mark>Gamma 1.96</mark> (the old specific gamma of an Apple CRT from the 90s). It lifts the shadows.</li>
          <li><mark>1-2-1 (Rec.709 Gamma 2.4):</mark> Apple interprets this correctly as Gamma 2.4.</li>
        </ul>
      </li>
      <li><strong>The Fix:</strong> In DaVinci Resolve, you must manually tag your export as <mark>Rec.709-A</mark> (which forces the 1-1-1 tag but pre-distorts the gamma to look correct) OR accept that QuickTime is essentially a "Bright Environment" simulator and shouldn't be trusted for critical black-level checks.</li>
    </ul>

    <blockquote>
      <strong>Critical Takeaway:</strong> The <mark>QuickTime Gamma Shift</mark> is not a bug—it's a feature designed for Apple's historical viewing environment assumptions. Always verify your exports on calibrated reference monitors via hardware I/O.
    </blockquote>

    <figure class="diagram-placeholder">
      <div class="diagram-container">
        <div class="placeholder-text">
          [Future Interactive: NCLC Tag Decoder - Upload video file to inspect NCLC metadata tags, showing how different tags (1-1-1 vs 1-2-1) are interpreted by QuickTime/ColorSync with before/after gamma shift visualization]
        </div>
      </div>
      <figcaption>Figure 5.3: QuickTime gamma shift—NCLC tag interpretation and workarounds</figcaption>
    </figure>

    <p>
      <strong>Next Module:</strong> We analyze the specific color pipelines of the titans: <mark>ARRI</mark>, <mark>RED</mark>, and the raw mechanics of sensors.
    </p>

  </section>

  <section class="module-references">
    <h2>References & Further Reading</h2>
    <ul>
      <li>SMPTE ST 2084:2014. <em>High Dynamic Range Electro-Optical Transfer Function of Mastering Reference Displays</em>.</li>
      <li>ITU-R Recommendation BT.2100-2 (2018). <em>Image parameter values for high dynamic range television for use in production and international programme exchange</em>.</li>
      <li>ARIB STD-B67 (2015). <em>Essential Parameter Values for the Extended Image Dynamic Range Television (EIDRTV) System for Programme Production</em> (HLG standard).</li>
      <li>Bartleson, C.J. & Breneman, E.J. (1967). "Brightness perception in complex fields." <em>Journal of the Optical Society of America</em>, 57(7), 953-957.</li>
      <li>Apple Inc. (2021). <em>Extended Dynamic Range (EDR) on macOS</em>. Developer Documentation.</li>
      <li>Dolby Laboratories (2020). <em>Dolby Vision - Principles and Technologies</em>. White Paper Version 3.1.</li>
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
      <a href="/misc/colorimetry/module-4/" class="module-nav-prev">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <span>Previous Module</span>
      </a>

      <a href="/misc/colorimetry/module-6/" class="module-nav-next">
        <span>Next Module</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </a>
    </div>
  </div>
</nav>
