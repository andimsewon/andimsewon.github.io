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
      warn.style.marginTop = '20px';
      warn.innerHTML = `
        <div style="color:#9b7b86;">
          Sections failed to load. If you opened this file directly, please run a local server (e.g., <code>python -m http.server</code>) or check file paths.
        </div>
      `;
      this.container.appendChild(warn);
    }

    // After sections are in DOM
    this.updateYear();
    this.initScrollSpy();
    this.scrollToHashIfPresent();
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
