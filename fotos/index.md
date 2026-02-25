---
title: Portfolio
permalink: /fotos/
---

<div class="gallery-header">
  <h1 class="gallery-title">Selected Works</h1>
  <div class="gallery-subtitle">
    A curated portfolio.
  </div>
</div>

<div class="archive-link-container">
  <a href="/fotos/archive/" class="archive-link">
    View Full Archive &rarr;
  </a>
</div>

<div class="portfolio-grid">
  <div class="grid-sizer"></div>

  {% assign portfolio_files = site.static_files | where_exp: "item", "item.path contains 'assets/img/portfolio/'" | sort: "name" %}
  
  {% for image in portfolio_files %}
    <img src="{{ image.path | relative_url }}" alt="Selected Work: {{ image.name }}" class="portfolio-thumb" loading="lazy">
  {% endfor %}

</div>

<div class="archive-link-container">
  <a href="/fotos/archive/" class="archive-link">
    View Full Archive &rarr;
  </a>
</div>