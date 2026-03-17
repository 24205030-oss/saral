// ===========================
// SARAL — scam-guard.js
// Day 4: Anti-scam protection layer
// Protects disabled users from the 4 most common gov portal scams
// ===========================

// ---- Whitelist of real Indian government domains ----
const SAFE_DOMAINS = [
  'gov.in', 'nic.in', 'india.gov.in', 'digitalindia.gov.in',
  'digilocker.gov.in', 'umang.gov.in', 'nsap.nic.in',
  'pmkisan.gov.in', 'eshram.gov.in', 'udid.gov.in',
  'socialjustice.gov.in', 'disabilityaffairs.gov.in',
  'labour.gov.in', 'mygov.in', 'india.gov.in',
  '127.0.0.1', 'localhost' // Allow local dev
];

// ---- Scam phrases in English ----
const SCAM_PHRASES_EN = [
  'pay fee', 'payment required', 'activation fee', 'registration fee',
  'processing fee', 'service charge', 'pay now to proceed',
  'call this number', 'contact agent', 'send money',
  'transfer amount', 'pay to activate', 'fee required',
  'deposit required', 'pay online', 'upi payment',
  'click here to pay', 'pay ₹', 'pay rs.'
];

// ---- Scam phrases in Hindi ----
const SCAM_PHRASES_HI = [
  'शुल्क दें', 'फीस दें', 'पैसे दें', 'भुगतान करें',
  'एक्टिवेशन फीस', 'रजिस्ट्रेशन फीस', 'प्रोसेसिंग फीस',
  'इस नंबर पर कॉल करें', 'एजेंट से संपर्क करें',
  'पैसे ट्रांसफर करें', 'अभी भुगतान करें'
];

// ---- Warning messages ----
const WARNINGS = {
  fake_url: {
    en: {
      title: 'Warning — This may not be a real government website',
      text:  'The website you are on does not appear to be an official Indian government portal. Real government websites end with .gov.in or .nic.in. Do not enter your Aadhaar, bank details, or OTP here.',
      btn:   'I understand, go back'
    },
    hi: {
      title: 'चेतावनी — यह असली सरकारी वेबसाइट नहीं हो सकती',
      text:  'आप जिस वेबसाइट पर हैं वह आधिकारिक सरकारी पोर्टल नहीं लगती। असली सरकारी वेबसाइटें .gov.in या .nic.in से खत्म होती हैं। यहाँ अपना आधार, बैंक विवरण या OTP न डालें।',
      btn:   'समझ गया, वापस जाएं'
    }
  },
  scam_phrase: {
    en: {
      title: 'Warning — Possible scam detected',
      text:  'This page is asking you to pay money. Government portals NEVER charge any fee for applying for benefits or pensions. If anyone or any website asks you to pay — it is a scam. Close this page immediately.',
      btn:   'I understand, keep me safe'
    },
    hi: {
      title: 'चेतावनी — संभावित धोखा पाया गया',
      text:  'यह पेज आपसे पैसे मांग रहा है। सरकारी पोर्टल कभी भी पेंशन या लाभ के लिए कोई शुल्क नहीं लेते। अगर कोई भी वेबसाइट पैसे मांगे — यह धोखा है। इस पेज को तुरंत बंद करें।',
      btn:   'समझ गया, मुझे सुरक्षित रखें'
    }
  },
  otp_share: {
    en: {
      title: 'Never share your OTP with anyone',
      text:  'Your OTP is a secret one-time password sent only to your phone. No government officer, bank employee, CSC agent, or helper will ever ask for your OTP. If anyone asks — hang up immediately. It is a scam.',
      btn:   'I will never share my OTP'
    },
    hi: {
      title: 'OTP कभी किसी को न बताएं',
      text:  'OTP एक गुप्त एक-बार का पासवर्ड है जो केवल आपके फोन पर आता है। कोई भी सरकारी अधिकारी, बैंक कर्मचारी, CSC एजेंट या सहायक कभी OTP नहीं मांगेगा। अगर कोई मांगे — तुरंत फोन काटें। यह धोखा है।',
      btn:   'मैं OTP कभी नहीं बताऊंगा/बताऊंगी'
    }
  }
};

// ---- 1. Verify portal URL ----
function verifyPortalURL(url) {
  if (!url) url = window.location.href;
  try {
    const hostname = new URL(url).hostname;
    const isSafe   = SAFE_DOMAINS.some(domain => hostname === domain || hostname.endsWith('.' + domain));
    if (!isSafe) {
      const lang = getCurrentLang();
      showScamWarning('fake_url', lang);
      return false;
    }
    return true;
  } catch(e) {
    return true; // If URL parsing fails, don't block
  }
}

// ---- 2. Scan page for scam phrases ----
function scanPageForScamPhrases() {
  const bodyText = document.body.innerText.toLowerCase();
  const lang     = getCurrentLang();

  const allPhrases = [...SCAM_PHRASES_EN, ...SCAM_PHRASES_HI];
  const found      = allPhrases.find(phrase => bodyText.includes(phrase.toLowerCase()));

  if (found) {
    console.warn('SARAL ScamGuard: Scam phrase detected —', found);
    showScamWarning('scam_phrase', lang);
    return true;
  }
  return false;
}

// ---- 3. OTP guardian — call this when OTP field is shown ----
function otpGuardian() {
  const lang = getCurrentLang();
  showScamWarning('otp_share', lang);
  // Also speak the warning aloud
  if (typeof speakText === 'function') {
    const msg = lang === 'hi'
      ? 'चेतावनी! OTP किसी को न बताएं। यह बेहद गुप्त है।'
      : 'Warning! Never share your OTP with anyone. It is strictly secret.';
    setTimeout(() => speakText(msg, lang), 500);
  }
}

// ---- 4. Show scam warning modal ----
function showScamWarning(type, lang) {
  const w = WARNINGS[type]?.[lang] || WARNINGS[type]?.['en'];
  if (!w) return;

  // Remove any existing warning
  const existing = document.getElementById('scamGuardModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id    = 'scamGuardModal';
  modal.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(0,0,0,0.75);
    display: flex; align-items: center; justify-content: center;
    padding: 20px; font-family: 'DM Sans', sans-serif;
  `;

  modal.innerHTML = `
    <div style="
      background: white; border-radius: 18px;
      padding: 32px 28px; max-width: 420px; width: 100%;
      text-align: center; border-top: 5px solid #A32D2D;
      animation: scamSlideIn 0.3s ease;
    ">
      <div style="
        width: 72px; height: 72px; border-radius: 50%;
        background: #FCEBEB; display: flex; align-items: center;
        justify-content: center; margin: 0 auto 20px;
      ">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#A32D2D" stroke-width="2" stroke-linecap="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
      <div style="font-size: 20px; font-weight: 700; color: #A32D2D; margin-bottom: 14px; line-height: 1.3;">
        ${w.title}
      </div>
      <div style="font-size: 15px; color: #5F5E5A; line-height: 1.7; margin-bottom: 28px;">
        ${w.text}
      </div>
      <button onclick="closeScamGuardModal()" style="
        background: #534AB7; color: white; border: none;
        border-radius: 10px; padding: 14px; width: 100%;
        font-size: 16px; font-weight: 600; cursor: pointer;
        font-family: 'DM Sans', sans-serif;
      ">${w.btn}</button>
    </div>
    <style>
      @keyframes scamSlideIn {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    </style>
  `;

  document.body.appendChild(modal);

  // Also speak warning aloud
  if (typeof speakText === 'function') {
    setTimeout(() => speakText(w.title + '. ' + w.text, lang), 300);
  }
}

// ---- Close scam modal ----
function closeScamGuardModal() {
  const modal = document.getElementById('scamGuardModal');
  if (modal) modal.remove();
  stopSpeaking();
}

// ---- 5. Run all checks on page load ----
function runScamChecks() {
  // Small delay so page content loads first
  setTimeout(() => {
    verifyPortalURL();
    scanPageForScamPhrases();
  }, 1000);
}

// ---- Auto-run on every page load ----
document.addEventListener('DOMContentLoaded', runScamChecks);

// ---- Helper ----
function getCurrentLang() {
  return localStorage.getItem('saral-lang') || 'en';
}

function stopSpeaking() {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}
