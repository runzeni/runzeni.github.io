---
layout: default
title: Fotos
description: A curated selection of film photographs by Runze Ni.
permalink: /fotos/
gallery: true
---

<header class="gallery-header">
  <p class="gallery-kicker">Film photography</p>
  <h1 class="gallery-title">Selected works</h1>
  <p class="gallery-subtitle">A personal edit of places, passing light, and accidental geometry.</p>
  <p class="gallery-meta">{{ site.data.portfolio.photos | size }} photographs <span aria-hidden="true">·</span> 35 mm</p>
</header>

<section class="portfolio-grid" aria-label="Selected photographs">
  {% for photo in site.data.portfolio.photos %}
    {% assign thumbnail = photo.src | replace: '/assets/img/', '/assets/img/derived/' | replace: '.jpg', '.webp' %}
    <button class="portfolio-item portfolio-item--{{ photo.layout }}" type="button" data-gallery-trigger data-gallery="portfolio" data-gallery-source="{{ thumbnail | relative_url }}" data-gallery-alt="{{ photo.alt | escape }}" data-gallery-number="{{ forloop.index }}" aria-label="Open photograph {{ forloop.index }} of {{ forloop.length }}: {{ photo.alt | escape }}">
      <span class="portfolio-item__frame">
        <img src="{{ thumbnail | relative_url }}" width="{{ photo.width }}" height="{{ photo.height }}" alt="{{ photo.alt | escape }}" loading="{% if forloop.first %}eager{% else %}lazy{% endif %}" decoding="async" sizes="(max-width: 620px) 100vw, (max-width: 960px) 50vw, 62vw"{% if forloop.first %} fetchpriority="high"{% endif %}>
      </span>
      <span class="portfolio-item__index" aria-hidden="true">{{ forloop.index | prepend: '0' | slice: -2, 2 }}</span>
    </button>
  {% endfor %}
</section>

<p class="archive-link-container"><a href="{{ '/fotos/archive/' | relative_url }}" class="archive-link">Browse the full archive →</a></p>
