// Show All Geo-Fenced Areas
const allGeoBtn = document.getElementById('allGeoBtn');
const geoList = document.getElementById('geoList');
const sosReportsBtn = document.getElementById('sosReportsBtn');
const incidentList = document.getElementById('incidentList');
const countSOS = document.getElementById('countSOS');

async function fetchSOSCount() {
  const token = localStorage.getItem('token');
  if (!token) return;
  try {
    const res = await fetch('/api/incidents/sos/count', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    countSOS.textContent = data.count || 0;
  } catch (err) {
    console.error(err);
    countSOS.textContent = '-';
  }
}

// Initial count update
fetchSOSCount();

// SOS Reports button click
// SOS Reports button click
sosReportsBtn.addEventListener('click', async () => {
  geoList.style.display = 'none'; // Hide geo-fenced areas
  incidentList.style.display = 'block'; // Show SOS/incident list
  const token = localStorage.getItem('token');
  if (!token) return alert('You are not logged in');

  try {
    const res = await fetch('/api/incidents/sos/all', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();

    // Clear previous incidents
    incidentList.innerHTML = '';

    if (!data.length) {
      incidentList.innerHTML = '<p>No SOS emergencies found.</p>';
      return;
    }

    // Render each SOS emergency
    data.forEach(i => {
      incidentList.innerHTML += `
        <div class="incident-card">
          <p><strong>ID:</strong> ${i._id}</p>
          <p><strong>User:</strong> ${i.userName || '-'} (${i.userPhone || '-'})</p>
          <p><strong>Zone ID:</strong> ${i.zoneId || '-'}</p>
          <p><strong>Latitude:</strong> ${i.latitude || '-'}</p>
          <p><strong>Longitude:</strong> ${i.longitude || '-'}</p>
          <p><strong>Priority:</strong> ${i.priority}</p>
          <p><strong>Status:</strong> ${i.status}</p>
          <p><strong>Message:</strong> ${i.message || '-'}</p>
          <p><strong>Created At:</strong> ${new Date(i.createdAt).toLocaleString()}</p>
        </div>
        <hr>
      `;
    });

    // Update count after fetching
    countSOS.textContent = data.length;

  } catch (err) {
    console.error(err);
    incidentList.innerHTML = '<p>Error fetching SOS reports.</p>';
  }
});

allGeoBtn.onclick = async () => {
  incidentList.style.display = 'none'; // Hide SOS/incident list
  geoList.style.display = 'block'; // Show geo-fenced areas
  geoList.innerText = 'Loading...';
  try {
    const res = await fetch('/api/zones', { headers });
    const data = await res.json();
    if (res.ok && Array.isArray(data) && data.length) {
      geoList.innerHTML = data.map(z => `
        <div class="incident">
          <b>Name:</b> ${z.name}<br>
          <b>Type:</b> ${z.type}<br>
          <b>Description:</b> ${z.description || ''}<br>
          <b>Coordinates:</b> ${z.coordinates?.map(c => c.join(',')).join(' | ')}
        </div>
      `).join('');
    } else {
      geoList.innerHTML = '<p>No geo-fenced areas found.</p>';
    }
  } catch (err) {
    geoList.innerHTML = '<p>Error loading geo-fenced areas.</p>';
  }
};
// Admin Dashboard JS
const token = localStorage.getItem('token');
const headers = { 'Authorization': 'Bearer ' + token };

function renderIncidents(incidents) {
  const list = document.getElementById('incidentList');
  if (!incidents.length) return list.innerHTML = '<p>No incidents found.</p>';
  list.innerHTML = incidents.map(inc => `
    <div class="incident">
      <b>Zone:</b> ${inc.zoneId?.name || inc.zoneId}<br>
      <b>User:</b> ${inc.userId?.name || inc.userId}<br>
      <b>Priority:</b> ${inc.priority}<br>
      <b>Status:</b> ${inc.status}
      <br><b>Message:</b> ${inc.message || ''}
      <br><button onclick="updateStatus('${inc._id}', '${inc.status === 'pending' ? 'resolved' : 'pending'}')">Mark as ${inc.status === 'pending' ? 'Resolved' : 'Pending'}</button>
    </div>
  `).join('');
}

async function fetchIncidents(filter = '') {
  const res = await fetch(`/api/incidents${filter}`, { headers });
  const data = await res.json();
  if (res.ok) renderIncidents(data);
  else document.getElementById('incidentList').innerText = data.message || 'Error fetching incidents';
}

async function updateStatus(id, status) {
  const res = await fetch(`/api/incidents/${id}/status`, {
    method: 'PATCH',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (res.ok) fetchIncidents();
}

document.getElementById('allIncidentsBtn').onclick = () => fetchIncidents();
document.getElementById('sosReportsBtn').onclick = () => fetchIncidents('?priority=HIGH');
document.getElementById('pendingBtn').onclick = () => fetchIncidents('?status=pending');
document.getElementById('resolvedBtn').onclick = () => fetchIncidents('?status=resolved');


// --- Add Geo-Fenced Area Modal Logic ---
const geoModal = document.getElementById('geoModal');
const addGeoBtn = document.getElementById('addGeoBtn');
const closeGeoModal = document.getElementById('closeGeoModal');
const geoForm = document.getElementById('geoForm');
const geoMsg = document.getElementById('geoMsg');

addGeoBtn.onclick = () => {
  geoModal.style.display = 'block';
  geoMsg.innerText = '';
  geoForm.reset();
};
closeGeoModal.onclick = () => geoModal.style.display = 'none';
window.onclick = e => { if (e.target === geoModal) geoModal.style.display = 'none'; };

geoForm.onsubmit = async e => {
  e.preventDefault();
  geoMsg.innerText = 'Adding...';
  const name = geoForm.geoName.value.trim();
  const description = geoForm.geoDesc.value.trim();
  const type = geoForm.geoType.value;
  const coordsRaw = geoForm.geoCoords.value.trim();
  // Parse coordinates: "lat,lng;lat,lng"
  const coordinates = coordsRaw.split(';').map(pair => {
    const [lat, lng] = pair.split(',').map(Number);
    return [lat, lng];
  });
  try {
    const res = await fetch('/api/zones', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, coordinates, type })
    });
    const data = await res.json();
    if (res.ok) {
      geoMsg.innerText = 'Geo-fenced area added! ID: ' + data._id;
      setTimeout(() => { geoModal.style.display = 'none'; }, 1200);
    } else {
      geoMsg.innerText = data.message || 'Error adding area.';
    }
  } catch (err) {
    geoMsg.innerText = 'Error adding area.';
  }
};

// Auto-load all incidents on page load
fetchIncidents();

