/* ===============================================
 * Cocktail Protocols — Filter, Search & Display
 * =============================================== */
(function () {
  'use strict';

  /* ---------- cached DOM refs ---------- */
  const $grid       = document.getElementById('cocktails-grid');
  const $search     = document.getElementById('search-box');
  const $shuffle    = document.getElementById('shuffle-btn');
  const $count      = document.getElementById('results-count');
  const $filterBtns = document.querySelectorAll('.filter-btn');

  if (!$grid || !$search) return;          // not on the protocols page

  let cocktailsData = [];

  /* ---------- fraction map ---------- */
  const FRACTIONS = {
    0.25: '¼', 0.33: '⅓', 0.5: '½', 0.67: '⅔', 0.75: '¾',
    1.33: '1⅓', 1.5: '1½', 1.67: '1⅔', 1.75: '1¾', 2.5: '2½'
  };

  /* ===============================================
   * UTILITY HELPERS
   * =============================================== */
  function formatAmount(n) {
    return typeof n === 'string' ? n : (FRACTIONS[n] || n);
  }

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function normalizeText(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[-\u2018\u2019`]/g, ' ')
      .replace(/[^\w\s]/g, '')
      .toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function matchesWordStart(text, terms) {
    const words = normalizeText(text).split(' ');
    return terms.every(t => words.some(w => w.startsWith(t)));
  }

  /* ---------- simple highlight ---------- */
  function highlight(text, terms) {
    if (!terms.length) return text;
    // Build a single regex that matches any term at a word boundary
    const pattern = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    return text.replace(new RegExp(`(${pattern})`, 'gi'), '<mark>$1</mark>');
  }

  /* ---------- debounce ---------- */
  function debounce(fn, ms) {
    let id;
    return function (...args) {
      clearTimeout(id);
      id = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  /* ===============================================
   * URL STATE
   * =============================================== */
  function updateURL(base, rawSearch) {
    const url = new URL(window.location);
    base && base !== 'all' ? url.searchParams.set('base', base) : url.searchParams.delete('base');
    rawSearch ? url.searchParams.set('q', rawSearch) : url.searchParams.delete('q');
    history.replaceState({}, '', url);
  }

  function getActiveBase() {
    const btn = document.querySelector('.filter-btn.active');
    return btn ? btn.dataset.base : 'all';
  }

  /* ===============================================
   * RENDER
   * =============================================== */
  function renderCount(shown, total) {
    if (!$count) return;
    $count.textContent = (total && shown < total)
      ? `Showing ${shown} of ${total}`
      : `${shown} cocktails`;
  }

  function renderCards(cocktails, terms) {
    if (!cocktails.length) {
      $grid.innerHTML = `
        <div class="no-results">
          <p>No cocktails found</p>
          <button class="clear-search-btn" onclick="window.__clearFilters()">Clear search</button>
        </div>`;
      return;
    }

    $grid.innerHTML = cocktails.map(c => {
      const meta = [c.year, c.creator].filter(Boolean).join(' · ');
      const name = terms.length && matchesWordStart(c.name, terms)
        ? `<mark>${c.name}</mark>` : c.name;

      return `
      <div class="cocktail-card">
        <div class="cocktail-header">
          <h3 class="cocktail-name">${name}</h3>
          ${meta ? `<div class="cocktail-meta">${meta}</div>` : ''}
          <div class="cocktail-base">${capitalize(c.base)}</div>
        </div>
        <div class="cocktail-ingredients">
          ${c.ingredients.map(i =>
            `<div class="ingredient-line">${formatAmount(i.amount)} ${i.unit} ${highlight(i.ingredient, terms)}</div>`
          ).join('')}
        </div>
        <div class="cocktail-instructions">${c.instructions}</div>
      </div>`;
    }).join('');
  }

  /* ===============================================
   * FILTER LOGIC
   * =============================================== */
  function applyFilters(base, rawSearch) {
    let list = cocktailsData;
    const total = list.length;

    if (base !== 'all') list = list.filter(c => c.base === base);

    const terms = normalizeText(rawSearch).split(' ').filter(t => t.length >= 2);

    if (terms.length) {
      list = list.filter(c =>
        matchesWordStart(c.name, terms) ||
        c.ingredients.some(i => matchesWordStart(i.ingredient, terms))
      );
      // Name matches first
      list.sort((a, b) =>
        (matchesWordStart(b.name, terms) ? 1 : 0) -
        (matchesWordStart(a.name, terms) ? 1 : 0)
      );
    }

    renderCount(list.length, total);
    renderCards(list, terms);
  }

  /* ===============================================
   * EVENT SETUP
   * =============================================== */
  function setActiveBtn(target) {
    $filterBtns.forEach(b => {
      const active = b === target;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', active);
    });
  }

  function clearFilters() {
    $search.value = '';
    const allBtn = document.querySelector('.filter-btn[data-base="all"]');
    setActiveBtn(allBtn);
    applyFilters('all', '');
    updateURL('all', '');
  }
  // Expose for inline onclick in no-results button
  window.__clearFilters = clearFilters;

  function shuffleCocktail() {
    $search.value = '';
    const allBtn = document.querySelector('.filter-btn[data-base="all"]');
    setActiveBtn(allBtn);
    const pick = cocktailsData[Math.floor(Math.random() * cocktailsData.length)];
    renderCount(1, null);
    renderCards([pick], []);
    $grid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function setupEvents() {
    // Filter buttons
    $filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        setActiveBtn(btn);
        applyFilters(btn.dataset.base, $search.value);
        updateURL(btn.dataset.base, $search.value);
      });
    });

    // Debounced search
    $search.addEventListener('input', debounce(() => {
      const base = getActiveBase();
      applyFilters(base, $search.value);
      updateURL(base, $search.value);
    }, 150));

    // Shuffle
    if ($shuffle) $shuffle.addEventListener('click', shuffleCocktail);
  }

  /* ===============================================
   * INIT
   * =============================================== */
  async function init() {
    try {
      const res = await fetch('/cocktails.json');
      const data = await res.json();
      cocktailsData = data.cocktails;

      setupEvents();

      // Restore state from URL
      const params = new URLSearchParams(location.search);
      const base = params.get('base') || 'all';
      const q = params.get('q') || '';
      $search.value = q;
      const targetBtn = document.querySelector(`.filter-btn[data-base="${base}"]`)
        || document.querySelector('.filter-btn[data-base="all"]');
      setActiveBtn(targetBtn);
      applyFilters(base, q);
    } catch (err) {
      console.error('Error loading cocktails:', err);
      $grid.innerHTML = '<p style="text-align:center;color:var(--color-text-light)">Failed to load cocktails</p>';
    }
  }

  init();
})();
