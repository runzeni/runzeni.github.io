import PhotoSwipeLightbox from '../vendor/photoswipe/photoswipe-lightbox.esm.min.js';

const gallery = document.querySelector('[data-photo-gallery]');

if (gallery) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const triggers = Array.from(gallery.querySelectorAll('[data-gallery-trigger]'));
  let lastViewed = null;

  const icon = (path) => `<svg class="pswp__icn" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">${path}</svg>`;

  const lightbox = new PhotoSwipeLightbox({
    gallery,
    children: '[data-gallery-trigger]',
    pswpModule: () => import('../vendor/photoswipe/photoswipe.esm.min.js'),
    bgOpacity: 1,
    loop: false,
    spacing: 0.12,
    preload: [1, 2],
    wheelToZoom: true,
    imageClickAction: 'zoom',
    bgClickAction: false,
    tapAction: 'toggle-controls',
    doubleTapAction: 'zoom',
    clickToCloseNonZoomable: false,
    returnFocus: false,
    initialZoomLevel: 'fit',
    secondaryZoomLevel: (level) => level.initial * 1.5,
    maxZoomLevel: (level) => level.initial * 3,
    paddingFn: () => ({ top: 64, bottom: 68, left: 24, right: 24 }),
    showAnimationDuration: reducedMotion.matches ? 0 : 260,
    hideAnimationDuration: reducedMotion.matches ? 0 : 220,
    zoomAnimationDuration: reducedMotion.matches ? 0 : 260,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    closeTitle: 'Close photograph viewer',
    zoomTitle: 'Toggle 150% zoom',
    arrowPrevTitle: 'Previous photograph',
    arrowNextTitle: 'Next photograph',
    indexIndicatorSep: ' / ',
    arrowPrevSVG: icon('<path d="m15 5-7 7 7 7"/>'),
    arrowNextSVG: icon('<path d="m9 5 7 7-7 7"/>'),
    closeSVG: icon('<path d="M6 6l12 12M18 6 6 18"/>'),
    zoomSVG: icon('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5M10.5 7.5v6M7.5 10.5h6"/>')
  });

  lightbox.on('uiRegister', () => {
    lightbox.pswp.ui.registerElement({
      name: 'zoom-range',
      className: 'pswp__zoom-range',
      tagName: 'div',
      appendTo: 'root',
      order: 8,
      html: '<label><span>Zoom</span><input type="range" min="100" max="300" value="100" step="1" aria-label="Photo zoom, 100 percent"></label><output aria-hidden="true">100%</output>',
      onInit: (element, pswp) => {
        const input = element.querySelector('input');
        const output = element.querySelector('output');
        if (!input || !output) return;

        const update = () => {
          const slide = pswp.currSlide;
          if (!slide) return;
          const relativeZoom = Math.round((slide.currZoomLevel / slide.zoomLevels.initial) * 100);
          const value = Math.min(300, Math.max(100, relativeZoom));
          input.value = String(value);
          input.setAttribute('aria-label', `Photo zoom, ${value} percent`);
          output.value = `${value}%`;
        };

        input.addEventListener('input', () => {
          const slide = pswp.currSlide;
          if (!slide) return;
          const target = slide.zoomLevels.initial * (Number(input.value) / 100);
          slide.zoomTo(target, pswp.getViewportCenterPoint(), 0);
        });
        input.addEventListener('pointerdown', (event) => event.stopPropagation());
        input.addEventListener('click', (event) => event.stopPropagation());
        pswp.on('zoomPanUpdate', update);
        pswp.on('change', update);
        update();
      }
    });
  });

  lightbox.on('change', () => {
    lastViewed = lightbox.pswp?.currSlide?.data?.element || null;
  });

  lightbox.on('close', () => {
    lastViewed = lightbox.pswp?.currSlide?.data?.element || lastViewed;
    if (lastViewed) lastViewed.scrollIntoView({ block: 'center', inline: 'nearest' });
  });

  lightbox.on('destroy', () => {
    if (!lastViewed) return;
    window.requestAnimationFrame(() => lastViewed.focus({ preventScroll: true }));
  });

  lightbox.init();

  // The source link remains a usable full-size image if modules are unavailable.
  triggers.forEach((trigger) => trigger.removeAttribute('data-gallery-pending'));
}
