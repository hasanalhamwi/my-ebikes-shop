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
    document.title = bike.name + ' — e-bikes.gereviseerd';
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

  // Pre-fill a Dutch WhatsApp message with the bike name
  const waMessage = encodeURIComponent(`Hallo, ik ben geinteresseerd in de "${bike.name}" die op jullie website staat.`);
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
          <h4>Technische specificaties</h4>
          ${specsRows}
        </div>

        <div class="spec-tag">
          <h4>Staat van de onderdelen — nieuw / gebruikt</h4>
          <ul class="condition-list">${conditionRows}</ul>
        </div>

        <div class="warranty-note"><strong>Garantie:</strong> ${bike.warranty}</div>

        <div class="cta-row">
          <a class="btn btn-whatsapp" href="${waLink}" target="_blank" rel="noopener">Contact via WhatsApp</a>
        </div>
      </div>
    </div>
  `;
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
}
