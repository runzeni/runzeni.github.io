/* ===============================================
 * JAVASCRIPT - Main Site Interactions
 * ===============================================
 */

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
 * DARK MODE TOGGLE
 * =============================================== */
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

if (themeToggle) {
  // Initialize aria-label based on current state
  const initTheme = htmlElement.getAttribute('data-theme');
  themeToggle.setAttribute('aria-label',
    initTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  );
  themeToggle.setAttribute('title',
    initTheme === 'dark' ? 'Switch to light mode (D)' : 'Switch to dark mode (D)'
  );

  // Toggle button click handler
  themeToggle.addEventListener('click', () => {
    const current = htmlElement.getAttribute('data-theme');
    const newTheme = current === 'light' ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Update accessibility attributes
    themeToggle.setAttribute('aria-label',
      newTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
    themeToggle.setAttribute('title',
      newTheme === 'dark' ? 'Switch to light mode (D)' : 'Switch to dark mode (D)'
    );
  });

  // Listen for system preference changes (only applies if no user override)
  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      htmlElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
  });
}

/* ===============================================
 * MONOCHROME MODE TOGGLE
 * =============================================== */
const monochromeToggle = document.getElementById('monochrome-toggle');

if (monochromeToggle) {
  // Initialize aria-label based on current state
  const initMonochrome = htmlElement.getAttribute('data-monochrome');
  monochromeToggle.setAttribute('aria-label',
    initMonochrome === 'true' ? 'Switch to color mode' : 'Switch to monochrome mode'
  );
  monochromeToggle.setAttribute('title',
    initMonochrome === 'true' ? 'Switch to color mode (M)' : 'Switch to B&W mode (M)'
  );

  monochromeToggle.addEventListener('click', () => {
    const current = htmlElement.getAttribute('data-monochrome');
    const newMode = current === 'false' ? 'true' : 'false';
    htmlElement.setAttribute('data-monochrome', newMode);
    localStorage.setItem('monochrome', newMode);

    // Update accessibility attributes
    monochromeToggle.setAttribute('aria-label',
      newMode === 'true' ? 'Switch to color mode' : 'Switch to monochrome mode'
    );
    monochromeToggle.setAttribute('title',
      newMode === 'true' ? 'Switch to color mode (M)' : 'Switch to B&W mode (M)'
    );
  });
}

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
 * STICKY NAVIGATION (IntersectionObserver)
 * =============================================== */
const stickyNav = document.getElementById('sticky-nav');
const scrollTop = document.getElementById('scroll-top');
const scrollBottom = document.getElementById('scroll-bottom');

if (stickyNav) {
  // Use IntersectionObserver for better performance
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // When the header is NOT intersecting (scrolled past), show sticky nav
      stickyNav.classList.toggle('visible', !entry.isIntersecting);
    });
  }, {
    // Trigger when element is at 50% viewport
    rootMargin: '0px 0px -50% 0px',
    threshold: 0
  });

  // Observe the header
  const header = document.getElementById('site-header');
  if (header) {
    observer.observe(header);
  }
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
      href: '/archive/',
      title: 'Archive',
      ariaLabel: 'View photo archive',
      show: true
    },
    'archive': {
      href: '/archive/',
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
  const header = document.getElementById('site-header');

  // If on homepage, smooth scroll to hero section
  if (heroSection && window.location.pathname === '/') {
    // DYNAMIC: Get actual header height instead of hardcoded 80px
    const offset = header ? header.offsetHeight : 80;
    const targetPosition = heroSection.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
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
      const header = document.getElementById('site-header');
      if (heroSection) {
        const offset = header ? header.offsetHeight : 80;
        const targetPosition = heroSection.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
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
 * LAZY LOADING
 * =============================================== */
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '100px 0px',
    threshold: 0.01
  });

  document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

/* ===============================================
 * LIGHTBOX
 * =============================================== */
const portfolioThumbs = document.querySelectorAll('.portfolio-thumb');
const contactSheetThumbs = document.querySelectorAll('.contact-sheet-thumb');

let thumbnails = [];
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

  const imageUrls = Array.from(thumbnails).map(thumb => thumb.src || thumb.dataset.src);
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

  // Modern touch gestures with Hammer.js
  const hammerLightbox = new Hammer(lightbox);
  const hammerContainer = new Hammer(lightboxContainer);

  // Configure gestures
  hammerLightbox.get('swipe').set({
    direction: Hammer.DIRECTION_HORIZONTAL,
    threshold: 50,
    velocity: 0.3
  });
  hammerContainer.get('pinch').set({ enable: true });
  hammerContainer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

  // Swipe to navigate (left/right)
  hammerLightbox.on('swipeleft', () => {
    if (currentIndex < imageUrls.length - 1 && !isZoomed) {
      showNextImage();
    }
  });

  hammerLightbox.on('swiperight', () => {
    if (currentIndex > 0 && !isZoomed) {
      showPrevImage();
    }
  });

  // Pinch to zoom
  let startScale = 1;
  hammerContainer.on('pinchstart', (e) => {
    startScale = scale;
  });

  hammerContainer.on('pinchmove', (e) => {
    scale = Math.max(1, Math.min(5, startScale * e.scale));  // 1x to 5x zoom
    isZoomed = scale > 1;
    lightboxContainer.classList.toggle('zoomed', isZoomed);
    updateImageTransform();
  });

  hammerContainer.on('pinchend', (e) => {
    if (scale < 1.1) {
      // Reset if barely zoomed
      scale = 1;
      isZoomed = false;
      translateX = 0;
      translateY = 0;
      lightboxContainer.classList.remove('zoomed');
      updateImageTransform();
    }
  });

  // Pan when zoomed
  hammerContainer.on('panstart', (e) => {
    if (isZoomed) {
      e.preventDefault();
    }
  });

  hammerContainer.on('panmove', (e) => {
    if (isZoomed) {
      e.preventDefault();
      translateX += e.deltaX / scale;
      translateY += e.deltaY / scale;
      updateImageTransform();
    }
  });

  // Double-tap to zoom in/out
  hammerContainer.on('doubletap', (e) => {
    if (isZoomed) {
      // Reset zoom
      scale = 1;
      isZoomed = false;
      translateX = 0;
      translateY = 0;
      lightboxContainer.classList.remove('zoomed');
    } else {
      // Zoom in to 2x at tap location
      scale = 2;
      isZoomed = true;
      lightboxContainer.classList.add('zoomed');

      // Center zoom on tap point
      const rect = lightboxContainer.getBoundingClientRect();
      const tapX = e.center.x - rect.left;
      const tapY = e.center.y - rect.top;
      translateX = (rect.width / 2 - tapX) / scale;
      translateY = (rect.height / 2 - tapY) / scale;
    }
    updateImageTransform();
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

  // Thumbnail clicks
  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(index);
    });
  });

  // Navigation buttons with tap protection
  lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();

    const currentTime = Date.now();
    if (currentTime - lastTapTime < 300) return;
    lastTapTime = currentTime;

    if (!lightboxNext.classList.contains('disabled')) {
      showNextImage();
    }
  });

  lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();

    const currentTime = Date.now();
    if (currentTime - lastTapTime < 300) return;
    lastTapTime = currentTime;

    if (!lightboxPrev.classList.contains('disabled')) {
      showPrevImage();
    }
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', closeLightbox);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    // Global shortcuts
    if (!lightbox.classList.contains('open')) {
      switch(e.key) {
        case 'd':
        case 'D':
          if (themeToggle) themeToggle.click();
          break;
        case 'm':
        case 'M':
          if (monochromeToggle) monochromeToggle.click();
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
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--color-accent);
    color: var(--color-bg);
    padding: 1rem 2rem;
    border-radius: 8px;
    font-family: var(--font-sans);
    font-weight: 600;
    font-size: 0.95rem;
    z-index: 10000;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    animation: fadeInOut 2s ease forwards;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// Add animation for notification
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
    10% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    90% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
  }
`;
document.head.appendChild(style);

/* ===============================================
 * FLIP ANIMATION
 * =============================================== */
/* Optimized FLIP animation - detects column changes to prevent jarring transitions */
(function() {
  let firstRects = null;
  let isAnimating = false;

  const captureFirst = () => {
    const grids = document.querySelectorAll('.gallery-grid, .contact-sheet-grid, .cocktails-grid');
    if (!grids.length) return;

    firstRects = Array.from(grids).map(grid => {
      const items = grid.querySelectorAll('.gallery-item, .contact-sheet-thumb, .cocktail-card');
      return Array.from(items).map(el => {
        const r = el.getBoundingClientRect();
        return { left: r.left, top: r.top, width: r.width, height: r.height, el };
      });
    });
  };

  const animateFLIP = () => {
    if (isAnimating || !firstRects) return;
    isAnimating = true;

    const grids = document.querySelectorAll('.gallery-grid, .contact-sheet-grid, .cocktails-grid');
    const lastRects = Array.from(grids).map(grid => {
      const items = grid.querySelectorAll('.gallery-item, .contact-sheet-thumb, .cocktail-card');
      return Array.from(items).map(el => ({ rect: el.getBoundingClientRect(), el }));
    });

    requestAnimationFrame(() => {
      grids.forEach((grid, gi) => {
        const first = firstRects[gi] || [];
        const last = lastRects[gi] || [];

        // Detect column count change: if many items changed size, skip all animations for this grid
        let sizeChangedCount = 0;
        last.forEach((item, i) => {
          const f = first[i];
          if (f && Math.abs(f.width - item.rect.width) / f.width > 0.02) {
            sizeChangedCount++;
          }
        });

        // If >50% of items changed size, this is likely a column change - skip animation
        if (sizeChangedCount > last.length * 0.5) return;

        // Animate individual items that only moved (didn't resize)
        last.forEach((item, i) => {
          const f = first[i];
          if (!f) return;

          const dx = f.left - item.rect.left;
          const dy = f.top - item.rect.top;
          const sizeChange = Math.abs(f.width - item.rect.width) / f.width;

          // Skip if: no significant movement OR item resized
          if ((Math.abs(dx) < 5 && Math.abs(dy) < 5) || sizeChange > 0.02) return;

          item.el.style.transition = 'none';
          item.el.style.transform = `translate(${dx}px, ${dy}px)`;
          item.el.setAttribute('data-flip', 'true');
        });
      });

      const animated = document.querySelectorAll('[data-flip="true"]');
      if (!animated.length) {
        isAnimating = false;
        firstRects = null;
        return;
      }

      void grids[0]?.offsetHeight;

      requestAnimationFrame(() => {
        animated.forEach(el => {
          el.style.transition = '';
          el.style.transform = '';
          el.addEventListener('transitionend', () => el.removeAttribute('data-flip'), { once: true });
        });
        isAnimating = false;
      });
    });

    firstRects = null;
  };

  let resizeTimer = null;
  const onResize = () => {
    if (!resizeTimer) captureFirst();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      animateFLIP();
      resizeTimer = null;
    }, 200);
  };

  window.addEventListener('resize', onResize, { passive: true });
})();
