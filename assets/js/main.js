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
  };

  const setPreference = (attribute, key, value, animate) => {
    const apply = () => {
      root.setAttribute(attribute, value);
      storage.set(key, value);
    };

    if (animate && document.startViewTransition) {
      document.startViewTransition(apply);
      return;
    }

    apply();
  };

  const initPreferences = () => {
    const preferences = [
      {
        id: 'theme-toggle',
        attribute: 'data-theme',
        key: 'theme',
        animate: true,
        next: (value) => value === 'dark' ? 'light' : 'dark',
        labels: {
          light: { aria: 'Switch to dark mode', title: 'Switch to dark mode (D)' },
          dark: { aria: 'Switch to light mode', title: 'Switch to light mode (D)' }
        }
      },
      {
        id: 'monochrome-toggle',
        attribute: 'data-monochrome',
        key: 'monochrome',
        animate: false,
        next: (value) => value === 'true' ? 'false' : 'true',
        labels: {
          false: { aria: 'Switch to monochrome mode', title: 'Switch to B&W mode (M)' },
          true: { aria: 'Switch to color mode', title: 'Switch to color mode (M)' }
        }
      },
      {
        id: 'reduce-transparency-toggle',
        attribute: 'data-reduce-transparency',
        key: 'reduceTransparency',
        animate: false,
        next: (value) => value === 'on' ? 'off' : 'on',
        labels: {
          off: { aria: 'Reduce transparency', title: 'Reduce transparency (G)' },
          on: { aria: 'Restore transparency', title: 'Restore transparency (G)' }
        }
      }
    ];

    preferences.forEach((preference) => {
      const button = query(`#${preference.id}`);
      if (!button) return;

      updateLabel(button, preference.labels, root.getAttribute(preference.attribute));
      button.addEventListener('click', () => {
        const value = preference.next(root.getAttribute(preference.attribute));
        setPreference(preference.attribute, preference.key, value, preference.animate);
        updateLabel(button, preference.labels, value);
      });
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSchemeChange = (event) => {
      if (storage.get('theme')) return;
      root.setAttribute('data-theme', event.matches ? 'dark' : 'light');
      const button = query('#theme-toggle');
      if (button) {
        updateLabel(button, preferences[0].labels, root.getAttribute('data-theme'));
      }
    };

    if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', handleSchemeChange);
  };

  const initMenu = () => {
    const button = query('#menu-toggle');
    const menu = query('#site-menu');
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
      button.classList.toggle('menu-open', open);
      header.classList.toggle('menu-active', open);
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      setInert(!open);
    };

    setOpen(false);
    button.addEventListener('click', () => setOpen(!menu.classList.contains('menu-open')));
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
    const checkIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
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
          copy.innerHTML = checkIcon;
          copy.classList.add('copied');
          window.setTimeout(() => {
            copy.innerHTML = copyIcon;
            copy.classList.remove('copied');
          }, 1600);
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

  initPreferences();
  initMenu();
  initScrollChrome();
  initCodeHeaders();
  initPrintButtons();
})();
