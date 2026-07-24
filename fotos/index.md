---
layout: default
title: Fotos
description: Selected photographs by Runze Ni.
permalink: /fotos/
gallery: true
---

<header class="gallery-header">
  <p class="gallery-kicker">Photography</p>
  <h1 class="gallery-title">Selected works</h1>
  <div class="gallery-header__meta">
    <p class="gallery-meta">{{ site.data.photos.portfolio | size }} photographs</p>
    <a href="{{ '/fotos/archive/' | relative_url }}" class="gallery-archive-link">Browse the full archive <span aria-hidden="true">→</span></a>
  </div>
</header>

{% assign selected_photos = site.data.photos.portfolio %}
<section class="contact-sheet-grid" data-photo-gallery data-justified-gallery="spacious" aria-label="Selected photographs">
  {% for photo in selected_photos %}
    {% assign image_loading = 'lazy' %}
    {% if forloop.first %}{% assign image_loading = 'eager' %}{% endif %}
    <a class="contact-sheet-item" href="{{ photo.src | relative_url }}" aria-label="Open photograph {{ forloop.index }} of {{ selected_photos | size }}" data-gallery-trigger data-pswp-width="{{ photo.width }}" data-pswp-height="{{ photo.height }}">
      {% include photo.html photo=photo alt="" loading=image_loading %}
    </a>
  {% endfor %}
</section>

<section class="article-note fotos-cine" id="cine" aria-labelledby="cine-heading">
  <p class="gallery-kicker">Moving image</p>
  <h2 id="cine-heading">Cine</h2>
  <p>Color studies, stills, and short moving-image work are in preparation.</p>
</section>
