// Tourist Dashboard JS
const token = localStorage.getItem('token');
const headers = { 'Authorization': 'Bearer ' + token };

// Navbar scroll to Profile and SOS cards
document.getElementById('navProfile')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('profileCard')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
document.getElementById('navSOS')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('sosCard')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Fetch and display user's SOS incident count
fetch('/api/incidents/sos/count', { headers })
  .then(res => res.json())
  .then(data => {
    if (data && typeof data.count === 'number') {
      document.getElementById('statIncidents').textContent = data.count;
    }
  })
  .catch(() => {
    document.getElementById('statIncidents').textContent = '-';
  });

// SOS Emergency: redirect to dedicated page
document.getElementById('sosBtn').onclick = () => {
  window.location.href = 'sos.html';
};

document.getElementById('profileBtn').onclick = () => {
  window.location.href = 'profile.html';
};

document.getElementById('geoFenceBtn').onclick = () => {
  window.location.href = 'geo.html';
};
