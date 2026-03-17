// ===========================
// SARAL — voice.js
// Day 3: Voice read-aloud + voice input
// Uses Web Speech API — FREE, no API key needed
// Works in Chrome, Edge on both mobile and desktop
// ===========================

// ---- State ----
let isListening   = false;
let recognition   = null;
let voiceSupported = 'speechSynthesis' in window;
let recogSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

// ---- Init on load ----
document.addEventListener('DOMContentLoaded', () => {
  if (!voiceSupported) {
    console.warn('SARAL Voice: Speech synthesis not supported in this browser');
    hideVoiceButtons();
  }
  if (recogSupported) initRecognition();
});

// ---- Speak any text aloud ----
function speakText(text, lang = 'en') {
  if (!voiceSupported) return;
  speechSynthesis.cancel(); // Stop anything currently speaking

  const utterance  = new SpeechSynthesisUtterance(text);
  utterance.lang   = lang === 'hi' ? 'hi-IN' : 'en-IN';
  utterance.rate   = 0.88;
  utterance.pitch  = 1;
  utterance.volume = 1;

  // Show voice indicator
  showVoiceIndicator(lang === 'hi' ? 'पढ़ा जा रहा है...' : 'Reading aloud...');

  utterance.onend = () => hideVoiceIndicator();
  utterance.onerror = () => hideVoiceIndicator();

  speechSynthesis.speak(utterance);
}

// ---- Stop speaking ----
function stopSpeaking() {
  if (voiceSupported) speechSynthesis.cancel();
  hideVoiceIndicator();
}

// ---- Voice input — start listening ----
function startVoiceInput() {
  if (!recogSupported) {
    alert('Voice input is not supported in this browser. Please use Chrome.');
    return;
  }
  if (isListening) {
    stopListening();
    return;
  }
  startListening();
}

function startListening() {
  if (!recognition) initRecognition();
  isListening = true;

  // Update button UI
  const btn = document.getElementById('voiceInputBtn');
  if (btn) {
    btn.classList.add('listening');
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <rect x="6" y="6" width="12" height="12" rx="2"/>
      </svg>
      ${getCurrentLang() === 'hi' ? 'सुन रहा है... (रोकने के लिए दबाएं)' : 'Listening... (tap to stop)'}
    `;
  }

  showVoiceIndicator(getCurrentLang() === 'hi' ? 'सुन रहा है...' : 'Listening...');

  try {
    recognition.start();
  } catch(e) {
    // Already started
    isListening = false;
  }
}

function stopListening() {
  isListening = false;
  if (recognition) recognition.stop();

  const btn = document.getElementById('voiceInputBtn');
  if (btn) {
    btn.classList.remove('listening');
    btn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
      </svg>
      ${getCurrentLang() === 'hi' ? 'बोलकर जवाब दें' : 'Speak your answer'}
    `;
  }
  hideVoiceIndicator();
}

// ---- Init Speech Recognition ----
function initRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();

  recognition.continuous    = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.lang = getCurrentLang() === 'hi' ? 'hi-IN' : 'en-IN';

  // Live interim results — show as user speaks
  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    // Fill into input field live
    const input = document.getElementById('stepInput');
    if (input) input.value = transcript;
  };

  recognition.onend = () => {
    stopListening();
  };

  recognition.onerror = (e) => {
    console.warn('SARAL Voice: Recognition error', e.error);
    stopListening();
    if (e.error === 'not-allowed') {
      showVoicePermissionError();
    }
  };
}

// ---- OTP special warning (spoken aloud) ----
function otpVoiceWarning(lang = 'en') {
  const msg = lang === 'hi'
    ? 'चेतावनी! यह OTP बेहद गुप्त है। किसी भी व्यक्ति को यह नंबर न बताएं। सरकारी कर्मचारी या बैंक कभी OTP नहीं मांगते।'
    : 'Warning! This OTP is secret. Never share it with anyone. No government officer or bank will ever ask for your OTP.';
  speakText(msg, lang);
}

// ---- Voice indicator UI ----
function showVoiceIndicator(text) {
  const ind = document.getElementById('voiceIndicator');
  const lbl = document.getElementById('voiceIndicatorText');
  if (ind) { ind.style.display = 'flex'; }
  if (lbl) { lbl.textContent = text; }
}

function hideVoiceIndicator() {
  const ind = document.getElementById('voiceIndicator');
  if (ind) ind.style.display = 'none';
}

// ---- Hide voice buttons if not supported ----
function hideVoiceButtons() {
  document.querySelectorAll('.voice-read-btn, .voice-input-btn').forEach(btn => {
    btn.style.display = 'none';
  });
}

// ---- Permission error ----
function showVoicePermissionError() {
  const lang = getCurrentLang();
  alert(lang === 'hi'
    ? 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग में माइक्रोफ़ोन चालू करें।'
    : 'Microphone permission denied. Please allow microphone access in your browser settings.'
  );
}

// ---- Helper — get current language ----
function getCurrentLang() {
  return localStorage.getItem('saral-lang') || 'en';
}
