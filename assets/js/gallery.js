(() => {
  'use strict';

  const triggers = Array.from(document.querySelectorAll('[data-gallery-trigger]'));
  const dialog = document.querySelector('#gallery-lightbox');
  const stage = dialog && dialog.querySelector('[data-gallery-stage]');
  const image = dialog && dialog.querySelector('[data-gallery-image]');
  const counter = dialog && dialog.querySelector('[data-gallery-counter]');
  const previous = dialog && dialog.querySelector('[data-gallery-prev]');
  const next = dialog && dialog.querySelector('[data-gallery-next]');
  const closeButton = dialog && dialog.querySelector('[data-gallery-close]');

  if (!triggers.length || !dialog || !stage || !image || !counter || !previous || !next || !closeButton) return;

  const groups = new Map();
  triggers.forEach((trigger) => {
    const name = trigger.dataset.gallery || 'default';
    const items = groups.get(name) || [];
    items.push(trigger);
    groups.set(name, items);
  });

  let items = [];
  let index = 0;
  let opener = null;
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let renderFrame = null;
  let gesture = null;
  let lastTap = null;
  const pointers = new Map();

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const isOpen = () => dialog.open || dialog.hasAttribute('open');

  const queueRender = () => {
    if (renderFrame !== null) return;
    renderFrame = window.requestAnimationFrame(() => {
      image.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
      stage.classList.toggle('is-zoomed', scale > 1.01);
      renderFrame = null;
    });
  };

  const clampTranslation = () => {
    if (scale <= 1.01) {
      scale = 1;
      translateX = 0;
      translateY = 0;
      return;
    }

    const stageBounds = stage.getBoundingClientRect();
    const maxX = Math.max(0, (image.offsetWidth * scale - stageBounds.width) / 2);
    const maxY = Math.max(0, (image.offsetHeight * scale - stageBounds.height) / 2);
    translateX = clamp(translateX, -maxX, maxX);
    translateY = clamp(translateY, -maxY, maxY);
  };

  const resetTransform = () => {
    scale = 1;
    translateX = 0;
    translateY = 0;
    queueRender();
  };

  const updateControls = () => {
    counter.textContent = `${index + 1} / ${items.length}`;
    previous.disabled = index === 0;
    next.disabled = index === items.length - 1;
  };

  const preload = (item) => {
    if (!item) return;
    const source = item.dataset.gallerySource;
    if (!source) return;
    const preloadImage = new Image();
    preloadImage.src = source;
  };

  const setImage = () => {
    const item = items[index];
    const thumbnail = item.querySelector('img');
    const source = item.dataset.gallerySource || (thumbnail && thumbnail.currentSrc);
    const alt = item.dataset.galleryAlt || (thumbnail && thumbnail.alt) || '';

    resetTransform();
    image.alt = alt;
    image.src = source;
    updateControls();
    preload(items[index - 1]);
    preload(items[index + 1]);
  };

  const show = () => {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    document.body.classList.add('has-gallery-open');
  };

  const close = ({ returnFocus = true } = {}) => {
    if (!isOpen()) return;
    pointers.clear();
    gesture = null;
    resetTransform();
    document.body.classList.remove('has-gallery-open');

    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');

    window.setTimeout(() => {
      image.removeAttribute('src');
      if (returnFocus && opener) opener.focus();
    }, 0);
  };

  const move = (offset) => {
    const nextIndex = index + offset;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    index = nextIndex;
    setImage();
  };

  const open = (trigger) => {
    const group = trigger.dataset.gallery || 'default';
    items = groups.get(group) || [];
    index = items.indexOf(trigger);
    opener = trigger;
    setImage();
    show();
    window.setTimeout(() => closeButton.focus(), 0);
  };

  const zoomAt = (clientX, clientY, targetScale) => {
    const bounds = stage.getBoundingClientRect();
    const focalX = clientX - bounds.left - bounds.width / 2;
    const focalY = clientY - bounds.top - bounds.height / 2;
    const nextScale = clamp(targetScale, 1, 3);
    const ratio = nextScale / scale;

    translateX = focalX - (focalX - translateX) * ratio;
    translateY = focalY - (focalY - translateY) * ratio;
    scale = nextScale;
    clampTranslation();
    queueRender();
  };

  const beginPan = (point, { suppressTap = false } = {}) => {
    gesture = {
      type: 'pan',
      startX: point.x,
      startY: point.y,
      originX: translateX,
      originY: translateY,
      startedAt: performance.now(),
      suppressTap
    };
  };

  const distance = (first, second) => Math.hypot(second.x - first.x, second.y - first.y);
  const centroid = (first, second) => ({ x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 });

  const beginPinch = () => {
    const [first, second] = Array.from(pointers.values());
    if (!first || !second) return;
    const bounds = stage.getBoundingClientRect();
    const center = centroid(first, second);
    gesture = {
      type: 'pinch',
      distance: distance(first, second),
      scale,
      translateX,
      translateY,
      focalX: center.x - bounds.left - bounds.width / 2,
      focalY: center.y - bounds.top - bounds.height / 2
    };
  };

  const updateGesture = () => {
    const active = Array.from(pointers.values());
    if (active.length >= 2) {
      if (!gesture || gesture.type !== 'pinch') beginPinch();
      if (!gesture) return;

      const [first, second] = active;
      const bounds = stage.getBoundingClientRect();
      const center = centroid(first, second);
      const nextScale = clamp(gesture.scale * (distance(first, second) / gesture.distance), 1, 3);
      const focalX = center.x - bounds.left - bounds.width / 2;
      const focalY = center.y - bounds.top - bounds.height / 2;
      const sourceX = (gesture.focalX - gesture.translateX) / gesture.scale;
      const sourceY = (gesture.focalY - gesture.translateY) / gesture.scale;

      scale = nextScale;
      translateX = focalX - sourceX * scale;
      translateY = focalY - sourceY * scale;
      clampTranslation();
      queueRender();
      return;
    }

    if (!gesture || gesture.type !== 'pan' || !active[0]) return;
    const point = active[0];
    const deltaX = point.x - gesture.startX;
    const deltaY = point.y - gesture.startY;

    if (scale > 1.01) {
      translateX = gesture.originX + deltaX;
      translateY = gesture.originY + deltaY;
      clampTranslation();
    } else {
      translateX = clamp(deltaX * 0.25, -42, 42);
      translateY = 0;
    }
    queueRender();
  };

  const handleTap = (event) => {
    const now = performance.now();
    const nextTap = { time: now, x: event.clientX, y: event.clientY };
    const isDoubleTap = lastTap
      && now - lastTap.time < 280
      && Math.hypot(nextTap.x - lastTap.x, nextTap.y - lastTap.y) < 24;

    if (isDoubleTap) {
      zoomAt(event.clientX, event.clientY, scale > 1.01 ? 1 : 2);
      lastTap = null;
    } else {
      lastTap = nextTap;
    }
  };

  const finishPointer = (event, cancelled = false) => {
    const completedGesture = gesture;
    pointers.delete(event.pointerId);

    if (pointers.size >= 2) {
      beginPinch();
      return;
    }

    if (pointers.size === 1) {
      beginPan(Array.from(pointers.values())[0], { suppressTap: true });
      return;
    }

    stage.classList.remove('is-interacting');
    gesture = null;
    if (!completedGesture || completedGesture.type !== 'pan') {
      clampTranslation();
      queueRender();
      return;
    }

    const deltaX = event.clientX - completedGesture.startX;
    const deltaY = event.clientY - completedGesture.startY;
    const distanceMoved = Math.hypot(deltaX, deltaY);
    const elapsed = performance.now() - completedGesture.startedAt;
    const isTap = !cancelled && !completedGesture.suppressTap && elapsed < 260 && distanceMoved < 12;
    const isSwipe = !cancelled && scale <= 1.01 && Math.abs(deltaX) > 56 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4;

    if (isSwipe) move(deltaX > 0 ? -1 : 1);
    else if (isTap) handleTap(event);
    else {
      clampTranslation();
      queueRender();
    }
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => open(trigger));
  });

  closeButton.addEventListener('click', () => close());
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });

  stage.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'touch' && event.button !== 0) return;
    stage.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 1) beginPan({ x: event.clientX, y: event.clientY });
    else beginPinch();
    stage.classList.add('is-interacting');
    event.preventDefault();
  });

  stage.addEventListener('pointermove', (event) => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    updateGesture();
    event.preventDefault();
  });

  stage.addEventListener('pointerup', (event) => finishPointer(event));
  stage.addEventListener('pointercancel', (event) => finishPointer(event, true));

  document.addEventListener('keydown', (event) => {
    if (!isOpen()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
      return;
    }
    if (event.key === 'Tab') {
      const focusable = [closeButton, previous, next].filter((button) => !button.disabled);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
})();
