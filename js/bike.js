// Show current year in the footer
document.getElementById('year').textContent = new Date().getFullYear();

// Read the bike id from the URL, e.g. bike.html?id=villette-hollande
const params = new URLSearchParams(window.location.search);
const bikeId = params.get('id');

fetch('data/bikes.json')
  .then(res => res.json())
  .then(bikes => {
    const bike = bikes.find(b => b.id === bikeId);
    const container = document.getElementById('bike-content');
    if (!bike) {
      container.innerHTML = '<p class="empty-state">Deze fiets kon niet worden gevonden.</p>';
      return;
    }
    document.title = bike.name + ' — E-Bikes-Enno';
    container.innerHTML = renderBike(bike);
    setupGallery(bike);
  })
  .catch(() => {
    document.getElementById('bike-content').innerHTML =
      '<p class="empty-state">De fietsgegevens konden niet worden geladen.</p>';
  });

function renderBike(bike) {
  const specsRows = Object.entries(bike.specs).map(([label, value]) => `
    <div class="spec-row"><span class="label">${label}</span><span class="value">${value}</span></div>
  `).join('');

  const conditionRows = bike.condition.map(c => `
    <li><span class="label">${c.item}</span><span class="value">${c.state}</span></li>
  `).join('');

  // Build a WhatsApp message that already contains the bike's key info,
  // so the seller gets full context immediately; the customer just adds their question below it.
  const waMessage = buildWhatsAppMessage(bike);
  const waLink = `https://wa.me/${bike.whatsapp}?text=${waMessage}`;

  return `
    <div class="detail-grid">
      <div class="detail-gallery">
        <div class="slider" id="bike-slider"></div>
      </div>

      <div class="detail-info">
        <h1>${bike.name}</h1>
        <p class="tagline">${bike.tagline}</p>
        <div class="price">${bike.price}</div>

        <div class="spec-tag">
          <h4>${bike.specsTitle || 'Technische specificaties'}</h4>
          ${specsRows}
        </div>

        <div class="spec-tag">
          <h4>${bike.conditionTitle || 'Elektrische onderdelen &amp; garantie'}</h4>
          <div class="condition-header">
            <span>${bike.conditionCol1 || 'Elektrisch onderdeel'}</span>
            <span>${bike.conditionCol2 || 'Garantie'}</span>
          </div>
          <ul class="condition-list">${conditionRows}</ul>
        </div>

        <div class="cta-row">
          <a class="btn btn-whatsapp" href="${waLink}" target="_blank" rel="noopener">Contact via WhatsApp</a>
        </div>
      </div>
    </div>
  `;
}

function buildWhatsAppMessage(bike) {
  const s = bike.specs || {};

  // Collect which spec fields are marked as "Nieuw" (new), for a short highlight line
  const nieuweOnderdelen = Object.entries(s)
    .filter(([, value]) => /nieuw/i.test(value))
    .map(([key]) => key);

  const pageUrl = window.location.href;

  const lines = [
    `Hallo, ik ben geinteresseerd in de "${bike.name}" (${bike.price}).`,
    `Bekijk hier alle informatie over deze fiets: ${pageUrl}`,
  ];

  if (nieuweOnderdelen.length) {
    lines.push(`Nieuw aan deze fiets: ${nieuweOnderdelen.join(', ')}`);
  }

  lines.push('', 'Mijn vraag: ');

  return encodeURIComponent(lines.join('\n'));
}

function setupGallery(bike) {
  const slider = document.getElementById('bike-slider');
  const images = [bike.cover, ...(bike.gallery || [])];
  let current = 0;

  // Build the slide track
  const track = document.createElement('div');
  track.className = 'slider-track';
  track.innerHTML = images.map(src => `
    <div class="slider-slide"><img src="${src}" alt="${bike.name}" onerror="this.closest('.slider-slide').style.background='var(--color-bg-elevated)'"></div>
  `).join('');
  slider.appendChild(track);

  // Clicking any slide image opens the fullscreen lightbox
  track.querySelectorAll('img').forEach((img, i) => {
    img.addEventListener('click', () => openLightbox(i));
  });

  // Only add arrows and dots when there is more than one image
  if (images.length > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'slider-btn prev';
    prevBtn.setAttribute('aria-label', 'Vorige foto');
    prevBtn.textContent = '\u2039';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'slider-btn next';
    nextBtn.setAttribute('aria-label', 'Volgende foto');
    nextBtn.textContent = '\u203A';

    const dots = document.createElement('div');
    dots.className = 'slider-dots';
    dots.innerHTML = images.map((_, i) => `<button class="dot${i === 0 ? ' active' : ''}" aria-label="Foto ${i + 1}"></button>`).join('');

    slider.append(prevBtn, nextBtn, dots);

    const dotEls = dots.querySelectorAll('.dot');

    function goTo(index) {
      current = (index + images.length) % images.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotEls.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));
    dotEls.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    // Basic swipe support for mobile
    let startX = 0;
    slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current - 1 : current + 1);
    }, { passive: true });
  }

  // ---- Fullscreen lightbox (enlarge photo on click) ----
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  let lightboxIndex = 0;
  const hasMultiple = images.length > 1;

  lightboxPrev.style.display = hasMultiple ? '' : 'none';
  lightboxNext.style.display = hasMultiple ? '' : 'none';

  function openLightbox(index) {
    lightboxIndex = index;
    lightboxImg.src = images[lightboxIndex];
    lightboxImg.alt = bike.name;
    lightbox.hidden = false;
  }

  function closeLightbox() { lightbox.hidden = true; }

  function showLightbox(index) {
    lightboxIndex = (index + images.length) % images.length;
    lightboxImg.src = images[lightboxIndex];
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showLightbox(lightboxIndex - 1));
  lightboxNext.addEventListener('click', () => showLightbox(lightboxIndex + 1));

  // Close when clicking the dark background, but not the image itself
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard support: Escape closes, arrow keys navigate
  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightbox(lightboxIndex - 1);
    if (e.key === 'ArrowRight') showLightbox(lightboxIndex + 1);
  });

  // Swipe support inside the lightbox on mobile
  let lightboxStartX = 0;
  lightbox.addEventListener('touchstart', e => { lightboxStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - lightboxStartX;
    if (Math.abs(diff) > 40) showLightbox(diff > 0 ? lightboxIndex - 1 : lightboxIndex + 1);
  }, { passive: true });
}
