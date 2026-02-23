---
title: Kodak Ultramax 400 / Cleveland
breadcrumb_title: Kodak Ultramax 400
permalink: /fotos/archive/2023/kodak-ultramax-400-cle-mn/
---

<div class="gallery-header">
  <h1 class="gallery-title">Kodak Ultramax 400</h1>
  <div class="gallery-subtitle">
    Cleveland & Minneapolis
  </div>
</div>

<div class="contact-sheet-grid">

  {% assign roll_files = site.static_files | where_exp: "item", "item.path contains 'assets/img/2023/2023_UM400_CLE+MN_Export_Web/'" | sort: "name" %}
  
  {% for image in roll_files %}
    <img src="{{ image.path | relative_url }}" alt="Kodak Ultramax 400: {{ image.name }}" class="contact-sheet-thumb" loading="lazy">
  {% endfor %}

</div>