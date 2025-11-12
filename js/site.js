// Minimal shared site script: footer year + theme toggle
(function () {
  // Footer year
  var y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  // Theme toggle behavior (assumes data-theme already set in <head>)
  var btn = document.getElementById('themeToggle');
  if (!btn) return;

  var isKO = (document.documentElement.lang || '').toLowerCase().startsWith('ko');
  function setIcon(t) {
    btn.textContent = t === 'dark' ? '☀️' : '🌙';
    var label = isKO
      ? (t === 'dark' ? '라이트 모드 전환' : '다크 모드 전환')
      : (t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    btn.setAttribute('aria-label', label);
    btn.title = label;
  }

  var theme = document.documentElement.getAttribute('data-theme') || 'light';
  setIcon(theme);

  btn.addEventListener('click', function () {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    setIcon(theme);
  });

  if (window.matchMedia) {
    try {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', function (e) {
        // Only auto-switch if user hasn't explicitly chosen a theme
        try {
          if (!localStorage.getItem('theme')) {
            theme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            setIcon(theme);
          }
        } catch (err) {}
      });
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
    links.forEach(function (a) {
      var href = a.getAttribute('href') || '';
      // Skip language switch links containing '/ko/' or pointing to parent root when not matching
      var target = baseName(href.replace(/^\.\//, ''));
      if (target === current) {
        a.classList.add('active');
        if (!a.getAttribute('aria-current')) a.setAttribute('aria-current', 'page');
      }
    });
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
