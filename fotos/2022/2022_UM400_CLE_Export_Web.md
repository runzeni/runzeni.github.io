---
title: Kodak Ultramax 400 / Cleveland
permalink: /fotos/2022/kodak-ultramax-400/
---

<div class="site-breadcrumb">
  <nav class="breadcrumb-container" aria-label="Breadcrumb">
    <a href="/" class="breadcrumb-item">Home</a>
    <span class="breadcrumb-separator" aria-hidden="true">/</span>
    <a href="/fotos/" class="breadcrumb-item">Portfolio</a>
    <span class="breadcrumb-separator" aria-hidden="true">/</span>
    <a href="/fotos/2022/" class="breadcrumb-item">2022</a>
    <span class="breadcrumb-separator" aria-hidden="true">/</span>
    <span class="breadcrumb-item breadcrumb-current" aria-current="page">Kodak Ultramax 400</span>
  </nav>
</div>

<div class="gallery-header">
  <h1 class="gallery-title">Kodak Ultramax 400</h1>
  <div class="gallery-subtitle">
    Cleveland
  </div>
</div>

<div class="contact-sheet-grid">

  {% assign roll_files = site.static_files | where_exp: "item", "item.path contains 'assets/img/2022/2022_UM400_CLE_Export_Web/'" | sort: "name" %}
  
  {% for image in roll_files %}
    <img data-src="{{ image.path | relative_url }}" alt="Kodak Ultramax 400: {{ image.name }}" class="contact-sheet-thumb">
  {% endfor %}

</div>