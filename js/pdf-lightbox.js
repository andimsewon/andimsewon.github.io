(function () {
  try {
    var pdfLightbox = document.getElementById('pdfLightbox');
    var pdfLightboxIframe = document.getElementById('pdfLightboxIframe');
    var pdfLightboxClose = document.getElementById('pdfLightboxClose');
    var presentationThumbnail = document.getElementById('presentationThumbnail');
    var paperThumbnail = document.getElementById('paperThumbnail');

    function openPdfLightbox(pdfPath) {
      if (!pdfLightbox || !pdfLightboxIframe) return;
      pdfLightboxIframe.src = pdfPath;
      pdfLightbox.classList.add('active');
      try { document.body.style.overflow = 'hidden'; } catch (_) {}
      if (pdfLightboxClose && typeof pdfLightboxClose.focus === 'function') {
        try { pdfLightboxClose.focus(); } catch (_) {}
      }
    }
    function closePdfLightbox() {
      if (!pdfLightbox || !pdfLightboxIframe) return;
      pdfLightbox.classList.remove('active');
      try { document.body.style.overflow = ''; } catch (_) {}
      pdfLightboxIframe.src = '';
    }

    function bind(el) {
      if (!el) return;
      el.addEventListener('click', function () {
        var pdfPath = el.getAttribute('data-pdf');
        openPdfLightbox(pdfPath);
      });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var pdfPath = el.getAttribute('data-pdf');
          openPdfLightbox(pdfPath);
        }
      });
    }

    bind(presentationThumbnail);
    bind(paperThumbnail);

    if (pdfLightboxClose) pdfLightboxClose.addEventListener('click', closePdfLightbox);
    if (pdfLightbox) pdfLightbox.addEventListener('click', function (e) { if (e.target === pdfLightbox) closePdfLightbox(); });
    document.addEventListener('keydown', function (e) { if ((e.key === 'Escape' || e.key === 'Esc') && pdfLightbox && pdfLightbox.classList.contains('active')) closePdfLightbox(); });
  } catch (e) {}
})();

