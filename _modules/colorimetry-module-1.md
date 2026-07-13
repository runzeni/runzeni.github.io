---
title: "Module 1: The Hardware of Sight"
series: colorimetry
module_number: 1
slug: module-1
permalink: /misc/colorimetry/module-1/
date: 2025-12-10
description: "How biological vision works — from photons to perception — and why it matters for digital color."
math: true
---

<header class="module-header">
  <div class="module-meta">
    <span class="module-series-badge">Colorimetry</span>
    <span class="module-number-badge">Module 1 of 7</span>
  </div>
  <h1>The Hardware of Sight</h1>
  <div class="module-header-meta">
    <span class="module-date">December 2025</span>
  </div>
</header>

<article class="module-content">

  <div class="module-intro">
    <p class="lead-paragraph">
      "The eye is not a camera. It is a brain peripheral."
    </p>
    <p>
      Before we can talk about ACES, LUTs, or grading, we have to talk about the hardware we were born with. We tend to trust our eyes implicitly. If we see a color, we assume it is "real." But as a biologist, I have to tell you: your eyes are terrible scientific instruments. They are inconsistent, they auto-balance without asking, and they are easily tricked by simple changes in lighting.
    </p>
    <p>
      Yet, they are the only reference we have. To master digital color, we first need to understand the signal chain of biological color.
    </p>
  </div>

  <nav class="module-toc" aria-label="Table of contents">
    <h2 class="module-toc-title">In This Module</h2>
    <ul>
      <li><a href="#section-1-1">1.1 The Source: Physics of Photons</a></li>
      <li><a href="#section-1-2">1.2 The Lens & Retina: Variable Resolution</a></li>
      <li><a href="#section-1-3">1.3 The Photoreceptors: Rods & Cones</a></li>
      <li><a href="#section-1-4">1.4 The Perception Anomalies</a></li>
      <li><a href="#section-1-5">1.5 The Integration Formula</a></li>
    </ul>
  </nav>

  <section id="section-1-1" class="content-section">
    <h2>1.1 The Source: Physics of Photons</h2>

    <p>
      Visible light is just a narrow slice of the electromagnetic spectrum, roughly 380nm to 780nm. It behaves as both a wave and a particle, defined by the relationship between its wavelength ($\lambda$) and frequency ($\nu$):
    </p>

    $$
    c = \lambda \nu
    $$

    <p>
      Where $c$ is the speed of light (~299,792,458 m/s).
    </p>

    <p>
      When we talk about a light source on set, we usually describe it with a single number: <mark>Correlated Color Temperature (CCT)</mark>, like "3200K". This is a dangerous oversimplification. CCT only tells you the <em>color</em> of the light, not the <em>quality</em> of the spectrum. To see the quality, we need the <strong>Spectral Power Distribution (SPD)</strong>.
    </p>

    <h3>The LED Problem: Continuous vs. Discontinuous</h3>

    <p>
      <strong>Tungsten (Blackbody):</strong> A smooth, continuous curve. It rises gently from blue to red. It contains information at every single wavelength.
    </p>

    <p>
      <strong>LED (Discontinuous):</strong> A sharp blue spike (the pump) and a broad yellow/green hump (the phosphor).
    </p>

    <figure class="content-figure">
      <img src="{{ '/assets/figures/colorimetry/png/fig-1-1.png' | relative_url }}" alt="SPD comparison showing Tungsten continuous spectrum vs LED discontinuous spectrum" loading="lazy">
      <figcaption>Figure 1.1: SPD comparison—Tungsten (continuous) vs LED (discontinuous). Notice the missing data in cyan and deep red regions.</figcaption>
    </figure>

    <p>
      Notice the "valley" in the cyan range and the drop-off in deep reds? That is missing data. If a specific skin tone relies on reflecting 660nm red light, and your LED source isn't emitting 660nm light, that color simply does not exist in your scene.
    </p>

    <h3>Metamerism Failure & The CRI Trap</h3>

    <p>
      This leads to the DIT's nightmare: <strong>Metamerism Failure</strong>. Two colors might match under Tungsten but look completely different under LED.
    </p>

    <figure class="diagram-placeholder">
      <div class="diagram-container">
        <div class="placeholder-text">
          {% include colorimetry-figure-in-development.html %}
        </div>
      </div>
      <figcaption>Figure 1.2: Metamerism failure—same apparent color under tungsten, different colors under LED</figcaption>
    </figure>

    <p>
      We often rely on <strong>CRI (Color Rendering Index)</strong> to check this, but CRI is flawed. It only samples 8 pastel colors (R1-R8).
    </p>

    <blockquote>
      <mark class="highlight-term">The Trap:</mark> An LED can have a CRI of 95+ and still make skin look dead because it fails at R9 (Saturated Red).
    </blockquote>

    <p>
      <strong>The Solution:</strong> For cinematography, always verify <mark>R9</mark>, <mark>R13</mark> (Skin Tone), and <mark>R15</mark> (Asian Skin Tone).
    </p>

  </section>

  <section id="section-1-2" class="content-section">
    <h2>1.2 The Lens & Retina: Variable Resolution</h2>

    <p>
      Before light hits the sensor, it passes through the <strong>lens</strong>, which acts as a UV filter (protecting the retina). The signal then hits the "sensor plane"—the <strong>retina</strong>. Unlike a camera sensor with uniform resolution, the eye relies on <strong>Variable Resolution</strong>.
    </p>

    <h3>The Fovea vs. The Periphery</h3>

    <p>
      <strong>The Fovea:</strong> A tiny central pit (~2° field of view) densely packed with cones (~200,000 cones/mm²). This is the only place you see high-resolution color.
    </p>

    <p>
      <strong>The Periphery:</strong> The rest of the retina. Low resolution, rod-dominant, colorblind, but highly sensitive to motion.
    </p>

    <figure class="diagram-placeholder">
      <div class="diagram-container">
        <div class="placeholder-text">
          {% include colorimetry-figure-in-development.html %}
        </div>
      </div>
      <figcaption>Figure 1.3: Retinal structure showing foveal cone density vs peripheral rod dominance</figcaption>
    </figure>

    <blockquote>
      <strong>Filmmaking Application:</strong> We scan scenes rather than capturing them whole. When composing a shot, you are essentially guiding the viewer's fovea. If visual info exists in the corner without a leading line, the viewer biologically cannot see it in detail.
    </blockquote>

  </section>

  <section id="section-1-3" class="content-section">
    <h2>1.3 The Photoreceptors: Rods & Cones</h2>

    <p>
      Our "sensor" has two distinct modes of operation.
    </p>

    <h3>The Cones (Photopic Vision)</h3>

    <p>
      We are trichromats with three cone types, defined by peak sensitivity:
    </p>

    <ul>
      <li><strong>L (Long):</strong> <mark>~565nm</mark> (Red-Yellow)</li>
      <li><strong>M (Medium):</strong> <mark>~540nm</mark> (Green)</li>
      <li><strong>S (Short):</strong> <mark>~445nm</mark> (Blue-Violet)</li>
    </ul>

    <figure class="content-figure">
      <img src="{{ '/assets/figures/colorimetry/png/fig-1-4.png' | relative_url }}" alt="LMS cone spectral sensitivities showing L, M, and S cone response curves with significant overlap" loading="lazy">
      <figcaption>Figure 1.4: LMS cone spectral sensitivities showing significant overlap, especially between L and M</figcaption>
    </figure>

    <blockquote>
      <strong>Crucial Insight:</strong> The L and M curves overlap significantly. This "Opponent Process" design means the brain must calculate difference signals ($L-M$) to distinguish red from green. This is biologically expensive and explains why we are so sensitive to skin tone shifts.
    </blockquote>

    <h3>The Rods (Scotopic Vision) & The Purkinje Effect</h3>

    <p>
      In low light, cones shut down. Rods take over, peaking at ~505nm (Blue-Green) and becoming blind to red.
    </p>

    <p>
      This causes the <strong>Purkinje Effect</strong>: As light dims, red objects turn black, while blue objects appear remarkably bright.
    </p>

    <blockquote>
      <strong>Note:</strong> This is why "Day for Night" grades are traditionally blue. We are mimicking the human perceptual failure in low light.
    </blockquote>

  </section>

  <section id="section-1-4" class="content-section">
    <h2>1.4 The Perception Anomalies (The "Bugs")</h2>

    <p>
      The eye captures data, but the brain processes it. This processing introduces several "bugs" or non-linearities that colorists must understand.
    </p>

    <h3>A. The Helmholtz-Kohlrausch (H-K) Effect</h3>

    <p>
      <strong>Concept:</strong> Saturation contributes to perceived brightness. A highly saturated blue looks "brighter" to the eye than a desaturated blue, even if a light meter reads them as identical luminance.
    </p>

    <blockquote>
      <strong>Grading Trap:</strong> If you rely solely on the Waveform Monitor (Y channel), you might crush saturated colors because the math says they are bright enough, but your eye says they look dark.
    </blockquote>

    <h3>B. The Abney Effect</h3>

    <p>
      <strong>Concept:</strong> Hue shifts as you desaturate a color.
    </p>

    <p>
      <strong>Example:</strong> If you take a pure blue light (470nm) and add white to desaturate it, it doesn't just get paler—it shifts towards purple.
    </p>

    <p>
      <strong>Application:</strong> This is why simply lowering the "Saturation" slider in RGB often feels wrong. It doesn't mimic optical physics.
    </p>

    <h3>C. The Bezold-Brücke Effect</h3>

    <p>
      <strong>Concept:</strong> Hue changes with luminance. As brightness increases, most colors shift towards Yellow or Blue.
    </p>

    <ul>
      <li>Reds become yellower</li>
      <li>Greens become yellower</li>
    </ul>

    <p>
      <mark class="highlight-term">Invariant Wavelengths:</mark> Only a few specific hues (<mark>~478nm</mark> Blue, <mark>~503nm</mark> Green, <mark>~572nm</mark> Yellow) remain stable as you brighten them.
    </p>

    <h3>D. Weber-Fechner Law (Logarithmic Vision)</h3>

    <p>
      <strong>Concept:</strong> We perceive brightness logarithmically, not linearly. To make a bright light look 2x brighter, you need way more than 2x the photons.
    </p>

    <blockquote>
      <strong>Application:</strong> This is why 18% Grey is physically 18% reflection but perceptually 50% Grey. This discrepancy is the foundation of all Gamma encoding.
    </blockquote>

    <figure class="diagram-placeholder">
      <div class="diagram-container">
        <div class="placeholder-text">
          {% include colorimetry-figure-in-development.html %}
        </div>
      </div>
      <figcaption>Figure 1.5: Perception anomaly demonstrations—seeing the "bugs" in human vision</figcaption>
    </figure>

  </section>

  <section id="section-1-5" class="content-section">
    <h2>1.5 The Integration Formula</h2>

    <p>
      To quantify color for ACES, we must integrate these variables. The fundamental formula for seeing a color stimulus ($C$) is:
    </p>

    $$
    C = \int_{\lambda_{\text{min}}}^{\lambda_{\text{max}}} S(\lambda) \cdot R(\lambda) \cdot O(\lambda) \, d\lambda
    $$

    <p>Where:</p>
    <ul>
      <li>$S(\lambda)$: The SPD of your light source</li>
      <li>$R(\lambda)$: The physical reflectance of the object</li>
      <li>$O(\lambda)$: The sensitivity of the observer (LMS Cones)</li>
    </ul>

    <h3>The Digital Disconnect</h3>

    <p>
      In the digital world, we replace $O(\lambda)$ (The Eye) with the <strong>Camera Sensor's Spectral Sensitivity</strong>.
    </p>

    <blockquote>
      <strong>The Problem:</strong> Silicon is not Biological. A generic camera sensor does not match the LMS curves. When we build an IDT (Input Device Transform) in ACES, we are mathematically forcing the camera's alien vision to match the human standard observer. But if the sensor captures data the eye ignores (or misses data the eye sees), the math fails.
    </blockquote>

    <p>
      Color, ultimately, is a simulation.
    </p>

    <figure class="content-figure">
      <img src="{{ '/assets/figures/colorimetry/png/fig-1-6.png' | relative_url }}" alt="Camera sensor spectral sensitivity compared to CIE 1931 human observer curves" loading="lazy">
      <figcaption>Figure 1.6: Camera sensor spectral sensitivity vs human observer—the fundamental mismatch ACES attempts to correct</figcaption>
    </figure>

    <p>
      <strong>Next Module:</strong> We travel back to 1931 to see how scientists tried to turn this biological mess into a standard coordinate system.
    </p>

  </section>

</article>
