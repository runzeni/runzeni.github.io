---
layout: default
title: Notes
description: Articles and working notes by Runze Ni.
permalink: /notes/
---

<header class="gallery-header">
  <h1 class="gallery-title">Notes</h1>
</header>

{% assign published_notes = site.notes | sort: 'date' | reverse %}
{% if published_notes.size > 0 %}
<section class="notes-library" aria-labelledby="articles-heading">
  <h2 class="notes-library-title" id="articles-heading">Articles</h2>
  <div class="entry-grid">
    {% for item in published_notes %}
      {% include entry-card.html url=item.url title=item.title %}
    {% endfor %}
  </div>
</section>
{% endif %}

<section class="notes-library" aria-label="Note series">
  {% if published_notes.size > 0 %}<h2 class="notes-library-title">Series</h2>{% endif %}
  <div class="entry-grid">
    {% assign index_pages = site.modules | where: 'slug', 'index' | sort: 'title' %}
    {% for item in index_pages %}
      {% include entry-card.html url=item.url title=item.title %}
    {% endfor %}
  </div>
</section>
