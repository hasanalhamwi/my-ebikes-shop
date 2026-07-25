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
        <div class="main-image">
          <img id="main-img" src="${bike.cover}" alt="${bike.name}" onerror="this.style.display='none'">
        </div>
        <div class="thumb-row" id="thumb-row"></div>
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
  const row = document.getElementById('thumb-row');
  const mainImg = document.getElementById('main-img');
  const images = [bike.cover, ...(bike.gallery || [])];

  row.innerHTML = images.map(src => `<img src="${src}" onerror="this.style.display='none'">`).join('');

  row.querySelectorAll('img').forEach(img => {
    img.addEventListener('click', () => { mainImg.src = img.src; });
  });
}
