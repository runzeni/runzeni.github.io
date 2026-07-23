(() => {
  'use strict';

  const grid = document.querySelector('#cocktails-grid');
  const form = document.querySelector('#protocol-filters');
  const search = document.querySelector('#search-box');
  const shuffle = document.querySelector('#shuffle-btn');
  const count = document.querySelector('#results-count');
  const empty = document.querySelector('#no-results');
  const clear = document.querySelector('#clear-filters');
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  if (!grid || !form || !search || !shuffle || !count || !empty || !clear) return;

  const fractions = new Map([
    [0.25, '¼'], [0.33, '⅓'], [0.5, '½'], [0.67, '⅔'], [0.75, '¾'],
    [1.33, '1⅓'], [1.5, '1½'], [1.67, '1⅔'], [1.75, '1¾'], [2.5, '2½']
  ]);

  grid.querySelectorAll('.ingredient-amount').forEach((element) => {
    const value = Number(element.dataset.amount);
    element.textContent = fractions.get(value) || element.dataset.amount;
  });

  const normalize = (value) => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-\u2018\u2019`]/g, ' ')
    .replace(/[^\w\s]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  const termsFor = (value) => normalize(value).split(' ').filter((term) => term.length >= 2);
  const matches = (value, terms) => {
    const words = normalize(value).split(' ');
    return terms.every((term) => words.some((word) => word.startsWith(term)));
  };

  const cocktails = Array.from(grid.querySelectorAll('.cocktail-card'), (element) => ({
    element,
    base: element.dataset.base,
    name: element.dataset.name,
    ingredients: Array.from(element.querySelectorAll('.ingredient-name'), (item) => item.textContent)
  }));

  const debounce = (callback, delay) => {
    let timer;
    return (...args) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => callback(...args), delay);
    };
  };

  const activeBase = () => document.querySelector('.filter-btn.active')?.dataset.base || 'all';

  const setActiveBase = (base) => {
    const target = filterButtons.find((button) => button.dataset.base === base) || filterButtons[0];
    filterButtons.forEach((button) => {
      const active = button === target;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    return target.dataset.base;
  };

  const updateUrl = (base, query) => {
    const url = new URL(window.location.href);
    if (base === 'all') url.searchParams.delete('base');
    else url.searchParams.set('base', base);
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    window.history.replaceState({}, '', url);
  };

  const apply = (base, rawQuery, updateHistory = false) => {
    const selectedBase = setActiveBase(base);
    const terms = termsFor(rawQuery);
    let shown = 0;

    cocktails.forEach((cocktail) => {
      const baseMatches = selectedBase === 'all' || cocktail.base === selectedBase;
      const textMatches = !terms.length
        || matches(cocktail.name, terms)
        || cocktail.ingredients.some((ingredient) => matches(ingredient, terms));
      const visible = baseMatches && textMatches;
      cocktail.element.hidden = !visible;
      if (visible) shown += 1;
    });

    search.value = rawQuery;
    empty.hidden = shown > 0;
    count.textContent = shown === cocktails.length ? `${shown} cocktails` : `Showing ${shown} of ${cocktails.length}`;
    if (updateHistory) updateUrl(selectedBase, rawQuery);
  };

  const randomCocktail = () => {
    const chosen = cocktails[Math.floor(Math.random() * cocktails.length)];
    cocktails.forEach((cocktail) => { cocktail.element.hidden = cocktail !== chosen; });
    empty.hidden = true;
    search.value = '';
    setActiveBase('all');
    count.textContent = 'One random cocktail';
    updateUrl('all', '');
    shuffle.classList.remove('is-shuffling');
    window.requestAnimationFrame(() => shuffle.classList.add('is-shuffling'));
    grid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const parameters = new URLSearchParams(window.location.search);
  apply(parameters.get('base') || 'all', parameters.get('q') || '');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => apply(button.dataset.base, search.value, true));
  });
  search.addEventListener('input', debounce(() => apply(activeBase(), search.value, true), 140));
  clear.addEventListener('click', () => apply('all', '', true));
  shuffle.addEventListener('click', randomCocktail);
  shuffle.addEventListener('animationend', () => shuffle.classList.remove('is-shuffling'));
  form.addEventListener('submit', (event) => event.preventDefault());
})();
