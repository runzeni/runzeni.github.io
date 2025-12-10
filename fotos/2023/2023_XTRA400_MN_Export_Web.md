---
title: Fujifilm Superia X-tra 400 / Minneapolis
permalink: /fotos/2023/fuji-xtra-400-mn/
---

<div class="site-breadcrumb">
  <nav class="breadcrumb-container" aria-label="Breadcrumb">
    <a href="/" class="breadcrumb-item">Home</a>
    <span class="breadcrumb-separator" aria-hidden="true">/</span>
    <a href="/fotos/" class="breadcrumb-item">Portfolio</a>
    <span class="breadcrumb-separator" aria-hidden="true">/</span>
    <a href="/fotos/2023/" class="breadcrumb-item">2023</a>
    <span class="breadcrumb-separator" aria-hidden="true">/</span>
    <span class="breadcrumb-item breadcrumb-current" aria-current="page">Fujifilm Superia X-tra 400</span>
  </nav>
</div>

<div class="gallery-header">
  <h1 class="gallery-title">Fujifilm Superia X-tra 400</h1>
  <div class="gallery-subtitle">
    Minneapolis
  </div>
</div>

<div class="contact-sheet-grid">

  {% assign roll_files = site.static_files | where_exp: "item", "item.path contains 'assets/img/2023/2023_XTRA400_MN_Export_Web/'" | sort: "name" %}
  
  {% for image in roll_files %}
    <img data-src="{{ image.path | relative_url }}" alt="Fuji Xtra 400: {{ image.name }}" class="contact-sheet-thumb">
  {% endfor %}

</div>