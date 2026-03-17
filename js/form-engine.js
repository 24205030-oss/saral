// ===========================
// SARAL — form-engine.js
// Day 2: Step-by-step form engine
// ===========================

// ---- State ----
let formData    = {};
let currentForm = null;
let steps       = [];
let currentStep = 0;
let answers     = {};
let mode        = 'simple';
let lang        = 'en';

// ---- Boot ----
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  mode   = params.get('mode') || localStorage.getItem('saral-mode') || 'simple';
  lang   = params.get('lang') || localStorage.getItem('saral-lang') || 'en';
  const formId = params.get('form') || 'disability-pension';

  document.body.classList.add('mode-' + mode);

  if (lang === 'hi') {
    document.body.style.fontFamily = "'Noto Sans Devanagari','DM Sans',sans-serif";
    document.documentElement.lang = 'hi';
  }

  await loadForms();
  loadForm(formId);
  restoreProgress(formId);
  renderStep();
});

async function loadForms() {
  try {
    const res = await fetch('data/forms.json');
    formData  = await res.json();
  } catch (e) {
    console.error('SARAL: Could not load forms.json', e);
    formData = {};
  }
}

function loadForm(formId) {
  currentForm = formData[formId];
  if (!currentForm) return;
  steps = currentForm.steps;
  const dept = lang === 'hi' ? currentForm.dept_hi : currentForm.dept_en;
  const el   = document.getElementById('formDeptLabel');
  if (el) el.textContent = dept;
}

function renderStep() {
  if (!steps.length) return;
  const step = steps[currentStep];

  const card = document.getElementById('formCard');
  card.style.animation = 'none';
  card.offsetHeight;
  card.style.animation = 'slideIn 0.3s ease';

  document.getElementById('stepChip').textContent =
    (lang === 'hi' ? 'चरण ' : 'Step ') + (currentStep + 1);

  const otpWrap = document.getElementById('otpWarning');
  if (step.otp_field) {
    otpWrap.style.display = 'flex';
    document.getElementById('otpWarningText').textContent =
      lang === 'hi' ? 'यह OTP किसी को न बताएं' : 'Never share this OTP with anyone';
    // Use scam-guard OTP guardian (Day 4) — full audio + visual warning
    if (typeof otpGuardian === 'function') {
      otpGuardian();
    }
  } else {
    otpWrap.style.display = 'none';
  }

  document.getElementById('stepQuestion').textContent =
    lang === 'hi' ? step.question_hi : step.question_en;
  document.getElementById('helpText').textContent =
    lang === 'hi' ? step.help_hi : step.help_en;

  const exText = lang === 'hi' ? step.example_hi : step.example_en;
  const exBox  = document.getElementById('exampleBox');
  if (exText) {
    exBox.style.display = 'block';
    document.getElementById('exampleText').textContent = exText;
    document.getElementById('exampleLabel').textContent = lang === 'hi' ? 'उदाहरण:' : 'Example:';
  } else {
    exBox.style.display = 'none';
  }

  document.getElementById('voiceReadLabel').textContent =
    lang === 'hi' ? 'ज़ोर से पढ़ें' : 'Read aloud';

  renderInput(step);
  updateProgress();
  updateNav();
  hideError();

  if (mode === 'voice') setTimeout(() => readStepAloud(), 600);
}

function renderInput(step) {
  const area     = document.getElementById('inputArea');
  const savedVal = answers[step.id] || '';

  if (step.type === 'text') {
    area.innerHTML = `
      <input
        class="saral-input"
        type="${step.id === 'otp' || step.id === 'aadhaar' ? 'tel' : 'text'}"
        id="stepInput"
        placeholder="${lang === 'hi' ? step.placeholder_hi : step.placeholder_en}"
        value="${savedVal}"
        autocomplete="off"
        inputmode="${step.id === 'otp' || step.id === 'aadhaar' || step.id === 'bank_account' ? 'numeric' : 'text'}"
        aria-label="${lang === 'hi' ? step.question_hi : step.question_en}"
      />
      ${mode === 'voice' ? `
      <button class="voice-input-btn" id="voiceInputBtn" onclick="startVoiceInput()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
        </svg>
        ${lang === 'hi' ? 'बोलकर जवाब दें' : 'Speak your answer'}
      </button>` : ''}
    `;
    setTimeout(() => document.getElementById('stepInput')?.focus(), 300);

  } else if (step.type === 'select') {
    const options = lang === 'hi' ? step.options_hi : step.options_en;
    const opts = options.map((o, i) =>
      `<option value="${i === 0 ? '' : o}" ${savedVal === o ? 'selected' : ''}>${o}</option>`
    ).join('');
    area.innerHTML = `
      <select class="saral-select" id="stepInput"
        aria-label="${lang === 'hi' ? step.question_hi : step.question_en}">
        ${opts}
      </select>
    `;
  }
}

function updateProgress() {
  const total = steps.length;
  const pct   = Math.round((currentStep / total) * 100);
  document.getElementById('progressLabel').textContent =
    (lang === 'hi' ? 'चरण ' : 'Step ') + (currentStep + 1) +
    (lang === 'hi' ? ' में से ' : ' of ') + total;
  document.getElementById('progressPct').textContent  = pct + '%';
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('stepDots').innerHTML = steps.map((_, i) => {
    const cls = i < currentStep ? 'done' : i === currentStep ? 'active' : '';
    return `<div class="step-dot ${cls}"></div>`;
  }).join('');
}

function updateNav() {
  const backBtn = document.getElementById('backBtn');
  const nextLbl = document.getElementById('nextLabel');
  const nextBtn = document.getElementById('nextBtn');
  backBtn.disabled = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  nextLbl.textContent = isLast ? (lang === 'hi' ? 'जमा करें' : 'Submit') : (lang === 'hi' ? 'आगे' : 'Next');
  nextBtn.classList.toggle('submit', isLast);
  document.getElementById('backLabel').textContent = lang === 'hi' ? 'वापस' : 'Back';
}

function nextStep() {
  const input = document.getElementById('stepInput');
  const val   = input ? input.value.trim() : '';
  const step  = steps[currentStep];
  if (step.required && !val) {
    showError(lang === 'hi' ? 'यह जानकारी जरूरी है' : 'This field is required');
    input?.classList.add('error');
    return;
  }
  answers[step.id] = val;
  saveProgress();
  if (currentStep < steps.length - 1) {
    currentStep++;
    renderStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    submitForm();
  }
}

function prevStep() {
  if (currentStep > 0) {
    const input = document.getElementById('stepInput');
    if (input) answers[steps[currentStep].id] = input.value.trim();
    currentStep--;
    renderStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function submitForm() {
  const formId = new URLSearchParams(window.location.search).get('form') || 'disability-pension';
  localStorage.removeItem('saral-progress-' + formId);
  document.querySelector('.form-main').style.display  = 'none';
  document.querySelector('.header').style.display     = 'none';
  document.getElementById('successScreen').style.display = 'flex';
  const ref = 'NSAP-2025-' + Math.random().toString(36).substr(2,8).toUpperCase();
  document.getElementById('refValue').textContent = ref;
  document.getElementById('successTitle').textContent =
    lang === 'hi' ? 'आवेदन जमा हो गया!' : 'Application submitted!';
  document.getElementById('successText').textContent =
    lang === 'hi'
      ? 'आपका विकलांगता पेंशन आवेदन प्राप्त हो गया है। 3 कार्य दिवसों के भीतर SMS आएगा।'
      : 'Your disability pension application has been received. You will get an SMS within 3 working days.';
  document.getElementById('refLabel').textContent  = lang === 'hi' ? 'संदर्भ संख्या' : 'Reference number';
  document.getElementById('homeBtn').textContent   = lang === 'hi' ? 'होम पर जाएं' : 'Back to home';
  if (mode === 'voice' && 'speechSynthesis' in window) {
    const msg = lang === 'hi' ? 'बधाई हो! आपका आवेदन सफलतापूर्वक जमा हो गया।' : 'Congratulations! Your application has been submitted successfully.';
    const u = new SpeechSynthesisUtterance(msg);
    u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    speechSynthesis.speak(u);
  }
}

function saveProgress() {
  const formId = new URLSearchParams(window.location.search).get('form') || 'disability-pension';
  localStorage.setItem('saral-progress-' + formId, JSON.stringify({ currentStep, answers, lang, mode }));
  const ind = document.getElementById('saveIndicator');
  ind.style.opacity = '1';
  setTimeout(() => { ind.style.opacity = '0'; }, 1500);
}

function restoreProgress(formId) {
  const saved = localStorage.getItem('saral-progress-' + formId);
  if (!saved) return;
  try {
    const data  = JSON.parse(saved);
    currentStep = data.currentStep || 0;
    answers     = data.answers     || {};
  } catch(e) { /* ignore */ }
}

function showError(msg) {
  const el = document.getElementById('fieldError');
  el.style.display = 'flex';
  document.getElementById('fieldErrorText').textContent = msg;
}

function hideError() {
  document.getElementById('fieldError').style.display = 'none';
  document.getElementById('stepInput')?.classList.remove('error');
}

function showScamModal(title, text) {
  document.getElementById('scamTitle').textContent   = title;
  document.getElementById('scamText').textContent    = text;
  document.getElementById('scamOkBtn').textContent   = lang === 'hi' ? 'समझ गया' : 'I understand';
  document.getElementById('scamModal').style.display = 'flex';
}

function closeScamModal() {
  document.getElementById('scamModal').style.display = 'none';
}

function readStepAloud() {
  const step = steps[currentStep];
  if (!step || !('speechSynthesis' in window)) return;
  const text = (lang === 'hi' ? step.question_hi : step.question_en) + '. ' +
               (lang === 'hi' ? step.help_hi     : step.help_en);
  speechSynthesis.cancel();
  const btn = document.getElementById('voiceReadBtn');
  const ind = document.getElementById('voiceIndicator');
  btn.classList.add('speaking');
  document.getElementById('voiceIndicatorText').textContent = lang === 'hi' ? 'पढ़ा जा रहा है...' : 'Reading aloud...';
  ind.style.display = 'flex';
  const u = new SpeechSynthesisUtterance(text);
  u.lang  = lang === 'hi' ? 'hi-IN' : 'en-IN';
  u.rate  = 0.88;
  u.onend = () => { btn.classList.remove('speaking'); ind.style.display = 'none'; };
  speechSynthesis.speak(u);
}

function toggleLang() {
  lang = lang === 'en' ? 'hi' : 'en';
  localStorage.setItem('saral-lang', lang);
  document.getElementById('langLabel').textContent = lang === 'hi' ? 'English' : 'हिंदी';
  document.body.style.fontFamily = lang === 'hi' ? "'Noto Sans Devanagari','DM Sans',sans-serif" : "'DM Sans',sans-serif";
  renderStep();
}

function goBack() { window.location.href = 'index.html'; }
