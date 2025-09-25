// Profile Page JS
const token = localStorage.getItem('token');
const headers = { 'Authorization': 'Bearer ' + token };
const profileContent = document.getElementById('profileContent');

async function loadProfile() {
  const res = await fetch('/api/profile', { headers });
  const data = await res.json();
  if (res.ok) {
    profileContent.innerHTML = `
      <div class="profile-row"><span class="profile-label">Name:</span> <span class="profile-value">${data.name}</span></div>
      <div class="profile-row"><span class="profile-label">Email:</span> <span class="profile-value">${data.email}</span></div>
      <div class="profile-row"><span class="profile-label">Phone:</span> <span class="profile-value">
        <form id="phoneForm" class="profile-phone-inline" style="display:inline-flex;align-items:center;gap:8px;">
          <input type="tel" id="phoneInput" name="phoneInput" value="${data.phone ? data.phone : ''}" placeholder="Enter phone" pattern="[0-9\-\+ ]{8,16}" style="width:140px;padding:6px 10px;border-radius:6px;border:1.5px solid #a5b4fc;font-size:1rem;" required />
          <button type="submit" class="profile-phone-save" style="padding:6px 16px;font-size:0.98rem;border-radius:6px;background:#6366f1;color:#fff;border:none;cursor:pointer;">Save</button>
        </form>
      </span></div>
      <div class="profile-row"><span class="profile-label">Role:</span> <span class="profile-value">${data.role}</span></div>
      <div class="profile-row"><span class="profile-label">Emergency Contacts:</span>
        <span class="profile-value profile-contacts">${(data.emergencyContacts||[]).length ? data.emergencyContacts.map(c=>`${c.name} (${c.phone})`).join('<br>') : 'None'}</span>
      </div>
    `;
    // Attach phone form handler
    document.getElementById('phoneForm').onsubmit = async function(e) {
      e.preventDefault();
      phoneMsg.innerText = 'Saving...';
      const phone = document.getElementById('phoneInput').value.trim();
      const res = await fetch('/api/profile/phone', {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const result = await res.json();
      if (res.ok) {
        phoneMsg.innerText = 'Phone number updated!';
        loadProfile();
      } else {
        phoneMsg.innerText = result.message || 'Error updating phone number';
      }
    };
  } else {
    profileContent.innerText = data.message || 'Error loading profile';
  }
}

loadProfile();