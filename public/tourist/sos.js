const token = localStorage.getItem('token');
const headers = { 'Authorization': 'Bearer ' + token };
const sosForm = document.getElementById('sosForm');
const sosResult = document.getElementById('sosResult');

sosForm.onsubmit = async function(e) {
  e.preventDefault();
  const latitude = Number(document.getElementById('sosLat').value);
  const longitude = Number(document.getElementById('sosLng').value);
  const message = document.getElementById('sosMsg').value;
  const body = { latitude, longitude, message };
  const res = await fetch('/api/incidents/sos', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  sosResult.innerText = data.message || (res.ok ? 'SOS sent!' : 'Error sending SOS');
  sosResult.style.color = res.ok ? '#22c55e' : '#e11d48';
};