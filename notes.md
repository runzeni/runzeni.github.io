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
    <ol class="notes-list">
    {% for item in published_notes %}
      <li>
        <a href="{{ item.url | relative_url }}" class="notes-list-link">
          <span class="notes-list-main">
            <span class="notes-list-title">{{ item.title }}</span>
            {% if item.description %}<span class="notes-list-description">{{ item.description }}</span>{% endif %}
          </span>
          {% if item.date %}<time class="notes-list-meta" datetime="{{ item.date | date_to_xmlschema }}">{{ item.date | date: '%b %Y' }}</time>{% endif %}
        </a>
      </li>
    {% endfor %}
    </ol>
  </section>
{% endif %}

<section class="notes-library" aria-labelledby="series-heading">
  <h2 class="notes-library-title" id="series-heading">Series</h2>
  <ol class="notes-list">
    {% assign index_pages = site.modules | where: 'slug', 'index' | sort: 'title' %}
    {% for item in index_pages %}
      {% assign series_modules = site.modules | where: 'series', item.series | where_exp: 'module', 'module.module_number' | sort: 'module_number' %}
      <li>
        <a href="{{ item.url | relative_url }}" class="notes-list-link">
          <span class="notes-list-main">
            <span class="notes-list-title">{{ item.title }}</span>
            {% if item.description %}<span class="notes-list-description">{{ item.description }}</span>{% endif %}
          </span>
          {% if series_modules.size > 0 %}<span class="notes-list-meta">{{ series_modules.size }} modules</span>{% endif %}
        </a>
      </li>
    {% endfor %}
  </ol>
</section>
