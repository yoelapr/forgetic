/* ============================================================
   FORGETIC — DASHBOARD ROUTER & CONTROLLER
   dashboard.js — Auth guard, URL analysis, nav routing, UI ctrl
   ============================================================ */

'use strict';

/* ─── State ──────────────────────────────────────────────── */
const State = {
  currentData: null,
  currentSection: 'overview',
};

/* ─── Session Guard ──────────────────────────────────────── */
function getSession() {
  return JSON.parse(localStorage.getItem('fg_session') || 'null');
}
function requireAuth() {
  if (!getSession()) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

/* ─── Toast ──────────────────────────────────────────────── */
function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✓', error: '✗', info: 'ℹ' };
  toast.innerHTML = `<span style="font-weight:700; font-size:1rem;">${icons[type] || icons.info}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ─── Loading Overlay ────────────────────────────────────── */
function showLoading(text = 'Analyzing product data...') {
  const overlay = document.getElementById('loading-overlay');
  const textEl  = document.getElementById('loading-text');
  if (overlay) overlay.classList.add('visible');
  if (textEl)  textEl.textContent = text;
}
function hideLoading() {
  document.getElementById('loading-overlay')?.classList.remove('visible');
}

/* ─── Section Metadata ───────────────────────────────────── */
const SECTIONS = {
  overview:   { title: 'Overview',          desc: 'Market summary and key performance indicators' },
  research:   { title: 'Product Research',  desc: 'Performance metrics, comparison and market share' },
  estimator:  { title: 'Estimator',         desc: 'Profit calculator, product details and keywords' },
  demand:     { title: 'Demand',            desc: 'Sales trends, seasonality and best-selling products' },
  customer:   { title: 'Customer Insight',  desc: 'Sentiment analysis, feedback and reviews' },
};

/* ─── Navigation ─────────────────────────────────────────── */
function setActiveNav(section) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.section === section);
    item.setAttribute('aria-current', item.dataset.section === section ? 'page' : '');
  });
  const meta = SECTIONS[section];
  if (meta) {
    document.getElementById('header-section-title').textContent = meta.title;
    document.getElementById('header-section-desc').textContent  = meta.desc;
  }
  State.currentSection = section;
}

function renderSection(section, data) {
  if (!data) {
    showWelcomeState();
    return;
  }
  switch (section) {
    case 'overview':  window.ForgeticOverview.render(data);  break;
    case 'research':  window.ForgeticResearch.render(data);  break;
    case 'estimator': window.ForgeticEstimator.render(data); break;
    case 'demand':    window.ForgeticDemand.render(data);    break;
    case 'customer':  window.ForgeticCustomer.render(data);  break;
  }
}

function navigateTo(section) {
  setActiveNav(section);
  renderSection(section, State.currentData);
  // Scroll content to top
  document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ─── Welcome State ──────────────────────────────────────── */
function showWelcomeState() {
  const el = document.getElementById('content-body');
  if (!el) return;
  el.innerHTML = `
    <div class="welcome-state">
      <div class="welcome-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </div>
      <h2 class="welcome-title">Paste an eBay Product URL</h2>
      <p class="welcome-desc">Enter any eBay product listing URL in the sidebar to instantly unlock real-time market intelligence, competitor analysis, and profit projections.</p>
      <div class="welcome-steps">
        <div class="welcome-step"><div class="step-num">1</div> Paste product URL</div>
        <div class="welcome-step"><div class="step-num">2</div> Press Enter or →</div>
        <div class="welcome-step"><div class="step-num">3</div> Explore your insights</div>
      </div>
    </div>
  `;
}

/* ─── URL Analysis ───────────────────────────────────────── */
async function analyzeURL(url) {
  url = url.trim();
  if (!url) return;

  // Basic URL validation — accepts any URL starting with http/https
  if (!/^https?:\/\/.+/i.test(url)) {
    showToast('Please enter a valid URL starting with https://', 'error');
    return;
  }

  showLoading('Scraping eBay listing data...');

  // Simulate network delay for realism
  const steps = [
    { delay: 400,  text: 'Connecting to eBay...' },
    { delay: 700,  text: 'Parsing product listing...' },
    { delay: 500,  text: 'Analyzing market data...' },
    { delay: 400,  text: 'Calculating opportunity score...' },
    { delay: 300,  text: 'Generating insights...' },
  ];

  const textEl = document.getElementById('loading-text');
  let elapsed = 0;
  for (const step of steps) {
    await new Promise(r => setTimeout(r, step.delay));
    elapsed += step.delay;
    if (textEl) textEl.textContent = step.text;
  }

  // Run the deterministic scraper
  const data = window.ForgeticScraper.analyze(url);
  State.currentData = data;

  hideLoading();

  // Show active URL chip
  const chip    = document.getElementById('active-url-chip');
  const chipTxt = document.getElementById('active-url-text');
  if (chip && chipTxt) {
    chipTxt.textContent = url.length > 38 ? url.slice(0, 35) + '…' : url;
    chip.classList.add('visible');
    chip.title = `Active: ${url} — click to clear`;
  }

  // Clear input
  const inputEl = document.getElementById('url-input');
  if (inputEl) inputEl.value = '';

  // Navigate / re-render current section
  renderSection(State.currentSection, data);
  showToast(`✅ Analysis complete — ${data.productName}`, 'success');
}

/* ─── Date/Time Header ───────────────────────────────────── */
function updateHeaderDate() {
  const el = document.getElementById('header-date');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });
}

/* ─── User Display ───────────────────────────────────────── */
function setupUserDisplay() {
  const session = getSession();
  if (!session) return;

  const nameEl    = document.getElementById('user-display-name');
  const emailEl   = document.getElementById('user-display-email');
  const avatarEl  = document.getElementById('user-avatar-initials');

  if (nameEl)   nameEl.textContent  = session.name  || 'Forgetic User';
  if (emailEl)  emailEl.textContent = session.email || '';
  if (avatarEl) {
    const parts = (session.name || 'FG').split(' ');
    avatarEl.textContent = parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
}

/* ─── Keyboard Shortcut Helper ───────────────────────────── */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + L → focus URL input
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
      e.preventDefault();
      document.getElementById('url-input')?.focus();
    }
    // Escape → blur URL input
    if (e.key === 'Escape') {
      document.getElementById('url-input')?.blur();
    }
  });
}

/* ─── Main Init ──────────────────────────────────────────── */
function init() {
  if (!requireAuth()) return;

  setupUserDisplay();
  updateHeaderDate();
  setInterval(updateHeaderDate, 60000);
  setupKeyboardShortcuts();

  /* ── Nav click events ── */
  document.querySelectorAll('.nav-item').forEach(item => {
    const handler = () => navigateTo(item.dataset.section);
    item.addEventListener('click', handler);
    item.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } });
  });

  /* ── URL input events ── */
  const urlInput = document.getElementById('url-input');
  const urlBtn   = document.getElementById('url-submit-btn');

  urlInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') analyzeURL(urlInput.value);
  });
  urlBtn?.addEventListener('click', () => {
    analyzeURL(urlInput?.value || '');
  });

  /* ── URL chip (clear) ── */
  document.getElementById('active-url-chip')?.addEventListener('click', () => {
    State.currentData = null;
    const chip = document.getElementById('active-url-chip');
    chip?.classList.remove('visible');
    showWelcomeState();
    showToast('URL cleared', 'info', 2000);
  });

  /* ── Logout ── */
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to sign out?')) {
      localStorage.removeItem('fg_session');
      window.location.href = 'index.html';
    }
  });

  /* ── Mobile sidebar ── */
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const sidebar   = document.getElementById('sidebar');
  if (mobileBtn && sidebar) {
    mobileBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
    // Close on nav item click
    sidebar.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => sidebar.classList.remove('open'));
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !mobileBtn.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  /* ── Responsive: show/hide mobile btn ── */
  function handleResize() {
    const mBtn = document.getElementById('mobile-menu-btn');
    if (!mBtn) return;
    mBtn.style.display = window.innerWidth <= 900 ? 'flex' : 'none';
  }
  handleResize();
  window.addEventListener('resize', handleResize);

  /* ── URL input placeholder tooltip ── */
  urlInput?.addEventListener('focus', () => {
    urlInput.placeholder = 'https://www.ebay.com/itm/...';
  });
  urlInput?.addEventListener('blur', () => {
    urlInput.placeholder = 'Paste eBay URL & press Enter';
  });

  /* ── Demo: preload if demo URL in hash ── */
  const hash = window.location.hash;
  if (hash && hash.startsWith('#demo=')) {
    const demoUrl = decodeURIComponent(hash.slice(6));
    if (demoUrl) {
      setTimeout(() => analyzeURL(demoUrl), 600);
    }
  }

  /* ── Initial state ── */
  showWelcomeState();
  setActiveNav('overview');
}

/* ─── Boot ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', init);
