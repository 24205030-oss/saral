// ===========================
// SARAL — strings.js
// All UI text in Hindi + English
// Add new strings here — never hardcode text in HTML
// ===========================

const STRINGS = {
  en: {
    tagline:         "Accessible Government Portals",
    heroBadge:       "Government Portal Assistant",
    heroTitle:       "Government forms,<br><span>made simple.</span>",
    heroDesc:        "SARAL helps people with disabilities fill government forms safely — step by step, in plain language, with protection from scams.",
    modeLabel:       "How would you like help?",
    modeSimpleName:  "Simple Words",
    modeSimpleDesc:  "Plain language, one step at a time",
    modeVoiceName:   "Voice Mode",
    modeVoiceDesc:   "Listen to questions, speak answers",
    modeLargeName:   "Large Buttons",
    modeLargeDesc:   "Bigger text and buttons",
    modeCalmName:    "Calm Mode",
    modeCalmDesc:    "No alerts, gentle guidance",
    ctaReady:        "Start filling form",
    ctaWaiting:      "Select a mode to begin",
    scamBannerText:  "Government portals never ask for money. SARAL protects you from scams.",
    howTitle:        "How SARAL works",
    step1Text:       "Choose your mode",
    step2Text:       "Answer one question at a time",
    step3Text:       "SARAL protects and guides you",
    step4Text:       "Form submitted successfully",
    portalsTitle:    "Available government forms",
    portal1Name:     "Disability Pension",
    footerText:      "Built for India's 26 million disabled citizens · SARAL v1.0 · RPwD Act 2016 compliant",
    langLabel:       "हिंदी",
  },
  hi: {
    tagline:         "सरकारी पोर्टल सहायक",
    heroBadge:       "सरकारी पोर्टल सहायक",
    heroTitle:       "सरकारी फॉर्म,<br><span>अब आसान।</span>",
    heroDesc:        "सरल — विकलांग लोगों की सरकारी फॉर्म भरने में मदद करता है — एक कदम एक बार, सरल भाषा में, धोखे से सुरक्षा के साथ।",
    modeLabel:       "आप कैसे मदद चाहते हैं?",
    modeSimpleName:  "सरल शब्द",
    modeSimpleDesc:  "आसान भाषा, एक कदम एक बार",
    modeVoiceName:   "आवाज़ मोड",
    modeVoiceDesc:   "सुनें और बोलकर जवाब दें",
    modeLargeName:   "बड़े बटन",
    modeLargeDesc:   "बड़ा लेख और बटन",
    modeCalmName:    "शांत मोड",
    modeCalmDesc:    "कोई अलार्म नहीं, धीरे-धीरे मार्गदर्शन",
    ctaReady:        "फॉर्म भरना शुरू करें",
    ctaWaiting:      "शुरू करने के लिए एक मोड चुनें",
    scamBannerText:  "सरकारी पोर्टल कभी पैसे नहीं मांगते। सरल आपको धोखे से बचाता है।",
    howTitle:        "सरल कैसे काम करता है",
    step1Text:       "अपना मोड चुनें",
    step2Text:       "एक बार में एक सवाल",
    step3Text:       "सरल आपकी सुरक्षा करता है",
    step4Text:       "फॉर्म सफलतापूर्वक जमा",
    portalsTitle:    "उपलब्ध सरकारी फॉर्म",
    portal1Name:     "विकलांगता पेंशन",
    footerText:      "भारत के 2.6 करोड़ विकलांग नागरिकों के लिए बनाया गया · सरल v1.0 · RPwD अधिनियम 2016",
    langLabel:       "English",
  }
};

// Current language — default English
let currentLang = localStorage.getItem('saral-lang') || 'en';
