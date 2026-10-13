---
layout: default
title: Notes
description: Articles and working notes by Runze Ni.
permalink: /notes/
---

<header class="gallery-header">
  <h1 class="gallery-title">Notes</h1>
  <p class="gallery-subtitle">Working notes on code, color, and research.</p>
</header>

{% assign published_notes = site.notes | sort: 'date' | reverse %}
{% if published_notes.size > 0 %}
<section class="notes-library" aria-labelledby="articles-heading">
  <h2 class="notes-library-title" id="articles-heading">Articles</h2>
  <div class="entry-grid">
    {% for item in published_notes %}
      {% assign note_date = item.date | date: '%b %Y' %}
      {% include entry-card.html url=item.url title=item.title description=item.description meta=note_date %}
    {% endfor %}
  </div>
</section>
{% endif %}

<section class="notes-library" aria-label="Note series">
  {% if published_notes.size > 0 %}<h2 class="notes-library-title">Series</h2>{% endif %}
  <div class="entry-grid">
    {% assign index_pages = site.modules | where: 'slug', 'index' | sort: 'title' %}
    {% for item in index_pages %}
      {% assign series_modules = site.modules | where: 'series', item.series | where_exp: 'module', 'module.module_number' %}
      {% capture module_count %}{{ series_modules.size }} modules{% endcapture %}
      {% include entry-card.html url=item.url title=item.title description=item.description meta=module_count %}
    {% endfor %}
  </div>
</section>
