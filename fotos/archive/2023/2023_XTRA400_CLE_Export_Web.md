---
title: Fujifilm Superia X-tra 400 / Cleveland
breadcrumb_title: Fujifilm Superia X-tra 400
permalink: /fotos/archive/2023/fuji-xtra-400/
---

<div class="gallery-header">
  <h1 class="gallery-title">Fujifilm Superia X-tra 400</h1>
  <div class="gallery-subtitle">
    Cleveland
  </div>
</div>

<div class="contact-sheet-grid">

  {% assign roll_files = site.static_files | where_exp: "item", "item.path contains 'assets/img/2023/2023_XTRA400_CLE_Export_Web/'" | sort: "name" %}
  
  {% for image in roll_files %}
    <img src="{{ image.path | relative_url }}" alt="Fuji Xtra 400: {{ image.name }}" class="contact-sheet-thumb" loading="lazy">
  {% endfor %}

</div>