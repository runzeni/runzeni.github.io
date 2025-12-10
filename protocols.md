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
  <div class="filter-buttons" id="filter-buttons">
    <button class="filter-btn active" data-base="all">All</button>
    <button class="filter-btn" data-base="whiskey">Whiskey</button>
    <button class="filter-btn" data-base="gin">Gin</button>
    <button class="filter-btn" data-base="tequila">Tequila</button>
    <button class="filter-btn" data-base="rum">Rum</button>
    <button class="filter-btn" data-base="cognac">Cognac</button>
    <button class="filter-btn" data-base="misc">Misc</button>
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
    displayCocktails(window.cocktailsData);
    setupFilters();
  } catch (error) {
    console.error('Error loading cocktails:', error);
    document.getElementById('cocktails-grid').innerHTML = 
      '<p style="text-align: center; color: var(--color-text-light);">Failed to load cocktails</p>';
  }
}

function displayCocktails(cocktails) {
  const grid = document.getElementById('cocktails-grid');
  
  if (cocktails.length === 0) {
    grid.innerHTML = '<p style="text-align: center; color: var(--color-text-light); margin: 3rem 0;">No cocktails found</p>';
    return;
  }
  
  grid.innerHTML = cocktails.map(cocktail => `
    <div class="cocktail-card">
      <div class="cocktail-header">
        <h3 class="cocktail-name">${cocktail.name}</h3>
        <div class="cocktail-meta">${cocktail.year || ''} ${cocktail.creator ? ', ' + cocktail.creator : ''}</div>
        <div class="cocktail-base">${capitalizeFirst(cocktail.base)}</div>
      </div>
      <div class="cocktail-ingredients">
        ${cocktail.ingredients.map(ing => `
          <div class="ingredient-line">
            ${formatAmount(ing.amount)} ${ing.unit} ${ing.ingredient}
          </div>
        `).join('')}
      </div>
      <div class="cocktail-instructions">${cocktail.instructions}</div>
    </div>
  `).join('');
}

function formatAmount(amount) {
  if (typeof amount === 'string') return amount;
  // Convert decimals to fractions for display
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

function setupFilters() {
  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const base = btn.dataset.base;
      const searchTerm = document.getElementById('search-box').value.toLowerCase();
      filterCocktails(base, searchTerm);
    });
  });
  
  // Search box
  document.getElementById('search-box').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const activeBase = document.querySelector('.filter-btn.active').dataset.base;
    filterCocktails(activeBase, searchTerm);
  });

  // Shuffle button
  document.getElementById('shuffle-btn').addEventListener('click', shuffleCocktail);
}

function filterCocktails(base, searchTerm) {
  let filtered = window.cocktailsData;

  // Filter by base
  if (base !== 'all') {
    filtered = filtered.filter(c => c.base === base);
  }

  // Filter by search term (name or ingredients)
  if (searchTerm) {
    filtered = filtered.filter(c => {
      const nameMatch = c.name.toLowerCase().includes(searchTerm);
      const ingredientMatch = c.ingredients.some(ing =>
        ing.ingredient.toLowerCase().includes(searchTerm)
      );
      return nameMatch || ingredientMatch;
    });
  }

  displayCocktails(filtered);
}

function shuffleCocktail() {
  // Reset search box
  document.getElementById('search-box').value = '';

  // Reset filter to "All"
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-btn[data-base="all"]').classList.add('active');

  // Pick random cocktail
  const randomIndex = Math.floor(Math.random() * window.cocktailsData.length);
  const randomCocktail = window.cocktailsData[randomIndex];

  // Display only the random cocktail
  displayCocktails([randomCocktail]);

  // Smooth scroll to show results (just past the subtitle)
  document.getElementById('cocktails-grid').scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });
}

// Initialize on page load
loadCocktails();
</script>