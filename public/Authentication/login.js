// Enhanced Login Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const passwordToggle = document.getElementById('passwordToggle');
  const loginBtn = document.getElementById('loginBtn');
  const btnText = loginBtn.querySelector('.btn-text');
  const btnLoader = loginBtn.querySelector('.btn-loader');
  const errorElement = document.getElementById('loginError');
  const successElement = document.getElementById('loginSuccess');

  // Password visibility toggle
  passwordToggle.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    const icon = this.querySelector('i');
    if (type === 'text') {
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
      this.setAttribute('title', 'Hide password');
    } else {
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
      this.setAttribute('title', 'Show password');
    }
  });

  // Enhanced form validation
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validatePassword(password) {
    return password.length >= 6;
  }

  function showError(message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    successElement.style.display = 'none';
    
    // Auto-hide error after 5 seconds
    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 5000);
  }

  function showSuccess(message) {
    successElement.textContent = message;
    successElement.style.display = 'block';
    errorElement.style.display = 'none';
  }

  function setLoadingState(isLoading) {
    if (isLoading) {
      loginBtn.classList.add('loading');
      loginBtn.disabled = true;
      btnText.style.display = 'none';
      btnLoader.style.display = 'block';
    } else {
      loginBtn.classList.remove('loading');
      loginBtn.disabled = false;
      btnText.style.display = 'block';
      btnLoader.style.display = 'none';
    }
  }

  // Real-time validation feedback
  emailInput.addEventListener('blur', function() {
    const email = this.value.trim();
    if (email && !validateEmail(email)) {
      this.style.borderColor = '#f56565';
      this.style.boxShadow = '0 0 0 4px rgba(245, 101, 101, 0.1)';
    } else {
      this.style.borderColor = '#e2e8f0';
      this.style.boxShadow = 'none';
    }
  });

  emailInput.addEventListener('input', function() {
    if (this.style.borderColor === 'rgb(245, 101, 101)') {
      this.style.borderColor = '#e2e8f0';
      this.style.boxShadow = 'none';
    }
  });

  passwordInput.addEventListener('blur', function() {
    const password = this.value;
    if (password && !validatePassword(password)) {
      this.style.borderColor = '#f56565';
      this.style.boxShadow = '0 0 0 4px rgba(245, 101, 101, 0.1)';
    } else {
      this.style.borderColor = '#e2e8f0';
      this.style.boxShadow = 'none';
    }
  });

  passwordInput.addEventListener('input', function() {
    if (this.style.borderColor === 'rgb(245, 101, 101)') {
      this.style.borderColor = '#e2e8f0';
      this.style.boxShadow = 'none';
    }
  });

  // Form submission
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Clear previous messages
    errorElement.style.display = 'none';
    successElement.style.display = 'none';
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Client-side validation
    if (!email) {
      showError('Please enter your email address');
      emailInput.focus();
      return;
    }
    
    if (!validateEmail(email)) {
      showError('Please enter a valid email address');
      emailInput.focus();
      return;
    }
    
    if (!password) {
      showError('Please enter your password');
      passwordInput.focus();
      return;
    }
    
    if (!validatePassword(password)) {
      showError('Password must be at least 6 characters long');
      passwordInput.focus();
      return;
    }
    
    // Set loading state
    setLoadingState(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showSuccess('Login successful! Redirecting...');
        localStorage.setItem('token', data.token);
        
        // Small delay to show success message
        setTimeout(() => {
          if (data.role === 'admin') {
            window.location.href = '../admin/admin.html';
          } else {
            window.location.href = '../tourist/tourist.html';
          }
        }, 1000);
      } else {
        showError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      showError('Network error. Please check your connection and try again.');
    } finally {
      setLoadingState(false);
    }
  });

  // Social login handlers (placeholder functionality)
  document.querySelector('.google-btn').addEventListener('click', function() {
    showError('Google login is not yet implemented');
  });

  document.querySelector('.microsoft-btn').addEventListener('click', function() {
    showError('Microsoft login is not yet implemented');
  });

  // Auto-focus email field
  emailInput.focus();
});
