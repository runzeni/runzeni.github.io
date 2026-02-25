---
title: Miscellaneous
breadcrumb_title: Misc
permalink: /misc/
---

<div class="gallery-header">
  <h1 class="gallery-title">Miscellaneous</h1>
  <div class="gallery-subtitle">
    Articles, explorations, and experiments
  </div>
</div>

<!-- Content organized by type -->
<div class="misc-content">

  <!-- Section 1: Notes — dynamically generated from _modules -->
  <section class="misc-section">
    <h2 class="misc-section-title">Notes</h2>
    <div class="misc-grid">

      {% assign index_pages = site.modules | where: "slug", "index" | sort: "title" %}
      {% for idx in index_pages %}
        {% assign series_modules = site.modules | where: "series", idx.series | where_exp: "m", "m.module_number" | sort: "module_number" %}
        <a href="{{ idx.url | relative_url }}" class="misc-card misc-card-link">
          <div class="misc-card-header">
            <h3>{{ idx.title }}</h3>
            {% if idx.date %}<span class="misc-date">{{ idx.date | date: "%b %Y" }}</span>{% endif %}
          </div>
          <p class="misc-excerpt">
            {{ idx.description | default: "" }}
          </p>
          {% if series_modules.size > 0 %}
            <span class="misc-module-count">{{ series_modules.size }} module{% if series_modules.size != 1 %}s{% endif %}</span>
          {% endif %}
        </a>
      {% endfor %}

      <!-- Future articles here -->

    </div>
  </section>

  <!-- Section 2: Tools/Resources (Future) -->
  <section class="misc-section">
    <h2 class="misc-section-title">Resources</h2>
    <div class="misc-grid">
      <div class="misc-card placeholder">
        <p>Nothing yet</p>
      </div>
    </div>
  </section>

  <!-- Section 3: Experiments (Future) -->
  <section class="misc-section">
    <h2 class="misc-section-title">Experiments</h2>
    <div class="misc-grid">
      <div class="misc-card placeholder">
        <p>Also empty</p>
      </div>
    </div>
  </section>

</div>
