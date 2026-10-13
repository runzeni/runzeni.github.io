---
layout: default
title: Protocols
description: A searchable collection of cocktail notes curated by Runze Ni.
permalink: /protocols/
protocol: true
---

<header class="gallery-header">
  <h1 class="gallery-title">Protocols</h1>
  <p class="gallery-subtitle">{{ site.data.cocktails.cocktails | size }} cocktail notes, searchable by spirit or ingredient.</p>
</header>

<form class="protocol-controls" id="protocol-filters">
  <div class="search-row">
    <label for="search-box" class="visually-hidden">Search cocktails by name or ingredient</label>
    <input type="search" id="search-box" placeholder="Search cocktails or ingredients" class="search-input" autocomplete="off" aria-describedby="results-count">
    <button id="shuffle-btn" class="shuffle-btn" type="button" aria-label="Show a random cocktail" title="Show a random cocktail">
      <span class="shuffle-icon" aria-hidden="true">🎲</span>
      <span class="visually-hidden">Show a random cocktail</span>
    </button>
  </div>
  <div class="filter-row">
    <div class="filter-buttons choice-buttons" role="group" aria-label="Filter by spirit">
      <button class="filter-btn choice-button active" type="button" data-base="all" aria-pressed="true">All</button>
      {% assign spirits = site.data.cocktails.cocktails | map: 'base' | uniq %}
      {% for spirit in spirits %}
        <button class="filter-btn choice-button" type="button" data-base="{{ spirit | escape }}" aria-pressed="false">{{ spirit | capitalize }}</button>
      {% endfor %}
    </div>
    <p class="results-count" id="results-count" role="status" aria-live="polite">{{ site.data.cocktails.cocktails | size }} cocktails</p>
  </div>
</form>

<noscript><p class="protocol-noscript">All recipes are shown below. Search and filters need JavaScript.</p></noscript>

<section id="cocktails-grid" class="entry-grid" aria-label="Cocktail recipes">
  {% for cocktail in site.data.cocktails.cocktails %}
    {% include cocktail-card.html cocktail=cocktail %}
  {% endfor %}
  <div class="no-results" id="no-results" hidden>
    <p>No cocktails found.</p>
    <button class="clear-search-btn" id="clear-filters" type="button">Clear filters</button>
  </div>
</section>
