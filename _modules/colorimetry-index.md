---
title: Regarding Colorimetry
series: colorimetry
slug: index
permalink: /misc/colorimetry/
layout: default
description: Working notes on color science, from biology to ACES.
---

<div class="article-landing-header">
  <h1>Regarding Colorimetry</h1>
  <p class="article-landing-subtitle">
    Working notes on color science for moving images.
  </p>
</div>

<aside class="article-note" aria-labelledby="colorimetry-status">
  <h2 id="colorimetry-status">Work in progress</h2>
  <p>This is a developing reading-and-making project, not a calibrated technical reference. Some diagrams are intentionally marked as studies; they will be replaced only with sourced data or a clearly labelled schematic.</p>
  <p>The first public interactives are deliberately small and reusable: a formula-based transfer-curve explorer and a named-primary coordinate explorer. Image comparisons, camera-specific claims, and any security demonstration still need real source material before they belong here.</p>
</aside>

<div class="series-resources">
  <h3>Resources</h3>
  <p>Full outline for print/PDF, plus a math reference appendix.</p>
  <div class="series-resources-links">
    <a href="{{ '/misc/colorimetry/comprehensive-outline/' | relative_url }}" class="series-start-button">Print Outline</a>
    <a href="{{ '/misc/colorimetry/appendix-mathematics/' | relative_url }}" class="series-resource-link">Math Appendix</a>
  </div>
</div>

<div class="module-grid">

  <article class="module-card">
    <a href="{{ '/misc/colorimetry/module-1/' | relative_url }}" class="module-card-link">
      <div class="module-card-header">
        <span class="module-number">Module 1</span>
      </div>
      <h2 class="module-title">The Hardware of Sight</h2>
      <p class="module-excerpt">
        "The eye is not a camera. It is a brain peripheral." <br>
        Understanding biological color vision before diving into digital workflows.
      </p>
      <nav class="module-outline" aria-label="Module 1 outline">
        <ul>
          <li>1.1 The Source: Physics of Photons</li>
          <li>1.2 The Lens & Retina</li>
          <li>1.3 The Photoreceptors</li>
          <li>1.4 The Perception Anomalies</li>
          <li>1.5 The Integration Formula</li>
        </ul>
      </nav>
      <div class="module-cta">
        <span class="module-cta-text">Read Module 1 →</span>
      </div>
    </a>
  </article>

  <article class="module-card">
    <a href="{{ '/misc/colorimetry/module-2/' | relative_url }}" class="module-card-link">
      <div class="module-card-header">
        <span class="module-number">Module 2</span>
      </div>
      <h2 class="module-title">Measuring Color: History & Standards</h2>
      <p class="module-excerpt">
        From early color-matching experiments to the CIE 1931 XYZ standard, perceptual uniformity attempts, and the analog legacy of film.
      </p>
      <nav class="module-outline" aria-label="Module 2 outline">
        <ul>
          <li>2.1 A History of Guesswork</li>
          <li>2.2 The Wright-Guild Experiments</li>
          <li>2.3 The Holy Grail: CIE 1931 XYZ</li>
          <li>2.4 The Flaw: Perceptual Uniformity</li>
          <li>2.5 The Analog Legacy</li>
        </ul>
      </nav>
      <div class="module-cta">
        <span class="module-cta-text">Read Module 2 →</span>
      </div>
    </a>
  </article>

  <article class="module-card">
    <a href="{{ '/misc/colorimetry/module-3/' | relative_url }}" class="module-card-link">
      <div class="module-card-header">
        <span class="module-number">Module 3</span>
      </div>
      <h2 class="module-title">The Digital Image Pipeline</h2>
      <p class="module-excerpt">
        The camera does not take pictures—it collects data. Understanding scene-referred vs. display-referred workflows, color models, transfer functions, and view transforms.
      </p>
      <nav class="module-outline" aria-label="Module 3 outline">
        <ul>
          <li>3.1 Scene-Referred vs. Display-Referred</li>
          <li>3.2 The Zoo of Color Models</li>
          <li>3.3 Transfer Functions (OETF & EOTF)</li>
          <li>3.4 Tone Mapping & The View Transform</li>
        </ul>
      </nav>
      <div class="module-cta">
        <span class="module-cta-text">Read Module 3 →</span>
      </div>
    </a>
  </article>

  <article class="module-card">
    <a href="{{ '/misc/colorimetry/module-4/' | relative_url }}" class="module-card-link">
      <div class="module-card-header">
        <span class="module-number">Module 4</span>
      </div>
      <h2 class="module-title">ACES & Modern Color Management</h2>
      <p class="module-excerpt">
        The standardized future: ACES architecture, AP0/AP1 working spaces, gamut compression issues, and practical workflows.
      </p>
      <nav class="module-outline" aria-label="Module 4 outline">
        <ul>
          <li>4.1 The Architecture</li>
          <li>4.2 The Gamut Problem (Advanced ACES)</li>
          <li>4.3 Practical ACES Workflows</li>
        </ul>
      </nav>
      <div class="module-cta">
        <span class="module-cta-text">Read Module 4 →</span>
      </div>
    </a>
  </article>

  <article class="module-card">
    <a href="{{ '/misc/colorimetry/module-5/' | relative_url }}" class="module-card-link">
      <div class="module-card-header">
        <span class="module-number">Module 5</span>
      </div>
      <h2 class="module-title">The Display Ecosystem</h2>
      <p class="module-excerpt">
        Where the image lives: HDR standards (PQ/HLG), viewing environment effects, and system color management across platforms.
      </p>
      <nav class="module-outline" aria-label="Module 5 outline">
        <ul>
          <li>5.1 The HDR Landscape</li>
          <li>5.2 Viewing Environment & Perception</li>
          <li>5.3 System Color Management</li>
        </ul>
      </nav>
      <div class="module-cta">
        <span class="module-cta-text">Read Module 5 →</span>
      </div>
    </a>
  </article>

  <article class="module-card">
    <a href="{{ '/misc/colorimetry/module-6/' | relative_url }}" class="module-card-link">
      <div class="module-card-header">
        <span class="module-number">Module 6</span>
      </div>
      <h2 class="module-title">Camera Architectures & Case Studies</h2>
      <p class="module-excerpt">
        Applying theory to specific sensors: ARRI's LogC pipeline, the color wars (RED IPP2 vs. ACES), and RAW demosaicing mechanics.
      </p>
      <nav class="module-outline" aria-label="Module 6 outline">
        <ul>
          <li>6.1 The ARRI Gold Standard</li>
          <li>6.2 The Color Wars</li>
          <li>6.3 RAW Mechanics</li>
        </ul>
      </nav>
      <div class="module-cta">
        <span class="module-cta-text">Read Module 6 →</span>
      </div>
    </a>
  </article>

  <article class="module-card">
    <a href="{{ '/misc/colorimetry/module-7/' | relative_url }}" class="module-card-link">
      <div class="module-card-header">
        <span class="module-number">Module 7</span>
      </div>
      <h2 class="module-title">Computational Color: Matching, LUTs, and Limits</h2>
      <p class="module-excerpt">
        Working notes on color matching algorithms, LUT mathematics, and the limits of image-side workarounds.
      </p>
      <nav class="module-outline" aria-label="Module 7 outline">
        <ul>
          <li>7.1 Advanced Color Matching</li>
          <li>7.2 LUT Mathematics</li>
          <li>7.3 Security & Algorithms</li>
        </ul>
      </nav>
      <div class="module-cta">
        <span class="module-cta-text">Read Module 7 →</span>
      </div>
    </a>
  </article>

</div>

<div class="series-footer">
  <p class="series-footer-text">
    This series assumes familiarity with basic color terminology and motion picture workflows. Mathematical formulas are rendered with MathJax.
  </p>
  <a href="{{ '/misc/colorimetry/module-1/' | relative_url }}" class="series-start-button">
    Start with Module 1 →
  </a>
</div>
