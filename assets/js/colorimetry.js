import {renderFigure} from './colorimetry-models.mjs';

// Static figures stay intact if scripts or the data request are unavailable.
let observerData;
const loadData = () => observerData ??= fetch(new URL('../data/colorimetry-observers.json', import.meta.url))
  .then(response => { if (!response.ok) throw new Error('Observer data unavailable'); return response.json(); });

async function initialize(figure) {
  try {
    const data = await loadData();
    const visual = figure.querySelector('.color-study__visual');
    const control = figure.querySelector('input[type=range]');
    const choices = [...figure.querySelectorAll('[data-figure-value]')];
    let choice = choices.find(button => button.getAttribute('aria-pressed') === 'true')?.dataset.figureValue;
    const output = figure.querySelector('output');
    const readout = figure.querySelector('.color-study__readout');
    let previousWidth = 0;
    const render = () => {
      const width = Math.max(280, Math.round(visual.clientWidth));
      const {html, readout: message} = renderFigure(figure.dataset.colorFigure, control?.value ?? choice, data, width);
      visual.innerHTML = html;
      if (readout) readout.textContent = message;
      if (output) output.value = control.value;
      previousWidth = width;
    };
    render();
    if (control || choices.length) {
      figure.querySelector('.color-study__controls').hidden = false;
      control?.addEventListener('input', render);
      choices.forEach(button => button.addEventListener('click', () => {
        choice = button.dataset.figureValue;
        choices.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        render();
      }));
    }
    if ('ResizeObserver' in window) new ResizeObserver(() => {
      if (Math.abs(visual.clientWidth - previousWidth) > 1) render();
    }).observe(visual);
    figure.dataset.ready = 'true';
  } catch {
    // The pre-rendered diagram, readout, and citation remain useful.
  }
}
const figures = document.querySelectorAll('[data-color-figure]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { observer.unobserve(entry.target); initialize(entry.target); }
  }), {rootMargin: '300px'});
  figures.forEach(figure => observer.observe(figure));
} else figures.forEach(initialize);
