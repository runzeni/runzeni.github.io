---
layout: default
title: Protocol
description: A searchable collection of cocktail notes curated by Runze Ni.
permalink: /protocols/
protocol: true
---

<header class="gallery-header">
  <h1 class="gallery-title">Protocol</h1>
  <p class="gallery-subtitle">{{ site.data.cocktails.cocktails | size }} cocktail notes, searchable by spirit or ingredient.</p>
</header>

<form class="protocol-controls" id="protocol-filters" novalidate>
  <div class="search-row">
    <label for="search-box" class="visually-hidden">Search cocktails by name or ingredient</label>
    <input type="search" id="search-box" placeholder="Search cocktails or ingredients" class="search-input" autocomplete="off" aria-describedby="results-count">
    <button id="shuffle-btn" class="shuffle-btn" type="button" aria-label="Show a random cocktail" title="Random cocktail">Random</button>
  </div>
  <div class="filter-row">
    <div class="filter-buttons" id="filter-buttons" role="group" aria-label="Filter by spirit">
      <button class="filter-btn active" type="button" data-base="all" aria-pressed="true">All</button>
      <button class="filter-btn" type="button" data-base="whiskey" aria-pressed="false">Whiskey</button>
      <button class="filter-btn" type="button" data-base="gin" aria-pressed="false">Gin</button>
      <button class="filter-btn" type="button" data-base="tequila" aria-pressed="false">Tequila</button>
      <button class="filter-btn" type="button" data-base="rum" aria-pressed="false">Rum</button>
      <button class="filter-btn" type="button" data-base="cognac" aria-pressed="false">Cognac</button>
      <button class="filter-btn" type="button" data-base="misc" aria-pressed="false">Misc</button>
    </div>
    <p class="results-count" id="results-count" role="status" aria-live="polite">{{ site.data.cocktails.cocktails | size }} cocktails</p>
  </div>
</form>

<noscript><p class="protocol-noscript">All recipes are shown below. Search and filters need JavaScript.</p></noscript>

<section id="cocktails-grid" class="cocktails-grid" aria-label="Cocktail recipes" aria-busy="false" data-endpoint="{{ '/cocktails.json' | relative_url }}">
  {% for cocktail in site.data.cocktails.cocktails %}
    {% include cocktail-card.html cocktail=cocktail %}
  {% endfor %}
</section>
