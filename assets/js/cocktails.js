(() => {
  'use strict';

  const grid = document.querySelector('#cocktails-grid');
  const form = document.querySelector('#protocol-filters');
  const search = document.querySelector('#search-box');
  const shuffle = document.querySelector('#shuffle-btn');
  const count = document.querySelector('#results-count');
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  if (!grid || !form || !search || !shuffle || !count) return;

  let cocktails = [];
  const fractions = new Map([
    [0.25, '¼'], [0.33, '⅓'], [0.5, '½'], [0.67, '⅔'], [0.75, '¾'],
    [1.33, '1⅓'], [1.5, '1½'], [1.67, '1⅔'], [1.75, '1¾'], [2.5, '2½']
  ]);

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

  const debounce = (callback, delay) => {
    let timer;
    return (...args) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => callback(...args), delay);
    };
  };

  const appendHighlighted = (element, value, terms) => {
    const text = String(value || '');
    if (!terms.length) {
      element.textContent = text;
      return;
    }

    const expression = new RegExp(`(${terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    let position = 0;
    for (const match of text.matchAll(expression)) {
      if (match.index > position) element.append(document.createTextNode(text.slice(position, match.index)));
      const mark = document.createElement('mark');
      mark.textContent = match[0];
      element.append(mark);
      position = match.index + match[0].length;
    }
    if (position < text.length) element.append(document.createTextNode(text.slice(position)));
  };

  const amount = (value) => typeof value === 'number' ? (fractions.get(value) || String(value)) : String(value || '');
  const titleCase = (value) => value ? value.charAt(0).toUpperCase() + value.slice(1) : '';

  const validate = (data) => {
    if (!data || !Array.isArray(data.cocktails)) return null;
    const valid = data.cocktails.filter((cocktail) => (
      cocktail && typeof cocktail.name === 'string' && typeof cocktail.base === 'string' && Array.isArray(cocktail.ingredients)
    ));
    return valid.length === data.cocktails.length ? valid : null;
  };

  const activeBase = () => {
    const button = document.querySelector('.filter-btn.active');
    return button ? button.dataset.base : 'all';
  };

  const setActiveBase = (base) => {
    const target = filterButtons.find((button) => button.dataset.base === base) || filterButtons.find((button) => button.dataset.base === 'all');
    filterButtons.forEach((button) => {
      const active = button === target;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    return target ? target.dataset.base : 'all';
  };

  const updateUrl = (base, query) => {
    const url = new URL(window.location.href);
    if (base && base !== 'all') url.searchParams.set('base', base);
    else url.searchParams.delete('base');
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    window.history.replaceState({}, '', url);
  };

  const renderCount = (shown, total, random = false) => {
    count.textContent = random ? 'One random cocktail' : (shown === total ? `${shown} cocktails` : `Showing ${shown} of ${total}`);
  };

  const emptyState = () => {
    const wrapper = document.createElement('div');
    wrapper.className = 'no-results';
    const message = document.createElement('p');
    message.textContent = 'No cocktails found.';
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'clear-search-btn';
    clear.textContent = 'Clear filters';
    clear.addEventListener('click', () => apply('all', '', { updateHistory: true }));
    wrapper.append(message, clear);
    grid.replaceChildren(wrapper);
  };

  const card = (cocktail, terms) => {
    const article = document.createElement('article');
    article.className = 'cocktail-card';

    const header = document.createElement('header');
    header.className = 'cocktail-header';
    const name = document.createElement('h2');
    name.className = 'cocktail-name';
    appendHighlighted(name, cocktail.name, terms);
    header.append(name);

    const metadata = [cocktail.year, cocktail.creator].filter(Boolean).join(' · ');
    if (metadata) {
      const meta = document.createElement('p');
      meta.className = 'cocktail-meta';
      meta.textContent = metadata;
      header.append(meta);
    }

    const base = document.createElement('p');
    base.className = 'cocktail-base';
    base.textContent = titleCase(cocktail.base);
    header.append(base);

    const ingredients = document.createElement('div');
    ingredients.className = 'cocktail-ingredients';
    cocktail.ingredients.forEach((ingredient) => {
      const line = document.createElement('p');
      line.className = 'ingredient-line';
      const prefix = [amount(ingredient.amount), ingredient.unit].filter(Boolean).join(' ');
      if (prefix) line.append(document.createTextNode(`${prefix} `));
      appendHighlighted(line, ingredient.ingredient, terms);
      ingredients.append(line);
    });

    const instructions = document.createElement('p');
    instructions.className = 'cocktail-instructions';
    instructions.textContent = cocktail.instructions || '';
    article.append(header, ingredients, instructions);
    return article;
  };

  const render = (list, terms) => {
    if (!list.length) {
      emptyState();
      return;
    }
    const fragment = document.createDocumentFragment();
    list.forEach((cocktail) => fragment.append(card(cocktail, terms)));
    grid.replaceChildren(fragment);
  };

  const apply = (base, rawQuery, { updateHistory = false } = {}) => {
    const normalizedBase = setActiveBase(base);
    const terms = termsFor(rawQuery);
    let list = cocktails;
    if (normalizedBase !== 'all') list = list.filter((cocktail) => cocktail.base === normalizedBase);
    if (terms.length) {
      list = list.filter((cocktail) => matches(cocktail.name, terms) || cocktail.ingredients.some((ingredient) => matches(ingredient.ingredient, terms)));
      list = [...list].sort((first, second) => Number(matches(second.name, terms)) - Number(matches(first.name, terms)));
    }

    search.value = rawQuery;
    renderCount(list.length, cocktails.length);
    render(list, terms);
    if (updateHistory) updateUrl(normalizedBase, rawQuery);
  };

  const randomCocktail = () => {
    if (!cocktails.length) return;
    shuffle.classList.remove('is-shuffling');
    window.requestAnimationFrame(() => shuffle.classList.add('is-shuffling'));
    const chosen = cocktails[Math.floor(Math.random() * cocktails.length)];
    search.value = '';
    setActiveBase('all');
    renderCount(1, cocktails.length, true);
    render([chosen], []);
    updateUrl('all', '');
    grid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const showError = () => {
    grid.setAttribute('aria-busy', 'false');
    const message = document.createElement('p');
    message.className = 'protocol-error';
    message.setAttribute('role', 'alert');
    message.textContent = 'Interactive filters are unavailable; the recipe list remains available below.';
    grid.prepend(message);
    const shown = grid.querySelectorAll('.cocktail-card').length;
    count.textContent = shown ? `${shown} cocktails · filters unavailable` : 'Unavailable';
  };

  const initialize = async () => {
    grid.setAttribute('aria-busy', 'true');
    try {
      const response = await fetch(grid.dataset.endpoint, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Unexpected response: ${response.status}`);
      cocktails = validate(await response.json());
      if (!cocktails) throw new Error('Cocktail data did not match the expected schema.');

      grid.setAttribute('aria-busy', 'false');
      const parameters = new URLSearchParams(window.location.search);
      const base = parameters.get('base') || 'all';
      const query = parameters.get('q') || '';
      apply(base, query);

      filterButtons.forEach((button) => {
        button.addEventListener('click', () => apply(button.dataset.base, search.value, { updateHistory: true }));
      });
      search.addEventListener('input', debounce(() => apply(activeBase(), search.value, { updateHistory: true }), 140));
      shuffle.addEventListener('click', randomCocktail);
      shuffle.addEventListener('animationend', () => shuffle.classList.remove('is-shuffling'));
      form.addEventListener('submit', (event) => event.preventDefault());
    } catch (error) {
      console.error(error);
      showError();
    }
  };

  initialize();
})();
