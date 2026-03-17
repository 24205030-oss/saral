// ===========================
// SARAL — app.js
// Landing page logic
// Day 1: mode selection, language toggle, routing
// ===========================

// ---- State ----
let selectedMode = localStorage.getItem('saral-mode') || null;

// ---- On load ----
document.addEventListener('DOMContentLoaded', () => {
  applyLanguage(currentLang);
  if (selectedMode) {
    document.getElementById('mode-' + selectedMode)?.classList.add('selected');
    enableCTA();
  }
  registerServiceWorker();
});

// ---- Language toggle ----
function toggleLang() {
  currentLang = currentLang === 'en' ? 'hi' : 'en';
  localStorage.setItem('saral-lang', currentLang);
  applyLanguage(currentLang);
}

function applyLanguage(lang) {
  const s = STRINGS[lang];
  // Update every element that has a string id
  Object.keys(s).forEach(key => {
    const el = document.getElementById(key);
    if (el) el.innerHTML = s[key];
  });
  // Update html lang attribute
  document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
  // Update body font for Devanagari
  document.body.style.fontFamily = lang === 'hi'
    ? "'Noto Sans Devanagari', 'DM Sans', sans-serif"
    : "'DM Sans', sans-serif";
}

// ---- Mode selection ----
function selectMode(mode) {
  // Deselect all
  document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('selected'));
  // Select chosen
  document.getElementById('mode-' + mode).classList.add('selected');
  selectedMode = mode;
  localStorage.setItem('saral-mode', mode);
  // Apply body class for CSS overrides
  document.body.className = document.body.className
    .replace(/mode-\w+/g, '').trim();
  document.body.classList.add('mode-' + mode);
  enableCTA();
}

function enableCTA() {
  const btn = document.getElementById('ctaBtn');
  const txt = document.getElementById('ctaText');
  btn.disabled = false;
  txt.textContent = STRINGS[currentLang].ctaReady;
}

// ---- Start SARAL ----
function startSaral() {
  if (!selectedMode) return;
  // Pass mode + lang as URL params to form page
  window.location.href = `form.html?mode=${selectedMode}&lang=${currentLang}`;
}

function goToForm(formId) {
  if (!selectedMode) {
    // Prompt to select mode first
    document.querySelector('.mode-section').scrollIntoView({ behavior: 'smooth' });
    document.querySelector('.mode-label').style.color = 'var(--coral)';
    setTimeout(() => {
      document.querySelector('.mode-label').style.color = '';
    }, 2000);
    return;
  }
  window.location.href = `form.html?mode=${selectedMode}&lang=${currentLang}&form=${formId}`;
}

// ---- PWA Service Worker ----
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('SARAL: Service worker registered'))
      .catch(err => console.warn('SARAL: SW registration failed', err));
  }
}
