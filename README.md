# SARAL — Simplified Adaptive Interface Assistive Layer

> Accessible government portals for people with disabilities in India.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://your-username.github.io/saral)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## What is SARAL?

SARAL is a Progressive Web App (PWA) that transforms complex government portals into step-by-step, plain-language, voice-guided experiences for people with cognitive, intellectual, and other disabilities — with built-in scam protection.

Built for India's 26 million disabled citizens under the RPwD Act 2016.

---

## 7-Day Build Plan

| Day | What we build | Owner |
|-----|---------------|-------|
| Day 1 | Project setup, landing page, mode selector, language toggle | |
| Day 2 | Step-by-step form engine, progress bar, auto-save | |
| Day 3 | Voice read aloud + voice input (Web Speech API) | |
| Day 4 | Anti-scam layer — URL verifier, OTP guardian, phrase detector | |
| Day 5 | Gemini API — plain language converter, contextual help | |
| Day 6 | PWA polish, mobile responsive, accessibility modes | |
| Day 7 | Deploy to GitHub Pages, demo video, contest submission | |

---

## Project Structure

```
saral/
├── index.html          ← Landing page + mode selector
├── form.html           ← Step-by-step form engine (Day 2)
├── styles/
│   ├── main.css        ← Base styles
│   └── modes.css       ← Large / calm / contrast mode overrides
├── js/
│   ├── app.js          ← Landing page logic
│   ├── form-engine.js  ← Step-by-step form logic (Day 2)
│   ├── voice.js        ← Web Speech API (Day 3)
│   ├── scam-guard.js   ← Anti-scam protection (Day 4)
│   └── ai.js           ← Gemini API integration (Day 5)
├── data/
│   └── forms.json      ← Form definitions in plain language
├── lang/
│   └── strings.js      ← All Hindi + English UI text
├── assets/
│   └── icons/          ← PWA icons
├── manifest.json       ← PWA config
└── sw.js               ← Service worker (offline support)
```

---

## How to Run Locally

```bash
# Clone the repo
git clone https://github.com/YOUR-USERNAME/saral.git
cd saral

# Open in browser (no build step needed)
# Option 1: VS Code Live Server extension — right click index.html → Open with Live Server
# Option 2: Python simple server
python -m http.server 8000
# Then open http://localhost:8000
```

---

## How to Collaborate (GitHub workflow)

### First time setup
```bash
git clone https://github.com/YOUR-USERNAME/saral.git
cd saral
```

### Daily workflow
```bash
# Before starting work — pull latest changes
git pull origin main

# Create your branch for the day
git checkout -b day2-form-engine   # replace with your task

# After making changes
git add .
git commit -m "Day 2: Add step-by-step form engine"
git push origin day2-form-engine

# Then create a Pull Request on GitHub
```

### Branch naming convention
```
day1-setup
day2-form-engine
day3-voice
day4-scam-guard
day5-ai-integration
day6-pwa-polish
day7-deploy
```

---

## Deploy to GitHub Pages (Day 7)

1. Go to repo **Settings → Pages**
2. Set source to **main branch / root**
3. Your app will be live at `https://YOUR-USERNAME.github.io/saral`

---

## Tech Stack

| What | Tool | Why |
|------|------|-----|
| Frontend | HTML + CSS + Vanilla JS | Team skill, no build step |
| Voice | Web Speech API | Free, built into Chrome |
| AI | Gemini 1.5 Flash API | Free tier (15 req/min) |
| Offline | Service Worker (PWA) | Rural users with poor connectivity |
| Hosting | GitHub Pages | Free, instant |
| Languages | Hindi + English | Covers 52% of India's disabled population |

---

## Disability Coverage

- Intellectual disability
- Specific learning disabilities (dyslexia, dyscalculia)
- Autism spectrum disorder
- Mental illness
- Dementia / memory loss
- Anxiety / panic disorder
- Low vision
- Motor / physical impairment
- Speech and language disability

---

## Contest Submission

**Theme:** Human-Centric & Inclusive Engineering Interfaces  
**Subtheme:** Assistive Digital Interfaces  
**Unique angle:** First assistive interface combining cognitive accessibility + real-time scam protection for disabled users on Indian government portals.

---

## Team

| Name | Role | GitHub |
|------|------|--------|
| | Lead Dev | |
| | UI/CSS | |
| | JS Logic | |
| | Content/Hindi | |

---

## License
MIT — free to use, modify, and distribute.
