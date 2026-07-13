---
layout: default
title: Fotos
description: A curated selection of film photographs by Runze Ni.
permalink: /fotos/
gallery: true
---

<header class="gallery-header">
  <h1 class="gallery-title">Selected works</h1>
  <p class="gallery-subtitle">A small edit of film photographs. Every frame is kept intact.</p>
</header>

<section class="portfolio-grid" aria-label="Selected photographs">
  {% for photo in site.data.portfolio.photos %}
    {% assign thumbnail = photo.src | replace: '/assets/img/', '/assets/img/derived/' | replace: '.jpg', '.webp' %}
    <button class="portfolio-item portfolio-item--{{ photo.layout }}" type="button" data-gallery-trigger data-gallery="portfolio" data-gallery-source="{{ thumbnail | relative_url }}" data-gallery-alt="{{ photo.alt | escape }}" aria-label="Open photograph: {{ photo.alt | escape }}">
      <img src="{{ thumbnail | relative_url }}" width="{{ photo.width }}" height="{{ photo.height }}" alt="{{ photo.alt | escape }}" loading="{% if forloop.first %}eager{% else %}lazy{% endif %}" decoding="async" sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 66vw"{% if forloop.first %} fetchpriority="high"{% endif %}>
    </button>
  {% endfor %}
</section>

<p class="archive-link-container"><a href="{{ '/fotos/archive/' | relative_url }}" class="archive-link">Browse the full archive →</a></p>
