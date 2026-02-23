---
title: Kodak Gold 200 / Cleveland
breadcrumb_title: Kodak Gold 200
permalink: /fotos/archive/2024/kodak-gold-200/
---

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