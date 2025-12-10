// Minimal shared site script: footer year + theme toggle
// Page enter transition: soft fade/slide
(function () {
  try {
    document.body.classList.add('page-enter');
    var onReady = function () {
      // next frame to ensure transition applies
      try {
        requestAnimationFrame(function () {
          document.body.classList.add('page-enter-active');
          // cleanup class after animation
          setTimeout(function () {
            document.body.classList.remove('page-enter');
          }, 750);
        });
      } catch (_) {
        document.body.classList.add('page-enter-active');
        document.body.classList.remove('page-enter');
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onReady);
    } else {
      onReady();
    }
  } catch (_) {}
})();

// Minimal shared site script: footer year + theme toggle
(function () {
  // Footer year
  var y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  // Theme toggle behavior (assumes data-theme already set in <head>)
  var btn = document.getElementById('themeToggle');
  var isKO = (document.documentElement.lang || '').toLowerCase().startsWith('ko');

  function setIcon(t) {
    if (!btn) return;
    btn.textContent = t === 'dark' ? '☀️' : '🌙';
    var label = isKO
      ? (t === 'dark' ? '라이트 모드 전환' : '다크 모드 전환')
      : (t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    btn.setAttribute('aria-label', label);
    btn.title = label;
  }

  var theme = document.documentElement.getAttribute('data-theme') || 'light';
  setIcon(theme);

  if (btn) {
    btn.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      try { localStorage.setItem('theme', theme); } catch (e) {}
      setIcon(theme);
    });
  }

  if (window.matchMedia) {
    try {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onChange = function (e) {
        // Only auto-switch if user hasn't explicitly chosen a theme
        try {
          if (!localStorage.getItem('theme')) {
            theme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            setIcon(theme);
          }
        } catch (err) {}
      };
      if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', onChange);
      } else if (typeof mq.addListener === 'function') {
        mq.addListener(onChange);
      }
    } catch (err) {}
  }

  // Auto-highlight current nav link
  try {
    var links = document.querySelectorAll('.nav-links a');
    var path = (location.pathname || '').replace(/\/$/, '');
    function baseName(p) {
      if (!p || p === '/') return 'index.html';
      var seg = p.split('/').pop();
      return seg === '' ? 'index.html' : seg;
    }
    var current = baseName(path);
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var href = a.getAttribute('href') || '';
      var target = baseName(href.replace(/^\.\//, ''));
      if (target === current) {
        a.classList.add('active');
        if (!a.getAttribute('aria-current')) a.setAttribute('aria-current', 'page');
      }
    }
  } catch (err) {}
})();

// Mobile nav toggle and Back-to-top
(function () {
  try {
    // Mobile nav toggle
    var toggle = document.getElementById('navToggle');
    if (toggle) {
      var navContainer = (function(el){
        if (!el) return null;
        if (typeof el.closest === 'function') return el.closest('.nav-container');
        // Fallback for older browsers
        var p = el.parentElement;
        while (p) {
          if (p.classList && p.classList.contains('nav-container')) return p;
          p = p.parentElement;
        }
        return null;
      })(toggle);
      var isKO = (document.documentElement.lang || '').toLowerCase().startsWith('ko');
      function setToggleState(expanded) {
        toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        toggle.textContent = expanded ? '✕' : '☰';
        toggle.title = expanded ? (isKO ? '메뉴 닫기' : 'Close menu') : (isKO ? '메뉴 열기' : 'Open menu');
        toggle.setAttribute('aria-label', toggle.title);
      }
      setToggleState(false);
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = navContainer.classList.toggle('is-open');
        setToggleState(open);
      });
      // Close on Escape for accessibility
      document.addEventListener('keydown', function (e) {
        if ((e.key === 'Escape' || e.key === 'Esc') && navContainer && navContainer.classList.contains('is-open')) {
          navContainer.classList.remove('is-open');
          setToggleState(false);
        }
      });
      // Close on resize/orientation change when leaving mobile layout
      var closeOnResize = function () {
        try {
          if (window.innerWidth >= 769 && navContainer && navContainer.classList.contains('is-open')) {
            navContainer.classList.remove('is-open');
            setToggleState(false);
          }
        } catch (_) {}
      };
      window.addEventListener('resize', closeOnResize);
      window.addEventListener('orientationchange', closeOnResize);
      // Close when clicking a link (better UX)
      var navLinks = navContainer ? navContainer.querySelectorAll('.nav-links a') : [];
      for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener('click', function () {
          if (navContainer && navContainer.classList.contains('is-open')) {
            navContainer.classList.remove('is-open');
            setToggleState(false);
          }
        });
      }
      // Close on outside click
      document.addEventListener('click', function (e) {
        if (navContainer && !navContainer.contains(e.target)) {
          if (navContainer.classList.contains('is-open')) {
            navContainer.classList.remove('is-open');
            setToggleState(false);
          }
        }
      });
    }

    // Back to top button
    var back = document.getElementById('backToTop');
    var topNav = document.querySelector('.top-nav');
    function onScroll() {
      if (back) {
        var show = window.scrollY > 300;
        back.classList.toggle('visible', show);
      }
      if (topNav) {
        topNav.classList.toggle('scrolled', window.scrollY > 8);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (back) {
      back.addEventListener('click', function () {
        try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (_) { window.scrollTo(0, 0); }
      });
    }
  } catch (err) {}
})();

// PDF lazy loading utility
(function() {
  'use strict';
  
  function initPdfLazyLoading(containerId) {
    if (!('IntersectionObserver' in window)) {
      // Fallback: load immediately
      const container = document.getElementById(containerId);
      if (container) {
        const iframe = container.querySelector('iframe[data-src]');
        if (iframe && iframe.dataset.src) {
          iframe.src = iframe.dataset.src;
          iframe.removeAttribute('data-src');
        }
      }
      return;
    }
    
    const pdfObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const iframe = entry.target.querySelector('iframe[data-src]');
          if (iframe && iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
            iframe.removeAttribute('data-src');
            pdfObserver.unobserve(entry.target);
          }
        }
      });
    }, { rootMargin: '50px' });
    
    const container = document.getElementById(containerId);
    if (container) {
      pdfObserver.observe(container);
    }
  }
  
  // Initialize lazy loading for common PDF container IDs
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      ['presentationThumbnail', 'paperThumbnail'].forEach(function(id) {
        if (document.getElementById(id)) {
          initPdfLazyLoading(id);
        }
      });
    });
  } else {
    ['presentationThumbnail', 'paperThumbnail'].forEach(function(id) {
      if (document.getElementById(id)) {
        initPdfLazyLoading(id);
      }
    });
  }
})();

// Scroll reveal: reveal elements smoothly when entering viewport
(function () {
  try {
    var prefersReduced = false;
    try {
      if (window.matchMedia) {
        var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        prefersReduced = mq && mq.matches;
      }
    } catch (_) {}

    if (prefersReduced) return; // Respect user preference

    var selectors = [
      '.section-title',
      '.container',
      '.info-item',
      '.skill-category',
      '.quick-link-card',
      '.project-card',
      '.project-item',
      '.contact-icon',
      '.project-certificate',
      '.project-web-embed',
      '.project-web-fallback'
    ].join(',');

    var candidates = [];
    try { candidates = Array.prototype.slice.call(document.querySelectorAll(selectors)); } catch (_) {}
    if (!candidates.length) return;

    // Helper: in viewport
    function isInViewport(el) {
      try {
        var r = el.getBoundingClientRect();
        var h = window.innerHeight || document.documentElement.clientHeight;
        return r.top <= h * 0.9; // consider near-fold as visible
      } catch (_) { return true; }
    }

    // Stagger within containers for natural flow
    function assignDelays(group) {
      for (var i = 0; i < group.length; i++) {
        var el = group[i];
        try { el.style.setProperty('--reveal-delay', (i * 90) + 'ms'); } catch (_) {}
      }
    }

    // Group by nearest .container for nicer cascading
    var groupsByContainer = new Map();
    candidates.forEach(function (el) {
      var container = null;
      try {
        if (typeof el.closest === 'function') container = el.closest('.container');
      } catch (_) {}
      var key = container || document.body;
      if (!groupsByContainer.has(key)) groupsByContainer.set(key, []);
      groupsByContainer.get(key).push(el);
    });
    groupsByContainer.forEach(assignDelays);

    // Observer to reveal when intersecting
    var io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            e.target.classList.remove('reveal');
            try { io.unobserve(e.target); } catch (_) {}
          }
        });
      }, { rootMargin: '60px 0px' });
    }

    // Initialize: only mark offscreen elements as .reveal to avoid flicker
    candidates.forEach(function (el) {
      if (isInViewport(el)) {
        el.classList.add('is-visible');
      } else {
        el.classList.add('reveal');
        if (io) io.observe(el);
      }
    });

    // Handle dynamically loaded content (basic)
    try {
      var mo = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          if (!m.addedNodes) return;
          for (var i = 0; i < m.addedNodes.length; i++) {
            var n = m.addedNodes[i];
            if (!(n instanceof Element)) continue;
            var newly = [];
            try { newly = Array.prototype.slice.call(n.querySelectorAll(selectors)); } catch (_) {}
            if (!newly.length) continue;
            newly.forEach(function (el) {
              if (isInViewport(el)) {
                el.classList.add('is-visible');
              } else {
                el.classList.add('reveal');
                if (io) io.observe(el);
              }
            });
          }
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (_) {}
  } catch (_) {}
})();
