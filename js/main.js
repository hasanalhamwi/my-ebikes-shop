// Show current year in the footer
document.getElementById('year').textContent = new Date().getFullYear();

// Load bikes data and render the catalog grid
fetch('data/bikes.json')
  .then(res => res.json())
  .then(renderBikes)
  .catch(() => {
    document.getElementById('bike-grid').innerHTML =
      '<p class="empty-state">De fietsgegevens konden niet worden geladen.</p>';
  });

function renderBikes(bikes) {
  const grid = document.getElementById('bike-grid');

  if (!bikes.length) {
    grid.innerHTML = '<p class="empty-state">Er zijn momenteel geen fietsen te koop.</p>';
    return;
  }

  grid.innerHTML = bikes.map(bike => `
    <a class="bike-card" href="bike.html?id=${encodeURIComponent(bike.id)}">
      <div class="thumb">
        <img src="${bike.cover}" alt="${bike.name}" loading="lazy"
             onerror="this.style.display='none'">
      </div>
      <div class="info">
        <div class="status">${bike.status}</div>
        <h3>${bike.name}</h3>
        <p class="tagline">${bike.tagline}</p>
        <div class="price">${priceHtml(bike)}</div>
        <span class="btn btn-primary">Bekijk details</span>
      </div>
    </a>
  `).join('');
}

// Price markup: when a bike has "oldPrice", show it struck through next to the new price
function priceHtml(bike) {
  if (!bike.oldPrice) return bike.price;
  return `<s style="color:var(--color-text-muted); font-size:0.75em; margin-right:10px;">${bike.oldPrice}</s>${bike.price}`;
}
