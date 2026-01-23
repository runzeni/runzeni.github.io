---
title: Kodak Gold 200 / Cleveland
permalink: /fotos/2024/kodak-gold-200/
---

<div class="site-breadcrumb">
  <nav class="breadcrumb-container" aria-label="Breadcrumb">
    <a href="/" class="breadcrumb-item">Home</a>
    <span class="breadcrumb-separator" aria-hidden="true">/</span>
    <a href="/fotos/" class="breadcrumb-item">Portfolio</a>
    <span class="breadcrumb-separator" aria-hidden="true">/</span>
    <a href="/archive/" class="breadcrumb-item">Archive</a>
    <span class="breadcrumb-separator" aria-hidden="true">/</span>
    <a href="/fotos/2024/" class="breadcrumb-item">2024</a>
    <span class="breadcrumb-separator" aria-hidden="true">/</span>
    <span class="breadcrumb-item breadcrumb-current" aria-current="page">Kodak Gold 200</span>
  </nav>
</div>

<div class="gallery-header">
  <h1 class="gallery-title">Kodak Gold 200</h1>
  <div class="gallery-subtitle">
    Cleveland & Tampa
  </div>
</div>

<div class="contact-sheet-grid">

  {% assign roll_files = site.static_files | where_exp: "item", "item.path contains 'assets/img/2024/2024_FUJI200_CLE_Export_Web/'" | sort: "name" %}
  
  {% for image in roll_files %}
    <img src="{{ image.path | relative_url }}" alt="Kodak Gold 200: {{ image.name }}" class="contact-sheet-thumb" loading="lazy">
  {% endfor %}

</div>