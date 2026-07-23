// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------------------------------------------------------
   Top readout ticker: builds enough repeats of the sequence
   to comfortably cover any screen width, then duplicates the
   whole thing once so the -50% scroll animation loops with
   no gap, regardless of viewport size.
--------------------------------------------------------- */
(function () {
  const track = document.getElementById('readout-track');
  if (!track) return;
  const words = ['DESIGN', 'MANUFACTURE', 'INSTALL'];
  const REPEATS = 24; // comfortably covers ultrawide screens

  let itemsHTML = '';
  for (let i = 0; i < REPEATS; i++) {
    words.forEach((word) => {
      itemsHTML += `<span>${word}</span><span class="dot"></span>`;
    });
  }
  track.innerHTML = itemsHTML + itemsHTML; // doubled for seamless loop
})();

/* ---------------------------------------------------------
   Portfolio: looks for images/portfolio/1.jpg ... 20.jpg
   (also tries .jpeg / .png / .webp for each number)
   First 10 found -> grid. Remaining -> horizontal carousel.
   If none found -> empty state stays visible (default).
--------------------------------------------------------- */
(function () {
  const MAX_IMAGES = 20;
  const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
  const FOLDER = 'images/portfolio/';

  function findImage(number) {
    return new Promise((resolve) => {
      let i = 0;
      function tryNext() {
        if (i >= EXTENSIONS.length) return resolve(null);
        const ext = EXTENSIONS[i++];
        const src = `${FOLDER}${number}.${ext}`;
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = tryNext;
        img.src = src;
      }
      tryNext();
    });
  }

  async function buildPortfolio() {
    const checks = [];
    for (let n = 1; n <= MAX_IMAGES; n++) checks.push(findImage(n));
    const results = (await Promise.all(checks)).filter(Boolean);

    const grid = document.getElementById('portfolio-grid');
    const carouselWrap = document.getElementById('portfolio-carousel-wrap');
    const carousel = document.getElementById('portfolio-carousel');
    const empty = document.getElementById('portfolio-empty');

    if (results.length === 0) {
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    const gridImages = results.slice(0, 10);
    const carouselImages = results.slice(10, 20);

    gridImages.forEach((src, idx) => {
      const a = document.createElement('a');
      a.href = src;
      a.target = '_blank';
      a.rel = 'noopener';
      a.setAttribute('aria-label', `Open portfolio image ${idx + 1}`);
      const img = document.createElement('img');
      img.src = src;
      img.loading = 'lazy';
      img.alt = `Vital Signs Midlands project ${idx + 1}`;
      a.appendChild(img);
      grid.appendChild(a);
    });
    grid.hidden = false;

    if (carouselImages.length) {
      carouselImages.forEach((src, idx) => {
        const a = document.createElement('a');
        a.href = src;
        a.target = '_blank';
        a.rel = 'noopener';
        a.setAttribute('aria-label', `Open portfolio image ${idx + 11}`);
        const img = document.createElement('img');
        img.src = src;
        img.loading = 'lazy';
        img.alt = `Vital Signs Midlands project ${idx + 11}`;
        a.appendChild(img);
        carousel.appendChild(a);
      });
      carouselWrap.hidden = false;
    }
  }

  buildPortfolio();
})();
