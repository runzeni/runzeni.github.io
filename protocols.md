---
title: Protocols
permalink: /protocols/
---

<div class="gallery-header">
  <h1 class="gallery-title">Runze's Protocol</h1>
  <div class="gallery-subtitle">
    Selected cocktail recipes | 25 AW
  </div>
</div>

<!-- Search and Filter Controls -->
<div class="protocol-controls">
  <input type="text" id="search-box" placeholder="Search cocktails..." class="search-input">
  <button id="shuffle-btn" class="shuffle-btn" aria-label="Shuffle random cocktail" title="Random cocktail">
    🎲
  </button>
  <div class="filter-buttons" id="filter-buttons" role="group" aria-label="Filter by spirit">
    <button class="filter-btn active" data-base="all" aria-pressed="true">All</button>
    <button class="filter-btn" data-base="whiskey" aria-pressed="false">Whiskey</button>
    <button class="filter-btn" data-base="gin" aria-pressed="false">Gin</button>
    <button class="filter-btn" data-base="tequila" aria-pressed="false">Tequila</button>
    <button class="filter-btn" data-base="rum" aria-pressed="false">Rum</button>
    <button class="filter-btn" data-base="cognac" aria-pressed="false">Cognac</button>
    <button class="filter-btn" data-base="misc" aria-pressed="false">Misc</button>
  </div>
</div>

<!-- Cocktails will be rendered here -->
<div id="cocktails-grid" class="cocktails-grid"></div>

<script>
// Load and display cocktails
async function loadCocktails() {
  try {
    const response = await fetch('/cocktails.json');
    const data = await response.json();
    window.cocktailsData = data.cocktails;
    setupFilters();
    restoreFromURL();
  } catch (error) {
    console.error('Error loading cocktails:', error);
    document.getElementById('cocktails-grid').innerHTML = 
      '<p style="text-align: center; color: var(--color-text-light);">Failed to load cocktails</p>';
  }
}

// URL state management
function updateURL(base, searchTerm) {
  const url = new URL(window.location);
  if (base && base !== 'all') {
    url.searchParams.set('base', base);
  } else {
    url.searchParams.delete('base');
  }
  if (searchTerm) {
    url.searchParams.set('q', searchTerm);
  } else {
    url.searchParams.delete('q');
  }
  window.history.replaceState({}, '', url);
}

function restoreFromURL() {
  const params = new URLSearchParams(window.location.search);
  const base = params.get('base') || 'all';
  const searchTerm = params.get('q') || '';
  document.getElementById('search-box').value = searchTerm;
  document.querySelectorAll('.filter-btn').forEach(b => {
    const isActive = b.dataset.base === base;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
  filterCocktails(base, normalizeText(searchTerm));
}

function displayCocktails(cocktails, total, searchTerm = '') {
  const grid = document.getElementById('cocktails-grid');
  
  if (cocktails.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <p>No cocktails found</p>
        <button class="clear-search-btn" onclick="clearFilters()">Clear search</button>
      </div>`;
    return;
  }
  
  const countDisplay = total && cocktails.length < total 
    ? `<div class="results-count">Showing ${cocktails.length} of ${total} cocktails</div>`
    : `<div class="results-count">${cocktails.length} cocktails</div>`;
  
  grid.innerHTML = countDisplay + cocktails.map(cocktail => {
    const metaParts = [cocktail.year, cocktail.creator].filter(Boolean);
    const metaStr = metaParts.join(' · ');
    
    return `
    <div class="cocktail-card">
      <div class="cocktail-header">
        <h3 class="cocktail-name">${highlightName(cocktail.name, searchTerm)}</h3>
        ${metaStr ? `<div class="cocktail-meta">${metaStr}</div>` : ''}
        <div class="cocktail-base">${capitalizeFirst(cocktail.base)}</div>
      </div>
      <div class="cocktail-ingredients">
        ${cocktail.ingredients.map(ing => `
          <div class="ingredient-line">
            ${formatAmount(ing.amount)} ${ing.unit} ${highlightIngredient(ing.ingredient, searchTerm)}
          </div>
        `).join('')}
      </div>
      <div class="cocktail-instructions">${cocktail.instructions}</div>
    </div>
  `}).join('');
}

function formatAmount(amount) {
  if (typeof amount === 'string') return amount;
  const fractions = {
    0.25: '¼',
    0.33: '⅓',
    0.5: '½',
    0.67: '⅔',
    0.75: '¾',
    1.33: '1⅓',
    1.5: '1½',
    1.67: '1⅔',
    1.75: '1¾',
    2.5: '2½'
  };
  return fractions[amount] || amount;
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function normalizeText(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[-''`]/g, ' ').replace(/[^\w\s]/g, '')
    .toLowerCase().replace(/\s+/g, ' ').trim();
}

function matchesWordStart(text, searchTerms) {
  const words = normalizeText(text).split(' ');
  const terms = searchTerms.split(' ').filter(t => t.length > 0);
  return terms.every(term => words.some(w => w.startsWith(term)));
}

function highlightName(name, searchTerms) {
  if (!searchTerms || searchTerms.length < 2) return name;
  return matchesWordStart(name, searchTerms) ? `<mark>${name}</mark>` : name;
}

function highlightIngredient(text, searchTerms) {
  if (!searchTerms || searchTerms.length < 2) return text;
  const terms = searchTerms.split(' ').filter(t => t.length > 0);
  let result = text;
  terms.forEach(term => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match accented chars by normalizing during match
    result = result.replace(new RegExp(`(\\b)([^\\s]*${escaped}[^\\s]*)`, 'gi'), (match, boundary, word) => {
      if (normalizeText(word).startsWith(term)) return boundary + '<mark>' + word + '</mark>';
      return match;
    });
  });
  return result;
}

function setupFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      const base = btn.dataset.base;
      const searchTerm = normalizeText(document.getElementById('search-box').value);
      filterCocktails(base, searchTerm);
      updateURL(base, document.getElementById('search-box').value);
    });
  });

  document.getElementById('search-box').addEventListener('input', (e) => {
    const searchTerm = normalizeText(e.target.value);
    const activeBase = document.querySelector('.filter-btn.active').dataset.base;
    filterCocktails(activeBase, searchTerm);
    updateURL(activeBase, e.target.value);
  });

  document.getElementById('shuffle-btn').addEventListener('click', shuffleCocktail);
}

function filterCocktails(base, searchTerm) {
  let filtered = window.cocktailsData;
  const total = filtered.length;

  if (base !== 'all') filtered = filtered.filter(c => c.base === base);

  if (searchTerm && searchTerm.length >= 2) {
    filtered = filtered.filter(c => {
      const nameMatch = matchesWordStart(c.name, searchTerm);
      const ingredientMatch = c.ingredients.some(ing => matchesWordStart(ing.ingredient, searchTerm));
      return nameMatch || ingredientMatch;
    });
    filtered.sort((a, b) => {
      const aName = matchesWordStart(a.name, searchTerm);
      const bName = matchesWordStart(b.name, searchTerm);
      return (bName ? 1 : 0) - (aName ? 1 : 0);
    });
  }

  displayCocktails(filtered, total, searchTerm);
}

function clearFilters() {
  document.getElementById('search-box').value = '';
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
  const allBtn = document.querySelector('.filter-btn[data-base="all"]');
  allBtn.classList.add('active');
  allBtn.setAttribute('aria-pressed', 'true');
  displayCocktails(window.cocktailsData, window.cocktailsData.length, '');
  updateURL('all', '');
}

function shuffleCocktail() {
  document.getElementById('search-box').value = '';
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-btn[data-base="all"]').classList.add('active');
  const randomCocktail = window.cocktailsData[Math.floor(Math.random() * window.cocktailsData.length)];
  displayCocktails([randomCocktail], null, '');
  document.getElementById('cocktails-grid').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Initialize on page load
loadCocktails();
</script>