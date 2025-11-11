/**
 * Section Loader Module
 * Dynamically loads HTML sections from the sections/ directory
 */

class SectionLoader {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.sections = [
      'sections/main.html',
      'sections/research.html',
      'sections/projects.html',
      'sections/awards.html',
      'sections/gallery.html'
    ];
    this.navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  }

  async loadSection(sectionPath) {
    try {
      const response = await fetch(sectionPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      return html;
    } catch (error) {
      console.error(`Error loading ${sectionPath}:`, error);
      return null;
    }
  }

  async loadAllSections() {
    if (!this.container) {
      console.error('Container not found');
      return;
    }

    let appendedCount = 0;
    for (const sectionPath of this.sections) {
      const html = await this.loadSection(sectionPath);
      if (html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const sectionElement = tempDiv.firstElementChild;
        if (sectionElement) {
          this.container.appendChild(sectionElement);
          appendedCount++;
        }
      }
    }

    if (appendedCount === 0) {
      const warn = document.createElement('div');
      warn.className = 'container';
      warn.style.marginTop = '40px';
      warn.style.padding = '40px';
      warn.style.textAlign = 'center';
      warn.style.backgroundColor = '#fef8fa';
      warn.style.borderRadius = '8px';
      warn.style.border = '1px solid #f0e0e6';
      warn.innerHTML = `
        <div style="color:#b87a95; font-size: 24px; font-weight: 600; margin-bottom: 16px;">
          ⚠️ Could not load sections
        </div>
        <div style="color:#5a5a5a; font-size: 16px; line-height: 1.8; margin-bottom: 24px;">
          Sections are not loading because this file was opened directly.<br>
          Please run a local server to view the site properly.
        </div>
        <div style="background: #ffffff; padding: 20px; border-radius: 6px; border: 1px solid #f0e0e6; text-align: left; max-width: 600px; margin: 0 auto;">
          <div style="color:#2d2d2d; font-weight: 600; margin-bottom: 12px; font-size: 18px;">
            📋 How to run a local server
          </div>
          <div style="color:#5a5a5a; font-size: 14px; line-height: 1.8;">
            <strong>1. Open a terminal and go to the project folder:</strong><br>
            <code style="background: #f5f5f5; padding: 4px 8px; border-radius: 4px; font-family: monospace;">cd /Users/kimsewon/andimsewon.github.io</code>
            <br><br>
            <strong>2. Run one of the following commands:</strong><br>
            <code style="background: #f5f5f5; padding: 4px 8px; border-radius: 4px; font-family: monospace;">python3 -m http.server 8000</code><br>
            or<br>
            <code style="background: #f5f5f5; padding: 4px 8px; border-radius: 4px; font-family: monospace;">python -m http.server 8000</code>
            <br><br>
            <strong>3. Open in your browser:</strong><br>
            <code style="background: #f5f5f5; padding: 4px 8px; border-radius: 4px; font-family: monospace;">http://localhost:8000</code>
            <br><br>
            <div style="color:#b87a95; font-size: 13px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #f0e0e6;">
              💡 Once deployed to GitHub Pages, you can access it online.
            </div>
          </div>
        </div>
      `;
      this.container.appendChild(warn);
    }

    // After sections are in DOM
    this.updateYear();
    this.initScrollSpy();
    this.scrollToHashIfPresent();
    this.initLightbox();
  }

  initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    if (!lightbox || !lightboxImg) return;

    // Open lightbox
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('gallery-image')) {
        const img = e.target;
        lightboxImg.src = img.src;
        lightboxCaption.textContent = img.getAttribute('data-caption') || img.alt || '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      }
    });

    // Close lightbox
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      lightboxImg.src = '';
      lightboxCaption.textContent = '';
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  async loadSectionById(sectionId) {
    const sectionMap = {
      'main': 'sections/main.html',
      'research': 'sections/research.html',
      'projects': 'sections/projects.html',
      'awards': 'sections/awards.html',
      'gallery': 'sections/gallery.html'
    };

    const sectionPath = sectionMap[sectionId];
    if (!sectionPath) {
      console.error(`Unknown section ID: ${sectionId}`);
      return;
    }

    return await this.loadSection(sectionPath);
  }

  updateYear() {
    const y = document.getElementById('y');
    if (y) y.textContent = new Date().getFullYear();
  }

  initScrollSpy() {
    if (!('IntersectionObserver' in window)) return;
    const options = { root: null, rootMargin: '0px 0px -60% 0px', threshold: 0.3 };
    const mapHrefToId = (href) => href.split('#')[1];
    const linkById = new Map(this.navLinks.map((a) => [mapHrefToId(a.getAttribute('href')), a]));

    const onIntersect = (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        const link = linkById.get(id);
        if (!link) return;
        if (entry.isIntersecting) {
          this.navLinks.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
          link.setAttribute('aria-current', 'true');
        }
      });
    };

    const observer = new IntersectionObserver(onIntersect, options);
    document.querySelectorAll('.page-section[id]').forEach((sec) => observer.observe(sec));
  }

  scrollToHashIfPresent() {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
}

// Initialize loader when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const loader = new SectionLoader('sections-container');
    loader.loadAllSections();
  });
} else {
  const loader = new SectionLoader('sections-container');
  loader.loadAllSections();
}
