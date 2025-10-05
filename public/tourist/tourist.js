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

// Fixed hero to TouristImage and base theme
(function initTouristHeroTheme() {
  const hero = document.querySelector('.tourist-hero');
  if (!hero) return;
  hero.style.backgroundImage = `url('/images/TouristImage.jpg')`;
  const root = document.documentElement;
  root.style.setProperty('--primary', '#2563eb');
  root.style.setProperty('--secondary', '#22c55e');
  root.style.setProperty('--accent', '#a21caf');
  root.style.setProperty('--accent2', '#60a5fa');
})();

// Footer year
(() => {
  const y = document.getElementById('yearNow');
  if (y) y.textContent = new Date().getFullYear();
})();

// Footer quick links scroll
document.getElementById('footerProfile')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('profileCard')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
document.getElementById('footerSOS')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('sosCard')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
