import PhotoSwipeLightbox from '../vendor/photoswipe/photoswipe-lightbox.esm.min.js';

const justifiedGallery = document.querySelector('[data-justified-gallery]');

if (justifiedGallery) {
  const items = Array.from(justifiedGallery.querySelectorAll('[data-gallery-trigger]'));
  const spacious = justifiedGallery.dataset.justifiedGallery === 'spacious';
  let frame = 0;

  const placeRow = (row, top, containerWidth, gap, targetHeight, justify) => {
    const ratioTotal = row.reduce((total, item) => total + item.ratio, 0);
    const availableWidth = containerWidth - gap * (row.length - 1);
    const naturalHeight = availableWidth / ratioTotal;
    const height = justify ? naturalHeight : Math.min(targetHeight, naturalHeight);
    let left = 0;

    row.forEach((item, index) => {
      const width = index === row.length - 1 && justify
        ? containerWidth - left
        : height * item.ratio;
      Object.assign(item.element.style, {
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`
      });
      left += width + gap;
    });

    return height;
  };

  const layout = () => {
    const containerWidth = justifiedGallery.clientWidth;
    if (!containerWidth) return;

    const compact = containerWidth < 620;
    const gap = compact ? (spacious ? 10 : 6) : (spacious ? 18 : 10);
    const targetHeight = compact
      ? (spacious ? 320 : 138)
      : (spacious
          ? Math.min(440, Math.max(300, containerWidth * 0.36))
          : Math.min(250, Math.max(190, containerWidth * 0.19)));
    const rows = [];
    let row = [];
    let ratioTotal = 0;

    items.forEach((element) => {
      const width = Number(element.dataset.pswpWidth) || 1;
      const height = Number(element.dataset.pswpHeight) || 1;
      const item = { element, ratio: width / height };
      row.push(item);
      ratioTotal += item.ratio;

      if ((ratioTotal * targetHeight) + gap * (row.length - 1) >= containerWidth) {
        rows.push(row);
        row = [];
        ratioTotal = 0;
      }
    });
    if (row.length) rows.push(row);

    let top = 0;
    rows.forEach((currentRow, index) => {
      const isLast = index === rows.length - 1;
      top += placeRow(currentRow, top, containerWidth, gap, targetHeight, !isLast);
      if (!isLast) top += gap;
    });

    justifiedGallery.style.height = `${Math.ceil(top)}px`;
    justifiedGallery.classList.add('is-justified');
  };

  const scheduleLayout = () => {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(layout);
  };

  if ('ResizeObserver' in window) {
    new ResizeObserver(scheduleLayout).observe(justifiedGallery);
  } else {
    window.addEventListener('resize', scheduleLayout, { passive: true });
  }
  scheduleLayout();
}

const gallery = document.querySelector('[data-photo-gallery]');

if (gallery) {
  const galleryItems = Array.from(gallery.querySelectorAll('[data-gallery-trigger]'));
  let returnTarget = null;
  let keyboardInput = false;
  document.addEventListener('keydown', () => { keyboardInput = true; }, true);
  document.addEventListener('pointerdown', () => { keyboardInput = false; }, true);
  const icon = (path) => `<svg class="pswp__icn" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">${path}</svg>`;
  const controlIcons = (selector) => Array.from(document.querySelectorAll(`${selector} > svg`))
    .map((svg) => svg.outerHTML)
    .join('');
  const preferenceControls = [
    { name: 'theme', source: '#header-theme-toggle', toggleClass: 'theme-toggle', attribute: 'data-theme', order: 7 },
    { name: 'monochrome', source: '#monochrome-toggle', toggleClass: 'monochrome-toggle', attribute: 'data-monochrome', order: 8 },
    { name: 'transparency', source: '#reduce-transparency-toggle', toggleClass: 'reduce-transparency-toggle', attribute: 'data-reduce-transparency', order: 9 }
  ];

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
    initialZoomLevel: 'fit',
    secondaryZoomLevel: (level) => level.initial * 2,
    maxZoomLevel: (level) => level.initial * 3,
    returnFocus: false,
    paddingFn: () => ({ top: 64, bottom: 68, left: 24, right: 24 }),
    showHideAnimationType: 'fade',
    showAnimationDuration: 220,
    hideAnimationDuration: 180,
    zoomAnimationDuration: 260,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    closeTitle: 'Close photograph viewer',
    zoomTitle: 'Toggle 200% zoom',
    arrowPrevTitle: 'Previous photograph',
    arrowNextTitle: 'Next photograph',
    indexIndicatorSep: ' / ',
    arrowPrevSVG: icon('<path d="m15 5-7 7 7 7"/>'),
    arrowNextSVG: icon('<path d="m9 5 7 7-7 7"/>'),
    closeSVG: icon('<path d="M6 6l12 12M18 6 6 18"/>'),
    zoomSVG: icon('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5M10.5 7.5v6M7.5 10.5h6"/>')
  });

  lightbox.on('change', () => {
    returnTarget = galleryItems[lightbox.pswp?.currIndex] || null;
  });

  lightbox.on('destroy', () => {
    const target = returnTarget;
    returnTarget = null;
    if (!target?.isConnected) return;

    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    window.requestAnimationFrame(() => {
      if (keyboardInput) target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior, block: 'center', inline: 'nearest' });
    });
  });

  lightbox.on('uiRegister', () => {
    preferenceControls.forEach((control) => {
      const source = document.querySelector(control.source);
      if (!source) return;

      lightbox.pswp.ui.registerElement({
        name: control.name,
        className: 'pswp__button--preference',
        isButton: true,
        appendTo: 'bar',
        order: control.order,
        html: controlIcons(control.source),
        onClick: (event, element) => window.dispatchEvent(new CustomEvent('sitepreferenceactivate', {
          detail: { attribute: control.attribute, origin: element }
        })),
        onInit: (element, pswp) => {
          const sync = () => {
            ['aria-label', 'title', 'aria-pressed'].forEach((attribute) => {
              const value = source.getAttribute(attribute);
              if (value === null) element.removeAttribute(attribute);
              else element.setAttribute(attribute, value);
            });
          };
          const scheduleSync = () => Promise.resolve().then(sync);

          element.classList.add(control.toggleClass);
          window.addEventListener('sitepreferencechange', scheduleSync);
          pswp.on('destroy', () => window.removeEventListener('sitepreferencechange', scheduleSync));
          sync();
        }
      });
    });

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

  lightbox.init();
}
