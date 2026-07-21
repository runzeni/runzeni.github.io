(() => {
  'use strict';

  const root = document.documentElement;
  const query = (selector, scope = document) => scope.querySelector(selector);
  const queryAll = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const storage = {
    get(key) {
      try {
        return window.localStorage.getItem(key);
      } catch (error) {
        return null;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch (error) {
        // Preferences should never prevent the rest of the page from working.
      }
    }
  };

  const updateLabel = (button, labels, value) => {
    if (!button || !labels[value]) return;
    button.setAttribute('aria-label', labels[value].aria);
    button.setAttribute('title', labels[value].title);
    button.setAttribute('aria-pressed', String(labels[value].pressed));
    const visibleLabel = query('.menu-control-label', button);
    if (visibleLabel) visibleLabel.textContent = labels[value].label;
  };

  let copyConfirmationTimer = null;
  const showCopyConfirmation = (message = 'Copied') => {
    const host = document.fullscreenElement || document.body;
    let notification = query('.copy-notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.className = 'copy-notification';
      notification.setAttribute('role', 'status');
      notification.setAttribute('aria-live', 'polite');
    }
    if (notification.parentElement !== host) host.appendChild(notification);

    window.clearTimeout(copyConfirmationTimer);
    notification.textContent = message;
    notification.classList.remove('hide');
    window.requestAnimationFrame(() => notification.classList.add('show'));
    copyConfirmationTimer = window.setTimeout(() => {
      notification.classList.remove('show');
      notification.classList.add('hide');
    }, 1200);
  };
  window.siteCopyConfirmation = showCopyConfirmation;

  const setPreference = (attribute, key, value, animate) => {
    const apply = () => {
      root.setAttribute(attribute, value);
      storage.set(key, value);
      if (attribute === 'data-theme') {
        const themeColor = query('meta[name="theme-color"]');
        if (themeColor) themeColor.content = value === 'dark' ? '#0f0f0f' : '#fefefe';
      }
      window.dispatchEvent(new CustomEvent('sitepreferencechange', {
        detail: { attribute, value }
      }));
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (animate && document.startViewTransition && !reduceMotion && !coarsePointer) {
      document.startViewTransition(apply);
      return;
    }

    if (animate && !reduceMotion) {
      root.classList.add('preference-is-changing');
      window.setTimeout(() => root.classList.remove('preference-is-changing'), 360);
    }
    apply();
  };

  const initPreferences = () => {
    const preferences = [
      {
        selector: '.theme-toggle',
        attribute: 'data-theme',
        key: 'theme',
        animate: true,
        next: (value) => value === 'dark' ? 'light' : 'dark',
        labels: {
          light: { label: 'Light', pressed: false, aria: 'Switch to dark mode', title: 'Switch to dark mode (D)' },
          dark: { label: 'Dark', pressed: true, aria: 'Switch to light mode', title: 'Switch to light mode (D)' }
        }
      },
      {
        selector: '.monochrome-toggle',
        attribute: 'data-monochrome',
        key: 'monochrome',
        animate: true,
        next: (value) => value === 'true' ? 'false' : 'true',
        labels: {
          false: { label: 'Color', pressed: false, aria: 'Switch to monochrome mode', title: 'Switch to B&W mode (M)' },
          true: { label: 'B&W', pressed: true, aria: 'Switch to color mode', title: 'Switch to color mode (M)' }
        }
      },
      {
        selector: '.reduce-transparency-toggle',
        attribute: 'data-reduce-transparency',
        key: 'reduceTransparency',
        animate: false,
        next: (value) => value === 'on' ? 'off' : 'on',
        labels: {
          off: { label: 'Blur', pressed: false, aria: 'Use solid surfaces', title: 'Use solid surfaces (G)' },
          on: { label: 'Solid', pressed: true, aria: 'Use blurred surfaces', title: 'Use blurred surfaces (G)' }
        }
      }
    ];

    preferences.forEach((preference) => {
      const buttons = queryAll(preference.selector);
      buttons.forEach((button) => {
        updateLabel(button, preference.labels, root.getAttribute(preference.attribute));
        button.addEventListener('click', () => {
          const value = preference.next(root.getAttribute(preference.attribute));
          setPreference(preference.attribute, preference.key, value, preference.animate);
          buttons.forEach((item) => updateLabel(item, preference.labels, value));
        });
      });
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSchemeChange = (event) => {
      if (storage.get('theme')) return;
      root.setAttribute('data-theme', event.matches ? 'dark' : 'light');
      const themeColor = query('meta[name="theme-color"]');
      if (themeColor) themeColor.content = event.matches ? '#0f0f0f' : '#fefefe';
      queryAll(preferences[0].selector).forEach((button) => {
        updateLabel(button, preferences[0].labels, root.getAttribute('data-theme'));
      });
    };

    if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', handleSchemeChange);
  };

  const initMenu = () => {
    const button = query('#menu-toggle');
    const menu = query('#site-menu');
    const scrim = query('#menu-scrim');
    const header = query('#site-header');
    if (!button || !menu || !header) return { close() {} };

    const focusableSelector = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const setInert = (inert) => {
      menu.setAttribute('aria-hidden', String(inert));
      if ('inert' in menu) {
        menu.inert = inert;
        return;
      }

      queryAll(focusableSelector, menu).forEach((element) => {
        if (inert) {
          element.dataset.savedTabindex = element.getAttribute('tabindex') || '';
          element.setAttribute('tabindex', '-1');
        } else if (Object.prototype.hasOwnProperty.call(element.dataset, 'savedTabindex')) {
          if (element.dataset.savedTabindex) element.setAttribute('tabindex', element.dataset.savedTabindex);
          else element.removeAttribute('tabindex');
          delete element.dataset.savedTabindex;
        }
      });
    };

    const setOpen = (open) => {
      menu.classList.toggle('menu-open', open);
      scrim?.classList.toggle('menu-open', open);
      button.classList.toggle('menu-open', open);
      header.classList.toggle('menu-active', open);
      document.body.classList.toggle('menu-is-open', open);
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      setInert(!open);
    };

    setOpen(false);
    button.addEventListener('click', () => {
      const opening = !menu.classList.contains('menu-open');
      setOpen(opening);
      if (opening) window.requestAnimationFrame(() => query(focusableSelector, menu)?.focus());
    });
    scrim?.addEventListener('click', () => {
      setOpen(false);
      button.focus();
    });
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('click', (event) => {
      if (!menu.classList.contains('menu-open')) return;
      if (menu.contains(event.target) || button.contains(event.target)) return;
      setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.classList.contains('menu-open')) {
        setOpen(false);
        button.focus();
      }
    });

    return { close: () => setOpen(false) };
  };

  const initScrollChrome = () => {
    const progress = query('#scroll-progress');
    const sticky = query('#sticky-nav');
    const scrollTop = query('#scroll-top');
    const scrollBottom = query('#scroll-bottom');
    let frame = null;

    const render = () => {
      frame = null;
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      const value = maximum > 0 ? Math.min((window.scrollY / maximum) * 100, 100) : 0;

      if (progress) {
        progress.style.width = `${value}%`;
        progress.setAttribute('aria-valuenow', String(Math.round(value)));
      }
      if (sticky) sticky.classList.toggle('visible', window.scrollY > 120);
    };

    const schedule = () => {
      if (frame === null) frame = window.requestAnimationFrame(render);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    schedule();

    if (scrollTop) scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    if (scrollBottom) scrollBottom.addEventListener('click', () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }));
  };

  const initCodeHeaders = () => {
    const copyIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    const canCopy = Boolean(navigator.clipboard && navigator.clipboard.writeText);

    const language = (wrapper) => {
      const match = Array.from(wrapper.classList).find((name) => name.startsWith('language-'));
      return match ? match.replace('language-', '') : '';
    };

    const header = (label, code) => {
      const element = document.createElement('div');
      element.className = 'code-header';
      const name = document.createElement('span');
      name.className = 'code-lang';
      name.textContent = label;
      element.appendChild(name);

      if (!canCopy) return element;
      const copy = document.createElement('button');
      copy.type = 'button';
      copy.className = 'code-copy-btn';
      copy.setAttribute('aria-label', 'Copy code');
      copy.innerHTML = copyIcon;
      copy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(code.textContent);
          showCopyConfirmation('Copied');
        } catch (error) {
          copy.setAttribute('aria-label', 'Unable to copy code');
        }
      });
      element.appendChild(copy);
      return element;
    };

    queryAll('div.highlighter-rouge').forEach((wrapper) => {
      if (query('.code-header', wrapper)) return;
      const code = query('code, pre', wrapper);
      if (code) wrapper.insertBefore(header(language(wrapper), code), wrapper.firstChild);
    });
  };

  const initPrintButtons = () => {
    queryAll('[data-print-page]').forEach((button) => {
      button.addEventListener('click', () => window.print());
    });
  };

  const initNotesOutline = () => {
    const outline = query('#notes-outline');
    const list = query('#notes-outline-list');
    const content = query('.article-content') || query('.module-content');
    if (!outline || !list || !content) return;

    const headings = queryAll('h2', content).filter((heading) => !heading.closest('.module-toc'));
    if (headings.length < 2) return;

    const headingId = (heading, index) => {
      if (heading.id) return heading.id;

      const base = heading.textContent
        .trim()
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || `section-${index + 1}`;
      let candidate = base;
      let suffix = 2;
      while (document.getElementById(candidate)) {
        candidate = `${base}-${suffix}`;
        suffix += 1;
      }
      heading.id = candidate;
      return candidate;
    };

    headings.forEach((heading, index) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${headingId(heading, index)}`;
      link.textContent = heading.textContent.trim();
      item.appendChild(link);
      list.appendChild(item);
    });

    const links = queryAll('a', list);
    let activeIndex = -1;
    let frame = null;

    const setActive = (index) => {
      if (index === activeIndex) return;
      activeIndex = index;
      links.forEach((link, linkIndex) => {
        if (linkIndex === index) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };

    const render = () => {
      frame = null;
      const headerHeight = Number.parseFloat(getComputedStyle(root).getPropertyValue('--header-height')) || 50;
      const threshold = headerHeight + 40;
      let nextIndex = 0;
      headings.forEach((heading, index) => {
        if (heading.getBoundingClientRect().top <= threshold) nextIndex = index;
      });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        nextIndex = headings.length - 1;
      }
      setActive(nextIndex);
    };

    const schedule = () => {
      if (frame === null) frame = window.requestAnimationFrame(render);
    };

    outline.hidden = false;
    root.classList.add('notes-outline-ready');
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    links.forEach((link, index) => link.addEventListener('click', () => setActive(index)));
    schedule();
  };

  const copyText = async (value) => {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(value);
        return;
      } catch (error) {
        // Older Safari versions may expose Clipboard API but reject the write.
      }
    }

    const field = document.createElement('textarea');
    field.value = value;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    if (!copied) throw new Error('Copy command was rejected');
  };

  const initEmailCopy = () => {
    queryAll('[data-copy-email]').forEach((button) => {
      button.addEventListener('click', async () => {
        const email = button.dataset.copyValue;
        if (!email) return;
        try {
          await copyText(email);
          showCopyConfirmation('Email copied');
        } catch (error) {
          showCopyConfirmation('Unable to copy');
        }
      });
    });
  };

  initPreferences();
  initMenu();
  initScrollChrome();
  initNotesOutline();
  initCodeHeaders();
  initPrintButtons();
  initEmailCopy();
})();
