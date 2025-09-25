document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('token', data.token);
    if (data.role === 'admin') {
      window.location.href = '../admin/admin.html';
    } else {
      window.location.href = '../tourist/tourist.html';
    }
  } else {
    document.getElementById('loginError').innerText = data.message || 'Login failed';
  }
});
