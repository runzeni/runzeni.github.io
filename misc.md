---
layout: default
title: Notes & playground
description: Articles, working notes, and experiments by Runze Ni.
breadcrumb_title: Notes
permalink: /misc/
---

<header class="gallery-header">
  <h1 class="gallery-title">Notes & playground</h1>
  <p class="gallery-subtitle">Articles, explorations, and experiments that are ready to share.</p>
</header>

<section class="misc-section" aria-labelledby="notes-heading">
  <h2 class="misc-section-title" id="notes-heading">Notes</h2>
  <div class="misc-grid">
    {% assign index_pages = site.modules | where: 'slug', 'index' | sort: 'title' %}
    {% for item in index_pages %}
      {% assign series_modules = site.modules | where: 'series', item.series | where_exp: 'module', 'module.module_number' | sort: 'module_number' %}
      <a href="{{ item.url | relative_url }}" class="misc-card misc-card-link">
        <div class="misc-card-header">
          <h3>{{ item.title }}</h3>
          {% if item.date %}<span class="misc-date">{{ item.date | date: '%b %Y' }}</span>{% endif %}
        </div>
        <p class="misc-excerpt">{{ item.description | default: '' }}</p>
        {% if series_modules.size > 0 %}<span class="misc-module-count">{{ series_modules.size }} modules</span>{% endif %}
      </a>
    {% endfor %}
  </div>
</section>

<section class="misc-section" aria-labelledby="playground-heading">
  <h2 class="misc-section-title" id="playground-heading">Playground</h2>
  <div class="misc-grid">
    <a href="{{ '/misc/text/' | relative_url }}" class="misc-card misc-card-link">
      <div class="misc-card-header">
        <h3>Text enlarger</h3>
        <span class="misc-status">Tool</span>
      </div>
      <p class="misc-excerpt">Make a short message fill the screen.</p>
    </a>
  </div>
</section>
