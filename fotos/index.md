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
  <div class="gallery-header__meta">
    <p class="gallery-meta">{{ site.data.portfolio.photos | size }} photographs <span aria-hidden="true">·</span> 35 mm</p>
    <a href="{{ '/fotos/archive/' | relative_url }}" class="gallery-archive-link">Browse the full archive <span aria-hidden="true">→</span></a>
  </div>
</header>

<section class="portfolio-grid" data-photo-gallery aria-label="Selected photographs">
  {% for photo in site.data.portfolio.photos %}
    {% assign thumbnail = photo.src | replace: '/assets/img/', '/assets/img/derived/' | replace: '.jpg', '.webp' %}
    <a class="portfolio-item portfolio-item--{{ photo.layout }}" href="{{ thumbnail | relative_url }}" data-gallery-trigger data-pswp-width="{{ photo.width }}" data-pswp-height="{{ photo.height }}" aria-label="Open photograph {{ forloop.index }} of {{ forloop.length }}: {{ photo.alt | escape }}">
      <span class="portfolio-item__frame">
        <img src="{{ thumbnail | relative_url }}" width="{{ photo.width }}" height="{{ photo.height }}" alt="{{ photo.alt | escape }}" loading="{% if forloop.first %}eager{% else %}lazy{% endif %}" decoding="async" sizes="(max-width: 620px) 100vw, (max-width: 960px) 50vw, 62vw"{% if forloop.first %} fetchpriority="high"{% endif %}>
      </span>
    </a>
  {% endfor %}
</section>
