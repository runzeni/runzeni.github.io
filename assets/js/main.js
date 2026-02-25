/* ===============================================
 * JAVASCRIPT - Main Site Interactions
 * =============================================== */
(function() {
  'use strict';

  /* ===============================================
   * UTILITY FUNCTIONS
   * =============================================== */
  const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/* ===============================================
 * PREFERENCE TOGGLES (Dark Mode & Monochrome)
 * =============================================== */
const htmlElement = document.documentElement;

/**
 * Generic preference toggle handler
 * @param {string} toggleId - Element ID of toggle button
 * @param {string} attribute - HTML attribute to toggle (e.g., 'data-theme')
 * @param {string} storageKey - localStorage key
 * @param {Object} config - Toggle configuration
 */
const setupPreferenceToggle = (toggleId, attribute, storageKey, config) => {
  const toggle = document.getElementById(toggleId);
  if (!toggle) return;

  const updateLabels = (value) => {
    const labels = config.labels[value] || config.labels.default;
    toggle.setAttribute('aria-label', labels.aria);
    toggle.setAttribute('title', labels.title);
  };

  // Initialize
  updateLabels(htmlElement.getAttribute(attribute));

  // Apply attribute change, optionally animated via View Transitions API
  const applyChange = (newValue) => {
    htmlElement.setAttribute(attribute, newValue);
    localStorage.setItem(storageKey, newValue);
    updateLabels(newValue);
  };

  // Click handler
  toggle.addEventListener('click', () => {
    const current = htmlElement.getAttribute(attribute);
    const newValue = config.toggle(current);

    if (config.useViewTransition && document.startViewTransition) {
      document.startViewTransition(() => applyChange(newValue));
    } else {
      applyChange(newValue);
    }
  });
};

// Dark mode toggle
setupPreferenceToggle('theme-toggle', 'data-theme', 'theme', {
  toggle: (current) => current === 'light' ? 'dark' : 'light',
  useViewTransition: true,
  labels: {
    dark: { aria: 'Switch to light mode', title: 'Switch to light mode (D)' },
    light: { aria: 'Switch to dark mode', title: 'Switch to dark mode (D)' }
  }
});

// Monochrome toggle
setupPreferenceToggle('monochrome-toggle', 'data-monochrome', 'monochrome', {
  toggle: (current) => current === 'false' ? 'true' : 'false',
  labels: {
    true: { aria: 'Switch to color mode', title: 'Switch to color mode (M)' },
    false: { aria: 'Switch to monochrome mode', title: 'Switch to B&W mode (M)' }
  }
});

// Reduce transparency toggle
setupPreferenceToggle('reduce-transparency-toggle', 'data-reduce-transparency', 'reduceTransparency', {
  toggle: (current) => current === 'off' ? 'on' : 'off',
  labels: {
    off: { aria: 'Reduce transparency', title: 'Reduce transparency (G)' },
    on: { aria: 'Restore transparency', title: 'Restore transparency (G)' }
  }
});

// System preference listener for dark mode
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
prefersDark.addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    const apply = () => htmlElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    document.startViewTransition ? document.startViewTransition(apply) : apply();
  }
});

/* ===============================================
 * SCROLL PROGRESS INDICATOR
 * =============================================== */
const scrollProgress = document.getElementById('scroll-progress');

if (scrollProgress) {
  const updateScrollProgress = throttle(() => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = documentHeight > 0 ? (scrolled / documentHeight) * 100 : 0;

    requestAnimationFrame(() => {
      scrollProgress.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
      scrollProgress.setAttribute('aria-valuenow', Math.round(progress));
    });
  }, 16);

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress, { passive: true });
  updateScrollProgress();
}

/* ===============================================
 * STICKY NAVIGATION (Scroll-based)
 * =============================================== */
const stickyNav = document.getElementById('sticky-nav');
const scrollTop = document.getElementById('scroll-top');
const scrollBottom = document.getElementById('scroll-bottom');

if (stickyNav) {
  // Show sticky nav after scrolling past the header height
  // Using scroll position since the header is position:fixed and never leaves viewport
  const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 50;
  const showThreshold = headerHeight * 2; // Show after scrolling 2x header height

  const updateStickyNav = throttle(() => {
    const scrolled = window.scrollY;
    stickyNav.classList.toggle('visible', scrolled > showThreshold);
  }, 16);

  window.addEventListener('scroll', updateStickyNav, { passive: true });
  updateStickyNav(); // Initial check
}

if (scrollTop) {
  scrollTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

if (scrollBottom) {
  scrollBottom.addEventListener('click', () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  });
}

/* ===============================================
 * SECTION-AWARE NAVIGATION BUTTON
 * =============================================== */
(function() {
  const sectionNavButton = document.getElementById('section-nav-button');
  if (!sectionNavButton) return;

  const section = document.documentElement.getAttribute('data-section');

  // Section configuration: { href, title, ariaLabel, show }
  const sectionConfig = {
    'home': {
      show: false
    },
    'fotos': {
      href: '/fotos/archive/',
      title: 'Archive',
      ariaLabel: 'View photo archive',
      show: true
    },
    'archive': {
      href: '/fotos/archive/',
      title: 'Archive',
      ariaLabel: 'View photo archive',
      show: true
    },
    'misc': {
      href: '/misc/',
      title: 'Misc',
      ariaLabel: 'Back to Misc',
      show: true
    },
    'cine': {
      show: false
    },
    'protocols': {
      show: false
    }
  };

  const config = sectionConfig[section];

  if (config && config.show) {
    sectionNavButton.setAttribute('href', config.href);
    sectionNavButton.setAttribute('title', config.title);
    sectionNavButton.setAttribute('aria-label', config.ariaLabel);
    sectionNavButton.style.display = '';
  } else {
    sectionNavButton.style.display = 'none';
  }
})();

/* ===============================================
 * MENU TOGGLE
 * =============================================== */
const menuToggle = document.getElementById('menu-toggle');
const siteMenu = document.getElementById('site-menu');
const siteHeader = document.getElementById('site-header');

if (menuToggle && siteMenu && siteHeader) {
  const closeMenu = () => {
    siteMenu.classList.remove('menu-open');
    menuToggle.classList.remove('menu-open');
    siteHeader.classList.remove('menu-active');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  const openMenu = () => {
    siteMenu.classList.add('menu-open');
    menuToggle.classList.add('menu-open');
    siteHeader.classList.add('menu-active');
    menuToggle.setAttribute('aria-expanded', 'true');
  };

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = siteMenu.classList.contains('menu-open');
    isOpen ? closeMenu() : openMenu();
  });

  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !siteMenu.contains(e.target)) {
      if (siteMenu.classList.contains('menu-open')) {
        closeMenu();
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && siteMenu.classList.contains('menu-open')) {
      closeMenu();
    }
  });

  // Export closeMenu for use in other modules
  window.closeMenu = closeMenu;
}

/* ===============================================
 * README SMOOTH SCROLL
 * =============================================== */

// Function to handle README scroll
function handleReadmeScroll(e) {
  e.preventDefault();
  const heroSection = document.getElementById('hero-section');

  // If on homepage, smooth scroll to hero section
  if (heroSection && window.location.pathname === '/') {
    // scrollIntoView respects the CSS scroll-margin-top on .hero-section
    heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.closeMenu) window.closeMenu();
  } else {
    // If on other pages, store intent and navigate
    sessionStorage.setItem('scrollToHero', 'true');
    window.location.href = '/';
  }
}

// Check if we should scroll on page load
window.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('scrollToHero') === 'true') {
    sessionStorage.removeItem('scrollToHero');
    setTimeout(() => {
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
});

// Attach to header README link
const readmeLink = document.getElementById('readme-scroll-link');
if (readmeLink) {
  readmeLink.addEventListener('click', handleReadmeScroll);
}

// Attach to menu README link
const menuReadmeLinks = document.querySelectorAll('.site-menu-dropdown a[href="/"]');
menuReadmeLinks.forEach(link => {
  link.addEventListener('click', handleReadmeScroll);
});

// Attach to footer README/About link
const footerReadmeLinks = document.querySelectorAll('.footer-section a[href="/"]');
footerReadmeLinks.forEach(link => {
  link.addEventListener('click', handleReadmeScroll);
});

/* ===============================================
 * LIGHTBOX GESTURE HANDLER
 * =============================================== */
const setupLightboxGestures = (lightbox, container, state, handlers) => {
  const hammerLightbox = new Hammer(lightbox);
  const hammerContainer = new Hammer(container);

  // Configure gestures
  hammerLightbox.get('swipe').set({
    direction: Hammer.DIRECTION_HORIZONTAL,
    threshold: 50,
    velocity: 0.3
  });
  hammerContainer.get('pinch').set({ enable: true });
  hammerContainer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

  // Swipe to navigate
  hammerLightbox.on('swipeleft', () => {
    if (state.currentIndex < state.imageUrls.length - 1 && !state.isZoomed) {
      handlers.showNext();
    }
  });

  hammerLightbox.on('swiperight', () => {
    if (state.currentIndex > 0 && !state.isZoomed) {
      handlers.showPrev();
    }
  });

  // Pinch to zoom
  let startScale = 1;
  hammerContainer.on('pinchstart', () => {
    startScale = state.scale;
  });

  hammerContainer.on('pinchmove', (e) => {
    state.scale = Math.max(1, Math.min(5, startScale * e.scale));
    state.isZoomed = state.scale > 1;
    container.classList.toggle('zoomed', state.isZoomed);
    handlers.updateTransform();
  });

  hammerContainer.on('pinchend', () => {
    if (state.scale < 1.1) {
      state.scale = 1;
      state.isZoomed = false;
      state.translateX = 0;
      state.translateY = 0;
      container.classList.remove('zoomed');
      handlers.updateTransform();
    }
  });

  // Pan when zoomed
  hammerContainer.on('panstart', (e) => {
    if (state.isZoomed) e.preventDefault();
  });

  hammerContainer.on('panmove', (e) => {
    if (state.isZoomed) {
      e.preventDefault();
      state.translateX += e.deltaX / state.scale;
      state.translateY += e.deltaY / state.scale;
      handlers.updateTransform();
    }
  });

  // Double-tap to zoom
  hammerContainer.on('doubletap', (e) => {
    if (state.isZoomed) {
      state.scale = 1;
      state.isZoomed = false;
      state.translateX = 0;
      state.translateY = 0;
      container.classList.remove('zoomed');
    } else {
      state.scale = 2;
      state.isZoomed = true;
      container.classList.add('zoomed');

      const rect = container.getBoundingClientRect();
      const tapX = e.center.x - rect.left;
      const tapY = e.center.y - rect.top;
      state.translateX = (rect.width / 2 - tapX) / state.scale;
      state.translateY = (rect.height / 2 - tapY) / state.scale;
    }
    handlers.updateTransform();
  });
};

/* ===============================================
 * LIGHTBOX
 * =============================================== */
const portfolioThumbs = document.querySelectorAll('.portfolio-thumb');
const contactSheetThumbs = document.querySelectorAll('.contact-sheet-thumb');

let thumbnails = [];
let imageUrls = [];
if (portfolioThumbs.length > 0) {
  thumbnails = portfolioThumbs;
} else if (contactSheetThumbs.length > 0) {
  thumbnails = contactSheetThumbs;
}

if (thumbnails.length > 0) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxContainer = document.getElementById('lightbox-container');
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxFullscreen = document.getElementById('lightbox-fullscreen');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const swipeHint = document.getElementById('swipe-hint');

  imageUrls = Array.from(thumbnails).map(thumb => thumb.src || thumb.dataset.src);
  let currentIndex = 0;
  let isZoomed = false;
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let startX, startY;

  // Touch handling
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let lastTapTime = 0;
  let isSwiping = false;

  // Image loading state
  let pendingImageLoad = null;
  let loadingTimeout = null;

  const preloadImage = (index) => {
    if (index >= 0 && index < imageUrls.length) {
      const img = new Image();
      img.src = imageUrls[index];
    }
  };

  const updateCounter = () => {
    lightboxCounter.textContent = `${currentIndex + 1} / ${imageUrls.length}`;
  };

  const resetZoom = () => {
    scale = 1;
    translateX = 0;
    translateY = 0;
    isZoomed = false;
    lightboxContainer.classList.remove('zoomed');
    updateImageTransform();
  };

  const updateImageTransform = () => {
    requestAnimationFrame(() => {
      lightboxImage.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    });
  };

  const openLightbox = (index) => {
    if (index < 0 || index >= imageUrls.length) return;

    // Cancel any pending image load to handle fast navigation
    if (pendingImageLoad) {
      pendingImageLoad.onload = null;
      pendingImageLoad.onerror = null;
      pendingImageLoad = null;
    }
    clearTimeout(loadingTimeout);

    const isInitialOpen = !lightbox.classList.contains('open');
    currentIndex = index;

    // Reset zoom before loading new image (avoid visual confusion)
    if (!isInitialOpen) {
      resetZoom();
    }

    // Show loading indicator after 200ms if image still loading
    loadingTimeout = setTimeout(() => {
      lightboxContainer.classList.add('loading');
    }, 200);

    // Preload image completely before swapping
    const newImage = new Image();
    pendingImageLoad = newImage;
    newImage.src = imageUrls[currentIndex];

    newImage.onload = () => {
      clearTimeout(loadingTimeout);
      lightboxContainer.classList.remove('loading');

      // Verify this is still the current request (user might have navigated away)
      if (newImage !== pendingImageLoad) return;

      // Instant swap - no flash because image is fully loaded
      lightboxImage.src = imageUrls[currentIndex];
      pendingImageLoad = null;

      // Re-trigger animation only on initial lightbox open
      if (isInitialOpen) {
        lightboxImage.style.animation = 'none';
        void lightboxImage.offsetHeight; // Force reflow
        lightboxImage.style.animation = '';
      }
    };

    newImage.onerror = () => {
      clearTimeout(loadingTimeout);
      lightboxContainer.classList.remove('loading');

      if (newImage !== pendingImageLoad) return;

      // Fallback: show image anyway (browser will display error state)
      lightboxImage.src = imageUrls[currentIndex];
      pendingImageLoad = null;
    };

    // Open lightbox UI if this is initial open
    if (isInitialOpen) {
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    if (window.closeMenu) window.closeMenu();
    updateNavButtons();
    updateCounter();

    // Preload adjacent images for smoother navigation
    preloadImage(currentIndex + 1);
    preloadImage(currentIndex - 1);

    // Show swipe hint on first use
    if (!localStorage.getItem('swipeHintShown')) {
      swipeHint.style.display = 'block';
      localStorage.setItem('swipeHintShown', 'true');
    } else {
      swipeHint.style.display = 'none';
    }
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    resetZoom();
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const showNextImage = () => {
    if (currentIndex + 1 < imageUrls.length) {
      openLightbox(currentIndex + 1);
    }
  };

  const showPrevImage = () => {
    if (currentIndex - 1 >= 0) {
      openLightbox(currentIndex - 1);
    }
  };

  const updateNavButtons = () => {
    lightboxPrev.classList.toggle('disabled', currentIndex === 0);
    lightboxNext.classList.toggle('disabled', currentIndex === imageUrls.length - 1);
  };

  // Zoom functionality
  const toggleZoom = (e) => {
    if (!isZoomed) {
      scale = 2.5;
      isZoomed = true;
      lightboxContainer.classList.add('zoomed');

      const rect = lightboxImage.getBoundingClientRect();
      const x = e.clientX || rect.left + rect.width / 2;
      const y = e.clientY || rect.top + rect.height / 2;

      translateX = (rect.width / 2 - (x - rect.left)) * 0.4;
      translateY = (rect.height / 2 - (y - rect.top)) * 0.4;
    } else {
      resetZoom();
    }
    updateImageTransform();
  };

  // Mouse drag for zoomed image
  lightboxContainer.addEventListener('mousedown', (e) => {
    if (!isZoomed) return;
    e.preventDefault();
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    lightboxContainer.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateImageTransform();
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      lightboxContainer.style.cursor = isZoomed ? 'zoom-out' : 'zoom-in';
    }
  });

  // Click to zoom (desktop only)
  lightboxContainer.addEventListener('click', (e) => {
    if (!isDragging && e.target === lightboxImage && !('ontouchstart' in window)) {
      toggleZoom(e);
    }
  });

  // Touch gestures with Hammer.js
  setupLightboxGestures(lightbox, lightboxContainer, {
    currentIndex,
    imageUrls,
    get isZoomed() { return isZoomed; },
    set isZoomed(val) { isZoomed = val; },
    get scale() { return scale; },
    set scale(val) { scale = val; },
    get translateX() { return translateX; },
    set translateX(val) { translateX = val; },
    get translateY() { return translateY; },
    set translateY(val) { translateY = val; }
  }, {
    showNext: showNextImage,
    showPrev: showPrevImage,
    updateTransform: updateImageTransform
  });

  // Fullscreen with iOS fallback
  lightboxFullscreen.addEventListener('click', async () => {
    // Detect fullscreen capability
    const isFullscreenSupported = document.fullscreenEnabled ||
                                 document.webkitFullscreenEnabled ||
                                 false;

    if (!isFullscreenSupported) {
      // iOS fallback: Use pseudo-fullscreen with CSS
      lightbox.classList.toggle('pseudo-fullscreen');

      // Optionally hide browser UI on iOS
      if (window.navigator.standalone !== undefined) {
        window.scrollTo(0, 1);
      }
      return;
    }

    // Desktop/Android: Use real fullscreen API
    try {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (lightbox.requestFullscreen) {
          await lightbox.requestFullscreen();
        } else if (lightbox.webkitRequestFullscreen) {
          await lightbox.webkitRequestFullscreen();
        }
        lightbox.classList.add('fullscreen');
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }
        lightbox.classList.remove('fullscreen');
      }
    } catch (err) {
      // Fallback if fullscreen fails
      console.warn('Fullscreen failed, using pseudo-fullscreen:', err);
      lightbox.classList.toggle('pseudo-fullscreen');
    }
  });

  // Auto-hide controls in fullscreen
  let controlsTimeout;
  lightbox.addEventListener('mousemove', () => {
    if (lightbox.classList.contains('fullscreen')) {
      lightbox.classList.add('show-controls');
      clearTimeout(controlsTimeout);
      controlsTimeout = setTimeout(() => {
        lightbox.classList.remove('show-controls');
      }, 2500);
    }
  });

  // Event delegation: Single listener on container
  const portfolioGrid = document.querySelector('.portfolio-grid, .contact-sheet-grid');
  if (portfolioGrid) {
    portfolioGrid.addEventListener('click', (e) => {
      const thumb = e.target.closest('.portfolio-thumb, .contact-sheet-thumb');
      if (!thumb) return;

      e.preventDefault();
      const index = Array.from(thumbnails).indexOf(thumb);
      if (index !== -1) openLightbox(index);
    });
  }

  // Navigation buttons with tap protection
  const handleNavClick = (e, direction) => {
    e.stopPropagation();
    e.preventDefault();

    const currentTime = Date.now();
    if (currentTime - lastTapTime < 300) return;
    lastTapTime = currentTime;

    const button = e.currentTarget;
    if (!button.classList.contains('disabled')) {
      direction === 'next' ? showNextImage() : showPrevImage();
    }
  };

  lightboxNext.addEventListener('click', (e) => handleNavClick(e, 'next'));
  lightboxPrev.addEventListener('click', (e) => handleNavClick(e, 'prev'));

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', closeLightbox);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    // Global shortcuts
    if (!lightbox.classList.contains('open')) {
      const themeToggle = document.getElementById('theme-toggle');
      const monochromeToggle = document.getElementById('monochrome-toggle');
      const transparencyToggle = document.getElementById('reduce-transparency-toggle');
      switch(e.key) {
        case 'd':
        case 'D':
          if (themeToggle) themeToggle.click();
          break;
        case 'm':
        case 'M':
          if (monochromeToggle) monochromeToggle.click();
          break;
        case 'g':
        case 'G':
          if (transparencyToggle) transparencyToggle.click();
          break;
        case '?':
          const shortcutsOverlay = document.getElementById('shortcuts-overlay');
          if (shortcutsOverlay) shortcutsOverlay.classList.toggle('visible');
          break;
      }
      return;
    }

    // Lightbox shortcuts
    switch(e.key) {
      case 'ArrowRight':
        if (!lightboxNext.classList.contains('disabled')) showNextImage();
        break;
      case 'ArrowLeft':
        if (!lightboxPrev.classList.contains('disabled')) showPrevImage();
        break;
      case 'Escape':
        closeLightbox();
        break;
      case 'f':
      case 'F':
        lightboxFullscreen.click();
        break;
      case ' ':
        e.preventDefault();
        if (!('ontouchstart' in window)) {
          toggleZoom({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
        }
        break;
    }
  });
}

/* ===============================================
 * KEYBOARD SHORTCUTS OVERLAY
 * =============================================== */
const shortcutsOverlay = document.getElementById('shortcuts-overlay');
const shortcutsTrigger = document.getElementById('shortcuts-trigger');

if (shortcutsTrigger && shortcutsOverlay) {
  shortcutsTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    shortcutsOverlay.classList.toggle('visible');
  });
}

if (shortcutsOverlay) {
  document.addEventListener('click', (e) => {
    if (shortcutsOverlay.classList.contains('visible') &&
        !shortcutsOverlay.contains(e.target) &&
        e.target !== shortcutsTrigger) {
      shortcutsOverlay.classList.remove('visible');
    }
  });
}

/* ===============================================
 * EMAIL COPY TO CLIPBOARD
 * =============================================== */
// Find all email links and add click-to-copy functionality
document.addEventListener('DOMContentLoaded', () => {
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'runzeni2001@gmail.com';

      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showCopyNotification(link, 'Email copied!');
        }).catch(() => {
          // Fallback for older browsers
          fallbackCopyToClipboard(email, link);
        });
      } else {
        fallbackCopyToClipboard(email, link);
      }
    });
  });
});

function fallbackCopyToClipboard(text, element) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showCopyNotification(element, 'Email copied!');
  } catch (err) {
    showCopyNotification(element, 'Copy failed');
  }
  document.body.removeChild(textarea);
}

function showCopyNotification(element, message) {
  const notification = document.createElement('div');
  notification.className = 'copy-notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  requestAnimationFrame(() => {
    notification.classList.add('show');
  });

  setTimeout(() => {
    notification.classList.add('hide');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

  // Export to global scope (needed by menu)
  window.closeMenu = closeMenu;

  /* ===============================================
   * MASONRY GRID LAYOUT (Portfolio)
   * =============================================== */
  var grid = document.querySelector('.portfolio-grid');
  if (grid) {
    imagesLoaded(grid, function() {
      // Detect portrait images and add class before Masonry measures
      var thumbs = grid.querySelectorAll('.portfolio-thumb');
      thumbs.forEach(function(img) {
        if (img.naturalHeight > img.naturalWidth) {
          img.classList.add('portrait');
        }
      });

      var msnry = new Masonry(grid, {
        itemSelector: '.portfolio-thumb',
        columnWidth: '.grid-sizer',
        gutter: 10,
        percentPosition: true,
        transitionDuration: 0
      });

      // Fade in the grid
      grid.classList.add('is-loaded');

      // Re-sync thumbnails for lightbox
      var freshThumbs = grid.querySelectorAll('.portfolio-thumb');
      if (freshThumbs.length > 0) {
        thumbnails = freshThumbs;
        imageUrls.length = 0;
        Array.from(freshThumbs).forEach(function(t) {
          imageUrls.push(t.src || t.dataset.src || '');
        });
      }
    });
  }

  /* ===============================================
   * MASONRY GRID LAYOUT (Contact Sheet)
   * =============================================== */
  var contactGrid = document.querySelector('.contact-sheet-grid');
  if (contactGrid) {
    imagesLoaded(contactGrid, function() {
      var msnryContact = new Masonry(contactGrid, {
        itemSelector: '.contact-sheet-thumb',
        columnWidth: '.contact-sheet-sizer',
        gutter: 10,
        percentPosition: true,
        transitionDuration: 0
      });

      // Fade in the grid
      contactGrid.classList.add('is-loaded');

      // Re-sync thumbnails for lightbox
      var freshThumbs = contactGrid.querySelectorAll('.contact-sheet-thumb');
      if (freshThumbs.length > 0) {
        thumbnails = freshThumbs;
        imageUrls.length = 0;
        Array.from(freshThumbs).forEach(function(t) {
          imageUrls.push(t.src || t.dataset.src || '');
        });
      }
    });
  }
})();

/* ===============================================
 * CODE BLOCK — STICKY HEADER + COPY TO CLIPBOARD
 * =============================================== */
(function initCodeHeaders() {
  var COPY_ICON = '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  var CHECK_ICON = '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>';

  /* Language display names */
  var LANG_MAP = {
    bash: 'bash', sh: 'sh', shell: 'shell', zsh: 'zsh',
    python: 'python', py: 'python', ruby: 'ruby',
    javascript: 'js', js: 'js', typescript: 'ts', ts: 'ts',
    html: 'html', css: 'css', scss: 'scss', sass: 'sass',
    yaml: 'yaml', yml: 'yaml', json: 'json', xml: 'xml',
    sql: 'sql', r: 'R', c: 'C', cpp: 'C++', java: 'java',
    go: 'go', rust: 'rust', swift: 'swift', kotlin: 'kotlin',
    plaintext: '', text: ''
  };

  function getLang(wrapper) {
    var classes = wrapper.className.split(/\s+/);
    for (var i = 0; i < classes.length; i++) {
      var m = classes[i].match(/^language-(.+)$/);
      if (m) return LANG_MAP[m[1]] !== undefined ? LANG_MAP[m[1]] : m[1];
    }
    return '';
  }

  function createHeader(lang, codeEl) {
    var header = document.createElement('div');
    header.className = 'code-header';

    /* Language label (left) */
    var langSpan = document.createElement('span');
    langSpan.className = 'code-lang';
    langSpan.textContent = lang || '';
    header.appendChild(langSpan);

    /* Copy button (right) */
    var btn = document.createElement('button');
    btn.className = 'code-copy-btn';
    btn.setAttribute('aria-label', 'Copy code');
    btn.innerHTML = COPY_ICON;
    header.appendChild(btn);

    btn.addEventListener('click', function () {
      var text = (codeEl).textContent;
      navigator.clipboard.writeText(text).then(function () {
        btn.innerHTML = CHECK_ICON;
        btn.classList.add('copied');
        setTimeout(function () {
          btn.innerHTML = COPY_ICON;
          btn.classList.remove('copied');
        }, 2000);
      });
    });

    return header;
  }

  function init() {
    /* Rouge-highlighted blocks (fenced code with language) */
    document.querySelectorAll('div.highlighter-rouge').forEach(function (wrapper) {
      if (wrapper.querySelector('.code-header')) return;
      var lang = getLang(wrapper);
      var codeEl = wrapper.querySelector('code') || wrapper.querySelector('pre');
      var header = createHeader(lang, codeEl);
      wrapper.insertBefore(header, wrapper.firstChild);
    });

    /* Plain <pre> blocks not inside a Rouge wrapper */
    document.querySelectorAll('pre').forEach(function (pre) {
      if (pre.closest('.highlighter-rouge')) return;
      var parent = pre.parentElement;
      if (!parent || !parent.classList.contains('code-block-wrapper')) {
        var wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
      }
      var container = pre.parentElement;
      if (container.querySelector('.code-header')) return;
      var codeEl = pre.querySelector('code') || pre;
      var header = createHeader('', codeEl);
      container.insertBefore(header, container.firstChild);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
