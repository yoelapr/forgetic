/* ============================================================
   FORGETIC — AUTH LOGIC
   auth.js — Login, Register, localStorage session management
   ============================================================ */

'use strict';

/* ─── Toast Helper ───────────────────────────────────────── */
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = {
    success: '✓',
    error: '✗',
    info: 'ℹ'
  };
  toast.innerHTML = `<span style="font-weight:700; font-size:1rem;">${icons[type] || icons.info}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ─── Password Toggle ────────────────────────────────────── */
function setupPasswordToggle(toggleId, inputId) {
  const btn = document.getElementById(toggleId);
  const input = document.getElementById(inputId);
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.innerHTML = isPassword
      ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="16" height="16">
           <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
         </svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="16" height="16">
           <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
           <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
         </svg>`;
  });
}

/* ─── Password Strength ──────────────────────────────────── */
function getPasswordStrength(pw) {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

function updateStrengthUI(pw) {
  const fill  = document.getElementById('strength-fill');
  const label = document.getElementById('strength-label');
  if (!fill || !label) return;
  const score = getPasswordStrength(pw);
  const levels = [
    { pct: '0%',   color: '',        text: 'Enter a password' },
    { pct: '20%',  color: '#EF4444', text: 'Very weak' },
    { pct: '40%',  color: '#F97316', text: 'Weak' },
    { pct: '60%',  color: '#F59E0B', text: 'Fair' },
    { pct: '80%',  color: '#22C55E', text: 'Strong' },
    { pct: '100%', color: '#6B21A8', text: '🔒 Very strong' },
  ];
  const level = pw.length === 0 ? levels[0] : levels[Math.min(score, 5)];
  fill.style.width = level.pct;
  fill.style.background = level.color;
  label.textContent = level.text;
  label.style.color = level.color || 'var(--text-muted)';
}

/* ─── Validation Helpers ─────────────────────────────────── */
function showError(id, show = true) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('visible', show);
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPhone(phone) {
  return /^[\+]?[\d\s\-\(\)]{7,15}$/.test(phone.trim());
}

/* ─── Session ────────────────────────────────────────────── */
function getUsers() {
  return JSON.parse(localStorage.getItem('fg_users') || '[]');
}
function saveUsers(users) {
  localStorage.setItem('fg_users', JSON.stringify(users));
}
function setSession(user) {
  localStorage.setItem('fg_session', JSON.stringify({ name: user.name, email: user.email, phone: user.phone }));
}
function getSession() {
  return JSON.parse(localStorage.getItem('fg_session') || 'null');
}
function clearSession() {
  localStorage.removeItem('fg_session');
}

/* ─── Login Page ─────────────────────────────────────────── */
function initLoginPage() {
  // Guard: if already logged in, redirect
  if (getSession()) {
    window.location.href = 'dashboard.html';
    return;
  }

  setupPasswordToggle('toggle-login-pw', 'login-password');

  const form = document.getElementById('login-form');
  const btn  = document.getElementById('login-btn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    let hasError = false;
    if (!isValidEmail(email)) { showError('email-error', true); hasError = true; }
    else                       { showError('email-error', false); }
    if (!password)             { showError('password-error', true); hasError = true; }
    else                       { showError('password-error', false); }
    if (hasError) return;

    // Loading state
    btn.classList.add('loading');
    btn.disabled = true;

    await new Promise(r => setTimeout(r, 900)); // simulate network

    const users = getUsers();
    const user  = users.find(u => u.email === email && u.password === btoa(password));

    if (user) {
      setSession(user);
      showToast('Welcome back! Redirecting…', 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
    } else {
      document.getElementById('login-general-error').style.display = 'block';
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  });

  // Hide general error on input
  ['login-email', 'login-password'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => {
      document.getElementById('login-general-error').style.display = 'none';
    });
  });
}

/* ─── Register Page ──────────────────────────────────────── */
function initRegisterPage() {
  if (getSession()) {
    window.location.href = 'dashboard.html';
    return;
  }

  setupPasswordToggle('toggle-reg-pw', 'reg-password');
  setupPasswordToggle('toggle-reg-confirm-pw', 'reg-confirm-pw');

  // Live password strength
  document.getElementById('reg-password')?.addEventListener('input', (e) => {
    updateStrengthUI(e.target.value);
  });

  const form = document.getElementById('register-form');
  const btn  = document.getElementById('register-btn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name      = document.getElementById('reg-name').value.trim();
    const email     = document.getElementById('reg-email').value.trim();
    const phone     = document.getElementById('reg-phone').value.trim();
    const password  = document.getElementById('reg-password').value;
    const confirm   = document.getElementById('reg-confirm-pw').value;

    let hasError = false;
    if (!name)                 { showError('name-error', true); hasError = true; }
    else                       { showError('name-error', false); }
    if (!isValidEmail(email))  { showError('reg-email-error', true); hasError = true; }
    else                       { showError('reg-email-error', false); }
    if (!isValidPhone(phone))  { showError('phone-error', true); hasError = true; }
    else                       { showError('phone-error', false); }
    if (password.length < 8)   { showError('reg-pw-error', true); hasError = true; }
    else                       { showError('reg-pw-error', false); }
    if (password !== confirm)  { showError('confirm-pw-error', true); hasError = true; }
    else                       { showError('confirm-pw-error', false); }
    if (hasError) return;

    // Check if email already exists
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      const errEl = document.getElementById('register-general-error');
      errEl.style.display = 'block';
      errEl.textContent = 'An account with this email already exists.';
      return;
    }

    // Loading state
    btn.classList.add('loading');
    btn.disabled = true;
    await new Promise(r => setTimeout(r, 900));

    const newUser = { name, email, phone, password: btoa(password) };
    users.push(newUser);
    saveUsers(users);

    showToast('Account created! Please sign in.', 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
  });
}

/* ─── Router ─────────────────────────────────────────────── */
(function() {
  const path = window.location.pathname;
  if (path.includes('register')) {
    initRegisterPage();
  } else if (path.includes('index') || path.endsWith('/') || path.endsWith('.html') && !path.includes('dashboard')) {
    initLoginPage();
  }
  // If neither, this script is likely included by mistake
})();
