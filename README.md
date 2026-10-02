# CareerPath AI (v2.0)

> **Intelligent, Privacy-Conscious Career Guidance Platform with Deterministic Matching, 12-Week Learning Roadmaps, and Free-Tier Gemini AI Integration.**

CareerPath AI helps school students, undergraduates, fresh graduates, and career switchers discover realistic career trajectories, analyze competency gaps, and build personalized week-by-week learning roadmaps — with **zero required budget** and **complete privacy**.

---

## 🌟 Key Features

### 1. Student-First, Entry-Level Focused Guidance
- **No Prior Experience Assumed:** Specifically designed for students, final-year college candidates, and entry-level job seekers.
- **Immediate Action Plans:** Generates concrete "What To Do This Week" milestones adapted to your weekly study availability (5h, 10h, 20h+).
- **Internship & Placement Strategy:** Practical guidance on how to stand out without prior full-time experience (deployed capstones, visible git history, STAR interview stories).

### 2. Multi-Dimensional Deterministic Career Matching
- **Transparent 5-Factor Weighted Model:**
  - **Skill Fit (45%):** Exact & transferable technical competencies weighted by proficiency (Advanced 1.0, Intermediate 0.8, Beginner 0.5).
  - **Domain Interest (20%):** Software, AI/ML, Cloud/DevOps, Cybersecurity, and Product Design affinities.
  - **Experience Level (15%):** Realistic expectations tailored to student/fresher vs mid-career profiles.
  - **Career Goal Alignment (10%):** Target title matching and role trajectory convergence.
  - **Constraint Compatibility (10%):** Remote/hybrid preferences and available weekly study hours.
- **100% Offline Operational:** The application works completely without external AI APIs using our built-in curated career catalog.

### 3. Detailed Competency & Skill Gap Analysis
- Categorizes all essential and secondary skills into:
  - **Strong:** Validated core strengths to highlight on resumes and technical interviews.
  - **Ready:** Foundational competencies ready for real-world design patterns.
  - **Developing:** Skills requiring intermediate project practice.
  - **Missing:** Priority gaps to bridge before interview readiness.

### 4. Dynamic 12-Week Action Roadmap
- Structured into 4 progressive phases:
  - **Phase 1 (Weeks 1–3):** Environment, Tooling & Syntax Foundations.
  - **Phase 2 (Weeks 4–6):** Core Architecture, State, Validation & OWASP Security.
  - **Phase 3 (Weeks 7–9):** Containerization, CI/CD Automated Testing & Performance.
  - **Phase 4 (Weeks 10–12):** Capstone Portfolio Polish, STAR Interview Prep & Resume Alignment.

### 5. Side-by-Side Career Path Comparison
- Compare your top matching careers side-by-side:
  - Match Fit percentages.
  - Skill alignment & missing competencies count.
  - Entry work environments & learning curve.
  - Student decision guides for choosing between overlapping tracks (e.g. Frontend vs Backend vs Full Stack).
  - Instant one-click trajectory switching.

### 6. Interactive AI Career Coach & Interview Preparation
- **Contextual AI Coach:** Floating drawer with quick prompt chips to answer specific learning and technical questions.
- **STAR Interview Questions:** Practice behavioral and role-specific technical questions.
- **ATS Resume Keyword Assistant:** Extracts keyword alignment against your target career.

### 7. Zero-Budget & Free-Tier First AI Integration
- **Configurable Model:** Configured via `GEMINI_MODEL` (defaults to current free-tier model: `gemini-3.8-flash`).
- **Quota Resilience:** Graceful detection of free-tier 429 rate limits with automatic fallback to Local Guidance Mode.
- **Server-Side Key Security:** `GEMINI_API_KEY` is strictly managed server-side and never exposed to browser runtimes.
- **Genuine Local Fallback:** The platform never fabricates AI status or blocks core planning features when no key is present.

### 8. Privacy, Security & Data Sovereignty
- **Local-First Storage:** User profiles, milestones, and notes stay local in `localStorage`.
- **Zero PII Required:** Names are optional; no accounts, passwords, or payment cards required.
- **Data Export & Erasure:** One-click JSON backup export, backup import, and permanent local data reset.
- **Hardened Web Security:** Strict Content Security Policy (CSP), HSTS, Permissions-Policy, X-Frame-Options (`DENY`), and in-memory rate limiting.

---

## 🚀 Quick Start (Local Development)

CareerPath AI requires zero build step or heavy bundler dependencies.

### 1. Clone the repository
```bash
git clone https://github.com/thevibingteen/Career-Path-AI.git
cd Career-Path-AI
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

If you wish to enable Google Gemini AI features:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.8-flash
```
*(If no key is configured, CareerPath AI automatically operates in 100% functional Local Guidance Mode).*

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

Run the automated Node.js test suite:
```bash
npm test
```

All 11 unit tests validate:
- Prompt injection input sanitization.
- In-memory rate limiting.
- Multi-dimensional weighted career matching.
- Skill gap categorization.
- 12-week roadmap time adaptation.
- Multi-factor readiness scoring.
- Career comparison differentiation.
- Storage schema validation and corrupted input recovery.

---

## 📁 Repository Structure

```
├── .env.example              # Sample environment configuration
├── .gitignore                # Git exclusions
├── 404.html                  # Accessible 404 error page
├── dev-server.js             # Zero-dependency local development server
├── disclaimer.html           # Career & compensation transparency disclaimer
├── favicon.svg               # Vector brand icon
├── index.html                # Main single-page application entrypoint
├── manifest.webmanifest      # PWA application manifest
├── package.json              # Project scripts & test command
├── privacy.html              # Privacy Policy (Local-first, zero-tracking)
├── robots.txt                # Search engine crawler instructions
├── security.txt              # Security disclosure policy
├── sitemap.xml               # XML sitemap
├── style.css                 # Production design system & dark mode tokens
├── terms.html                # Terms of Service
├── vercel.json               # Serverless routing & CSP security headers
├── api/
│   ├── _gemini.js            # Gemini API client with structured JSON output
│   ├── _rateLimiter.js       # Sliding-window IP rate limiter
│   ├── analyzeResume.js      # ATS keyword analysis endpoint
│   ├── getCareerAdvice.js    # Career recommendation endpoint
│   ├── getCoachResponse.js   # Contextual AI Coach endpoint
│   └── getInterviewPrep.js   # STAR interview practice generator
├── js/
│   ├── app.js                # Core UI coordinator & wizard logic
│   ├── data/
│   │   ├── careerCatalog.js  # Curated career specifications & metadata
│   │   └── curatedResources.js# Verified free documentation & tutorials
│   └── services/
│       ├── apiService.js     # Client API handler with fallback
│       ├── deterministicMatcher.js # 5-factor weighted scoring algorithm
│       ├── pdfService.js     # Printable report export engine
│       ├── readinessEngine.js# Multi-factor preparation model
│       ├── roadmapGenerator.js # 12-week personalized learning scheduler
│       ├── skillGapEngine.js # Competency gap analyzer
│       └── storageService.js # Local storage schema & JSON export/import
└── tests/
    ├── apiValidation.test.js
    ├── comparisonAndStorage.test.js
    ├── matcher.test.js
    ├── readiness.test.js
    ├── roadmap.test.js
    └── skillGap.test.js
```

---

## 🔒 Security & Privacy Notice

- **No Remote Tracking:** No third-party analytics, cookies, or trackers.
- **Client Storage:** All profile information remains in your browser unless you explicitly export it.
- **Report Security Vulnerabilities:** See [`security.txt`](/security.txt) for responsible disclosure.

---

## ⚖️ License & Disclaimer

- **License:** Open-source under the [MIT License](LICENSE).
- **Disclaimer:** CareerPath AI is an educational planning assistant. Fit scores and roadmaps represent estimated alignment and learning milestones. We do not promise employment, salaries, or interview callbacks. Consult official industry sources for compensation benchmarks.
