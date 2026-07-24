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

{% assign selected_photos = site.data.portfolio.photos | sort: 'sequence' %}
<section class="portfolio-sequence" data-photo-gallery aria-label="Selected photographs">
  {% for photo in selected_photos %}
    {% assign photo_asset = site.data.photos.assets[photo.src] %}
    {% assign image_loading = 'lazy' %}
    {% if forloop.first %}{% assign image_loading = 'eager' %}{% endif %}
    <a class="portfolio-item portfolio-item--{{ photo.placement }}" style="--sequence-row: {{ photo.row }}" href="{{ photo_asset.src | relative_url }}" data-gallery-trigger data-pswp-width="{{ photo_asset.width }}" data-pswp-height="{{ photo_asset.height }}">
      <span class="portfolio-item__frame">
        {% include responsive-photo.html photo=photo_asset alt=photo.alt sizes="(max-width: 620px) 100vw, (max-width: 960px) 50vw, 62vw" loading=image_loading %}
      </span>
    </a>
  {% endfor %}
</section>

<section class="article-note fotos-cine" id="cine" aria-labelledby="cine-heading">
  <p class="gallery-kicker">Moving image</p>
  <h2 id="cine-heading">Cine</h2>
  <p>Color studies, stills, and short moving-image work are in preparation.</p>
</section>
