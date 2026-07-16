import PhotoSwipeLightbox from '../vendor/photoswipe/photoswipe-lightbox.esm.min.js';

const justifiedGallery = document.querySelector('[data-justified-gallery]');

if (justifiedGallery) {
  const items = Array.from(justifiedGallery.querySelectorAll('[data-gallery-trigger]'));
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
    const gap = compact ? 6 : 10;
    const targetHeight = compact ? 138 : Math.min(250, Math.max(190, containerWidth * 0.19));
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
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const triggers = Array.from(gallery.querySelectorAll('[data-gallery-trigger]'));
  let lastViewed = null;

  const icon = (path) => `<svg class="pswp__icn" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">${path}</svg>`;
  const colorIcon = '<svg class="pswp__color-icon pswp__color-icon--color" viewBox="0 0 24 24" aria-hidden="true"><circle class="color-red" cx="12" cy="8" r="5"></circle><circle class="color-blue" cx="8.5" cy="14" r="5"></circle><circle class="color-yellow" cx="15.5" cy="14" r="5"></circle></svg><svg class="pswp__color-icon pswp__color-icon--bw" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 3v18"></path><path d="M12 3a9 9 0 0 1 0 18" fill="currentColor" opacity=".28"></path></svg>';
  const blurEnabled = () => document.documentElement.dataset.reduceTransparency !== 'on';

  const lightbox = new PhotoSwipeLightbox({
    gallery,
    children: '[data-gallery-trigger]',
    pswpModule: () => import('../vendor/photoswipe/photoswipe.esm.min.js'),
    bgOpacity: blurEnabled() ? 0.88 : 1,
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
      name: 'monochrome',
      className: 'pswp__button--monochrome',
      tagName: 'button',
      appendTo: 'bar',
      order: 8,
      html: colorIcon,
      onInit: (element) => {
        const update = () => {
          const monochrome = document.documentElement.dataset.monochrome === 'true';
          element.classList.toggle('is-monochrome', monochrome);
          element.setAttribute('aria-label', monochrome ? 'View photographs in color' : 'View photographs in black and white');
          element.setAttribute('title', monochrome ? 'Color' : 'B&W');
          element.setAttribute('aria-pressed', String(monochrome));
        };
        element.type = 'button';
        element.addEventListener('click', () => document.querySelector('#monochrome-toggle')?.click());
        window.addEventListener('sitepreferencechange', update);
        update();
      }
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

  window.addEventListener('sitepreferencechange', (event) => {
    if (event.detail?.attribute !== 'data-reduce-transparency' || !lightbox.pswp) return;
    const opacity = blurEnabled() ? 0.88 : 1;
    lightbox.pswp.options.bgOpacity = opacity;
    lightbox.pswp.applyBgOpacity(1);
  });

  lightbox.on('change', () => {
    lastViewed = lightbox.pswp?.currSlide?.data?.element || null;
    window.requestAnimationFrame(() => {
      const counter = document.querySelector('.pswp__counter');
      const currentIndex = lightbox.pswp?.currIndex;
      if (!counter || currentIndex === undefined) return;
      const digits = Math.max(2, String(triggers.length).length);
      counter.textContent = `${String(currentIndex + 1).padStart(digits, '0')} / ${String(triggers.length).padStart(digits, '0')}`;
    });
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
