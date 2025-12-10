---
title: Portfolio
permalink: /fotos/
---

<div class="gallery-header">
  <h1 class="gallery-title">Selected Works</h1>
  <div class="gallery-subtitle">
    A curated portfolio.
    <br>
    <a href="/archive/">View Full Archive &rarr;</a>
  </div>
</div>

<div class="portfolio-grid">

  {% assign portfolio_files = site.static_files | where_exp: "item", "item.path contains 'assets/img/portfolio/'" | sort: "name" %}
  
  {% for image in portfolio_files %}
    <img data-src="{{ image.path | relative_url }}" alt="Selected Work: {{ image.name }}" class="portfolio-thumb">
  {% endfor %}

</div>

<div class="archive-link-container">
  <a href="/archive/" class="archive-link">
    View Full Archive &rarr;
  </a>
</div>