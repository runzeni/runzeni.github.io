(() => {
  'use strict';

  const tool = document.querySelector('[data-text-enlarger]');
  if (!tool) return;

  const stage = tool.querySelector('[data-text-stage]');
  const canvas = tool.querySelector('[data-text-canvas]');
  const message = tool.querySelector('[data-text-message]');
  const controls = tool.querySelector('[data-text-controls]');
  const fontButton = tool.querySelector('[data-text-font]');
  const fontLabel = tool.querySelector('[data-text-font-label]');
  const fitButton = tool.querySelector('[data-text-fit]');
  const copyButton = tool.querySelector('[data-text-copy]');
  const colorButton = tool.querySelector('[data-text-color]');
  const rotateButton = tool.querySelector('[data-text-rotate]');
  const presentButton = tool.querySelector('[data-text-present]');
  const presentLabel = tool.querySelector('[data-text-present-label]');
  const sizeInput = tool.querySelector('[data-text-size]');
  const sizeOutput = tool.querySelector('[data-text-size-output]');
  const resetButton = tool.querySelector('[data-text-reset]');
  const status = tool.querySelector('[data-text-status]');

  if (!stage || !canvas || !message || !controls) return;

  const paletteNames = {
    site: 'Site colors',
    paper: 'Paper',
    ink: 'Ink',
    signal: 'Signal yellow',
    blue: 'Blue'
  };
  const preferredContrast = document.documentElement.dataset.theme === 'dark' ? 'paper' : 'ink';
  const palettes = ['site', preferredContrast, 'signal', 'blue'];
  const storagePrefix = 'textEnlarger.';
  const state = {
    autoFit: true,
    font: readPreference('font', 'sans'),
    palette: readPreference('palette', 'site'),
    rotated: false,
    presenting: false,
    wakeLock: null,
    hideTimer: null,
    fitFrame: null
  };

  if (!palettes.includes(state.palette)) state.palette = 'site';
  if (!['sans', 'serif'].includes(state.font)) state.font = 'sans';

  function readPreference(key, fallback) {
    try {
      return window.localStorage.getItem(`${storagePrefix}${key}`) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function savePreference(key, value) {
    try {
      window.localStorage.setItem(`${storagePrefix}${key}`, value);
    } catch (error) {
      // The tool remains fully usable when storage is unavailable.
    }
  }

  function announce(text) {
    if (!status) return;
    status.textContent = '';
    window.requestAnimationFrame(() => { status.textContent = text; });
  }

  function updateEmptyState() {
    const empty = message.textContent.trim().length === 0;
    message.dataset.empty = String(empty);
    return empty;
  }

  function setMessageEditable(editable) {
    if (!editable) {
      message.setAttribute('contenteditable', 'false');
      return;
    }
    message.setAttribute('contenteditable', 'plaintext-only');
    if (message.contentEditable !== 'plaintext-only') message.setAttribute('contenteditable', 'true');
  }

  function setFont(font, shouldAnnounce = true) {
    state.font = font;
    tool.dataset.font = font;
    if (fontLabel) fontLabel.textContent = font === 'serif' ? 'Serif' : 'Sans';
    if (fontButton) fontButton.setAttribute('aria-label', `Use ${font === 'serif' ? 'sans serif' : 'serif'} font`);
    savePreference('font', font);
    if (shouldAnnounce) announce(`${font === 'serif' ? 'Serif' : 'Sans serif'} font`);
    scheduleFit();
  }

  function setPalette(palette, shouldAnnounce = true) {
    state.palette = palette;
    tool.dataset.palette = palette;
    savePreference('palette', palette);
    if (colorButton) colorButton.setAttribute('aria-label', `Change color. Current: ${paletteNames[palette]}`);
    if (shouldAnnounce) announce(`${paletteNames[palette]} colors`);
    scheduleFit();
  }

  function setAutoFit(enabled) {
    state.autoFit = enabled;
    if (fitButton) {
      fitButton.classList.toggle('is-active', enabled);
      fitButton.setAttribute('aria-pressed', String(enabled));
    }
    if (sizeOutput) sizeOutput.value = enabled ? 'Auto' : `${sizeInput.value}px`;
  }

  function fitText() {
    state.fitFrame = null;
    if (!state.autoFit) return;

    const styles = window.getComputedStyle(canvas);
    const availableHeight = canvas.clientHeight - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom);
    const availableWidth = canvas.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
    if (availableHeight <= 0 || availableWidth <= 0) return;

    let low = 24;
    const emptyMaximum = updateEmptyState() && window.matchMedia('(min-width: 900px)').matches ? 180 : 520;
    let high = Math.min(emptyMaximum, Math.max(availableWidth, availableHeight));
    let best = low;

    for (let index = 0; index < 11; index += 1) {
      const candidate = Math.floor((low + high) / 2);
      message.style.fontSize = `${candidate}px`;
      const fitsWidth = message.scrollWidth <= availableWidth + 1;
      const fitsHeight = message.scrollHeight <= availableHeight + 1;

      if (fitsWidth && fitsHeight) {
        best = candidate;
        low = candidate + 1;
      } else {
        high = candidate - 1;
      }
    }

    message.style.fontSize = `${best}px`;
    sizeInput.value = String(Math.max(Number(sizeInput.min), Math.min(Number(sizeInput.max), best)));
    if (sizeOutput) sizeOutput.value = 'Auto';
  }

  function scheduleFit() {
    if (!state.autoFit) return;
    if (state.fitFrame !== null) window.cancelAnimationFrame(state.fitFrame);
    state.fitFrame = window.requestAnimationFrame(fitText);
  }

  function updateRotatedDimensions() {
    if (state.rotated) {
      stage.style.setProperty('--rotated-width', `${stage.clientHeight}px`);
      stage.style.setProperty('--rotated-height', `${stage.clientWidth}px`);
    } else {
      stage.style.removeProperty('--rotated-width');
      stage.style.removeProperty('--rotated-height');
    }
    window.setTimeout(scheduleFit, 300);
  }

  function setRotated(rotated, shouldAnnounce = true) {
    state.rotated = rotated;
    stage.classList.toggle('is-rotated', rotated);
    if (rotateButton) rotateButton.setAttribute('aria-pressed', String(rotated));
    updateRotatedDimensions();
    if (shouldAnnounce) announce(rotated ? 'Text rotated 90 degrees' : 'Text returned upright');
  }

  function setControlsHidden(hidden) {
    tool.classList.toggle('controls-hidden', hidden);
  }

  function scheduleControlsHide() {
    window.clearTimeout(state.hideTimer);
    if (!state.presenting) return;
    state.hideTimer = window.setTimeout(() => setControlsHidden(true), 2200);
  }

  async function requestWakeLock() {
    if (!state.presenting || !('wakeLock' in navigator) || document.visibilityState !== 'visible') return;
    try {
      state.wakeLock = await navigator.wakeLock.request('screen');
      state.wakeLock.addEventListener('release', () => { state.wakeLock = null; }, { once: true });
    } catch (error) {
      state.wakeLock = null;
    }
  }

  async function releaseWakeLock() {
    if (!state.wakeLock) return;
    try {
      await state.wakeLock.release();
    } catch (error) {
      // A visibility change may already have released it.
    }
    state.wakeLock = null;
  }

  function finishPresentation() {
    if (!state.presenting) return;
    state.presenting = false;
    window.clearTimeout(state.hideTimer);
    tool.classList.remove('is-presenting', 'controls-hidden');
    document.body.classList.remove('text-tool-is-presenting');
    setMessageEditable(true);
    if (presentLabel) presentLabel.textContent = 'Full screen';
    if (presentButton) presentButton.setAttribute('aria-label', 'Enter full screen');
    releaseWakeLock();
    updateRotatedDimensions();
    scheduleFit();
    presentButton?.focus({ preventScroll: true });
    announce('Presentation closed');
  }

  async function enterPresentation() {
    if (state.presenting) return;
    state.presenting = true;
    tool.classList.add('is-presenting');
    document.body.classList.add('text-tool-is-presenting');
    setMessageEditable(false);
    message.blur();
    if (presentLabel) presentLabel.textContent = 'Exit';
    if (presentButton) presentButton.setAttribute('aria-label', 'Exit full screen');
    updateRotatedDimensions();
    scheduleFit();

    if (tool.requestFullscreen) {
      try {
        await tool.requestFullscreen({ navigationUI: 'hide' });
      } catch (error) {
        // The fixed-position presentation is the deliberate fallback.
      }
    }

    requestWakeLock();
    announce('Presentation opened. Tap to show controls.');
    scheduleControlsHide();
  }

  async function exitPresentation() {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (error) {
        finishPresentation();
      }
      return;
    }
    finishPresentation();
  }

  function insertPlainText(text) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const node = document.createTextNode(text);
    range.insertNode(node);
    range.setStartAfter(node);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    if (!copied) throw new Error('Copy command was rejected');
  }

  async function copyMessage() {
    const text = message.textContent.trim();
    if (!text) {
      announce('Nothing to copy');
      return;
    }

    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) await navigator.clipboard.writeText(text);
      else fallbackCopy(text);
      window.siteCopyConfirmation?.('Copied');
      announce('Message copied');
    } catch (error) {
      announce('Copy unavailable. Select the message and copy it manually.');
    }
  }

  setFont(state.font, false);
  setPalette(state.palette, false);
  setMessageEditable(true);
  setAutoFit(true);
  updateEmptyState();
  scheduleFit();

  message.addEventListener('input', () => {
    updateEmptyState();
    scheduleFit();
  });

  message.addEventListener('paste', (event) => {
    const text = event.clipboardData?.getData('text/plain');
    if (typeof text !== 'string') return;
    event.preventDefault();
    insertPlainText(text);
    updateEmptyState();
    scheduleFit();
  });

  fontButton?.addEventListener('click', () => setFont(state.font === 'sans' ? 'serif' : 'sans'));
  fitButton?.addEventListener('click', () => {
    setAutoFit(true);
    scheduleFit();
    announce('Text fitted to screen');
  });
  copyButton?.addEventListener('click', copyMessage);
  colorButton?.addEventListener('click', () => {
    const nextIndex = (palettes.indexOf(state.palette) + 1) % palettes.length;
    setPalette(palettes[nextIndex]);
  });
  rotateButton?.addEventListener('click', () => setRotated(!state.rotated));
  presentButton?.addEventListener('click', () => state.presenting ? exitPresentation() : enterPresentation());

  sizeInput?.addEventListener('input', () => {
    setAutoFit(false);
    message.style.fontSize = `${sizeInput.value}px`;
    if (sizeOutput) sizeOutput.value = `${sizeInput.value}px`;
  });

  resetButton?.addEventListener('click', () => {
    setAutoFit(true);
    setPalette('site', false);
    setRotated(false, false);
    setFont('sans', false);
    scheduleFit();
    announce('Layout reset');
  });

  stage.addEventListener('click', (event) => {
    if (!state.presenting || controls.contains(event.target) || copyButton?.contains(event.target)) return;
    const hidden = tool.classList.contains('controls-hidden');
    setControlsHidden(!hidden);
    if (hidden) scheduleControlsHide();
  });

  controls.addEventListener('pointerdown', () => {
    if (state.presenting) scheduleControlsHide();
  });

  copyButton?.addEventListener('pointerdown', () => {
    if (state.presenting) scheduleControlsHide();
  });

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && state.presenting) finishPresentation();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && state.presenting && !state.wakeLock) requestWakeLock();
  });

  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      state.presenting ? exitPresentation() : enterPresentation();
    } else if (event.key === 'Escape' && state.presenting && !document.fullscreenElement) {
      exitPresentation();
    }
  });

  const resizeObserver = new ResizeObserver(() => {
    updateRotatedDimensions();
    scheduleFit();
  });
  resizeObserver.observe(stage);

  if (document.fonts?.ready) document.fonts.ready.then(scheduleFit);
})();
