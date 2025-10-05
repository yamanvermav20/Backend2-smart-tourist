// Enhanced Registration Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const registerForm = document.getElementById('registerForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const roleSelect = document.getElementById('role');
  const passwordToggle = document.getElementById('passwordToggle');
  const registerBtn = document.getElementById('registerBtn');
  const btnText = registerBtn.querySelector('.btn-text');
  const btnLoader = registerBtn.querySelector('.btn-loader');
  const errorElement = document.getElementById('registerError');
  const successElement = document.getElementById('registerSuccess');
  const passwordStrength = document.getElementById('passwordStrength');
  const strengthFill = passwordStrength.querySelector('.strength-fill');
  const strengthText = passwordStrength.querySelector('.strength-text');
  const agreeTermsCheckbox = document.getElementById('agreeTerms');

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
  function validateName(name) {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function calculatePasswordStrength(password) {
    let strength = 0;
    let feedback = '';
    
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    switch (strength) {
      case 0:
      case 1:
        return { level: 'weak', text: 'Weak password' };
      case 2:
        return { level: 'fair', text: 'Fair password' };
      case 3:
      case 4:
        return { level: 'good', text: 'Good password' };
      case 5:
        return { level: 'strong', text: 'Strong password' };
      default:
        return { level: 'weak', text: 'Weak password' };
    }
  }

  function updatePasswordStrength(password) {
    if (password.length === 0) {
      passwordStrength.classList.remove('active');
      return;
    }
    
    passwordStrength.classList.add('active');
    const strength = calculatePasswordStrength(password);
    
    strengthFill.className = `strength-fill ${strength.level}`;
    strengthText.textContent = strength.text;
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
      registerBtn.classList.add('loading');
      registerBtn.disabled = true;
      btnText.style.display = 'none';
      btnLoader.style.display = 'block';
    } else {
      registerBtn.classList.remove('loading');
      registerBtn.disabled = false;
      btnText.style.display = 'block';
      btnLoader.style.display = 'none';
    }
  }

  function setFieldError(field, hasError) {
    if (hasError) {
      field.style.borderColor = '#f56565';
      field.style.boxShadow = '0 0 0 4px rgba(245, 101, 101, 0.1)';
    } else {
      field.style.borderColor = '#e2e8f0';
      field.style.boxShadow = 'none';
    }
  }

  // Real-time validation feedback
  nameInput.addEventListener('blur', function() {
    const name = this.value.trim();
    if (name && !validateName(name)) {
      setFieldError(this, true);
    } else {
      setFieldError(this, false);
    }
  });

  nameInput.addEventListener('input', function() {
    if (this.style.borderColor === 'rgb(245, 101, 101)') {
      setFieldError(this, false);
    }
  });

  emailInput.addEventListener('blur', function() {
    const email = this.value.trim();
    if (email && !validateEmail(email)) {
      setFieldError(this, true);
    } else {
      setFieldError(this, false);
    }
  });

  emailInput.addEventListener('input', function() {
    if (this.style.borderColor === 'rgb(245, 101, 101)') {
      setFieldError(this, false);
    }
  });

  passwordInput.addEventListener('input', function() {
    updatePasswordStrength(this.value);
    if (this.style.borderColor === 'rgb(245, 101, 101)') {
      setFieldError(this, false);
    }
  });

  passwordInput.addEventListener('blur', function() {
    const password = this.value;
    if (password && password.length < 6) {
      setFieldError(this, true);
    } else {
      setFieldError(this, false);
    }
  });

  // Form submission
  registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Clear previous messages
    errorElement.style.display = 'none';
    successElement.style.display = 'none';
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const role = roleSelect.value;
    
    // Client-side validation
    if (!name) {
      showError('Please enter your full name');
      nameInput.focus();
      return;
    }
    
    if (!validateName(name)) {
      showError('Please enter a valid name (letters and spaces only, minimum 2 characters)');
      nameInput.focus();
      return;
    }
    
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
      showError('Please create a password');
      passwordInput.focus();
      return;
    }
    
    if (password.length < 6) {
      showError('Password must be at least 6 characters long');
      passwordInput.focus();
      return;
    }
    
    if (!role) {
      showError('Please select your account type');
      roleSelect.focus();
      return;
    }
    
    if (!agreeTermsCheckbox.checked) {
      showError('Please agree to the Terms of Service and Privacy Policy');
      agreeTermsCheckbox.focus();
      return;
    }
    
    // Set loading state
    setLoadingState(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showSuccess('Registration successful! Redirecting to login...');
        
        // Small delay to show success message
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
      } else {
        showError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showError('Network error. Please check your connection and try again.');
    } finally {
      setLoadingState(false);
    }
  });

  // Social registration handlers (placeholder functionality)
  document.querySelector('.google-btn').addEventListener('click', function() {
    showError('Google registration is not yet implemented');
  });

  document.querySelector('.microsoft-btn').addEventListener('click', function() {
    showError('Microsoft registration is not yet implemented');
  });

  // Auto-focus name field
  nameInput.focus();
});
