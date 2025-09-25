// Geo-Fencing Page JS
const token = localStorage.getItem('token');
const headers = { 'Authorization': 'Bearer ' + token };
const zonesUl = document.getElementById('zonesUl');
const zonesLoading = document.getElementById('zonesLoading');

async function loadZones() {
  try {
    const res = await fetch('/api/zones', { headers });
    const zones = await res.json();
    zonesLoading.style.display = 'none';
    if (Array.isArray(zones) && zones.length) {
      zonesUl.innerHTML = zones.map(z =>
        `<li><b>${z.name}</b> - <span style="color:${z.type==='danger' ? '#e11d48' : '#22c55e'}">${z.type.toUpperCase()}</span><br><small>${z.description || ''}</small></li>`
      ).join('');
    } else {
      zonesUl.innerHTML = '<li>No geo-fenced zones found.</li>';
    }
  } catch (err) {
    zonesLoading.innerText = 'Failed to load zones.';
  }
}

loadZones();