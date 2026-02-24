---
title: Protocols
permalink: /protocols/
---

<div class="gallery-header">
  <h1 class="gallery-title">Runze's Protocol</h1>
  <div class="gallery-subtitle">
    Selected cocktail recipes | 26 SS
  </div>
</div>

<!-- Search and Filter Controls -->
<div class="protocol-controls">
  <div class="search-row">
    <input type="text" id="search-box" placeholder="Search cocktails..." class="search-input">
    <button id="shuffle-btn" class="shuffle-btn" aria-label="Shuffle random cocktail" title="Random cocktail">
      🎲
    </button>
  </div>
  <div class="filter-row">
    <div class="filter-buttons" id="filter-buttons" role="group" aria-label="Filter by spirit">
      <button class="filter-btn active" data-base="all" aria-pressed="true">All</button>
      <button class="filter-btn" data-base="whiskey" aria-pressed="false">Whiskey</button>
      <button class="filter-btn" data-base="gin" aria-pressed="false">Gin</button>
      <button class="filter-btn" data-base="tequila" aria-pressed="false">Tequila</button>
      <button class="filter-btn" data-base="rum" aria-pressed="false">Rum</button>
      <button class="filter-btn" data-base="cognac" aria-pressed="false">Cognac</button>
      <button class="filter-btn" data-base="misc" aria-pressed="false">Misc</button>
    </div>
    <div class="results-count" id="results-count"></div>
  </div>
</div>

<!-- Cocktails will be rendered here -->
<div id="cocktails-grid" class="cocktails-grid"></div>

<script src="/assets/js/cocktails.js"></script>