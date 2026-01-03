// Lightbox functionality for gallery pages
(function () {
  try {
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var lightboxClose = document.getElementById('lightboxClose');

    function openLightbox(src, caption) {
      if (!lightbox || !lightboxImg || !lightboxCaption) return;
      lightboxImg.src = src;
      lightboxCaption.textContent = caption || '';
      lightbox.classList.add('active');
      try { document.body.style.overflow = 'hidden'; } catch (_) {}
      if (lightboxClose && typeof lightboxClose.focus === 'function') {
        try { lightboxClose.focus(); } catch (_) {}
      }
    }

    function closeLightbox() {
      if (!lightbox || !lightboxImg || !lightboxCaption) return;
      lightbox.classList.remove('active');
      try { document.body.style.overflow = ''; } catch (_) {}
      lightboxImg.src = '';
      lightboxCaption.textContent = '';
    }

    var images = document.querySelectorAll('.gallery-image');
    for (var i = 0; i < images.length; i++) {
      images[i].addEventListener('click', function () {
        var caption = this.getAttribute('data-caption') || this.alt || '';
        openLightbox(this.src, caption);
      });
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', function (e) { if ((e.key === 'Escape' || e.key === 'Esc') && lightbox && lightbox.classList.contains('active')) closeLightbox(); });
  } catch (e) {}
})();

