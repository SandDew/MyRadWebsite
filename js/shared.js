const loadedImages = new Set();

fetch('Sources.json')
  .then(response => response.json())
  .then(SOURCES => {
    // Preload all images in SOURCES only if not already loaded
    Object.values(SOURCES).forEach(src => {
      if (
        typeof src === 'string' &&
        /\.(png|jpg|jpeg|gif|svg)$/i.test(src) &&
        !loadedImages.has(src)
      ) {
        const img = new Image();
        img.src = src;
        loadedImages.add(src);
      }
    });

    // Set sources for <img data-source="...">
    document.querySelectorAll('img[data-source]').forEach(img => {
      const key = img.getAttribute('data-source');
      if (SOURCES[key]) img.src = SOURCES[key];
    });

    // Set sources for background images
    document.querySelectorAll('[data-bg-source]').forEach(el => {
      const key = el.getAttribute('data-bg-source');
      if (SOURCES[key]) el.style.backgroundImage = `url('${SOURCES[key]}')`;
    });

    // Make SOURCES globally available and signal it's loaded
    window.SOURCES = SOURCES;
    document.dispatchEvent(new Event('sourcesLoaded'));
  });


