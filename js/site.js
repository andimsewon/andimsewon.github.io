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
      if (href.charAt(0) === '#' || a.hasAttribute('hreflang')) continue;
      var target = baseName(href.replace(/^\.\//, ''));
      if (target === current) {
        a.classList.add('active');
        if (!a.getAttribute('aria-current')) a.setAttribute('aria-current', 'page');
      }
    }

    // On long home pages, keep the navigation aligned with the section in view.
    var sectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (sectionLinks.length && 'IntersectionObserver' in window) {
      var sectionLinkMap = {};
      var sectionObserver = new IntersectionObserver(function (entries) {
        for (var j = 0; j < entries.length; j++) {
          if (!entries[j].isIntersecting) continue;
          for (var k = 0; k < sectionLinks.length; k++) {
            sectionLinks[k].classList.remove('active');
            sectionLinks[k].removeAttribute('aria-current');
          }
          var activeLink = sectionLinkMap[entries[j].target.id];
          if (activeLink) {
            activeLink.classList.add('active');
            activeLink.setAttribute('aria-current', 'location');
          }
        }
      }, { rootMargin: '-22% 0px -66% 0px', threshold: 0 });

      for (var j = 0; j < sectionLinks.length; j++) {
        var sectionId = (sectionLinks[j].getAttribute('href') || '').slice(1);
        var section = document.getElementById(sectionId);
        if (section) {
          sectionLinkMap[sectionId] = sectionLinks[j];
          sectionObserver.observe(section);
        }
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
