/**
 * CareerPath AI — Production Core Application
 * Orchestrates Onboarding Wizard, Deterministic Matching Engine,
 * Skill Gap Analysis, 12-Week Roadmap, AI Career Coach, and Export.
 */

import { careerCatalog } from './data/careerCatalog.js';
import { matchProfileToCareers } from './services/deterministicMatcher.js';
import { analyzeSkillGaps, getSkillGapSummary } from './services/skillGapEngine.js';
import { generatePersonalizedRoadmap } from './services/roadmapGenerator.js';
import { calculateReadinessScore } from './services/readinessEngine.js';
import { storageService } from './services/storageService.js';
import { apiService } from './services/apiService.js';
import { pdfService } from './services/pdfService.js';

// Application State
const appState = {
  currentStep: 1,
  totalSteps: 7,
  profile: {
    name: '',
    location: '',
    educationLevel: "Bachelor's Degree",
    studyField: 'Computer Science / IT',
    isStudentOrRecentGrad: false,
    experienceLevel: 'Entry-Level (0-1 yrs)',
    employmentStatus: 'Job Seeker',
    hasInternshipExperience: false,
    hasProjectExperience: true,
    skills: [
      { name: 'JavaScript', proficiency: 'Intermediate' },
      { name: 'HTML', proficiency: 'Advanced' },
      { name: 'CSS', proficiency: 'Intermediate' }
    ],
    interests: ['Software Development', 'Web Development'],
    targetRole: 'Full Stack Engineer',
    timeline: 'Medium-term (6-12 months)',
    workPreference: 'Remote',
    careerObjective: 'First Job',
    hoursAvailablePerWeek: 10,
    learningBudget: 'Free Only'
  },
  matches: [],
  selectedCareer: null,
  activeTab: 'overview',
  skillGaps: [],
  roadmap: null,
  roadmapDuration: 12,
  coachMessages: [],
  completedRoadmapWeeks: [],
  completedProjectIds: [],
  practicedInterviewQuestionIds: [],
  completedPlacementTopicIds: [],
  isAIActive: false,
  isGenerating: false,
  resumeAnalysis: null
};

// DOM References
const appContainer = document.getElementById('app');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const aiStatusBadge = document.getElementById('aiStatusBadge');
const coachFab = document.getElementById('coachFab');
const coachDrawer = document.getElementById('coachDrawer');
const closeCoachBtn = document.getElementById('closeCoachBtn');
const coachChatBody = document.getElementById('coachChatBody');
const coachForm = document.getElementById('coachForm');
const coachInput = document.getElementById('coachInput');
const brandLink = document.getElementById('brandLink');

// Modals
const backupModal = document.getElementById('backupModal');
const helpModal = document.getElementById('helpModal');
const shareModal = document.getElementById('shareModal');
const dataBackupBtn = document.getElementById('dataBackupBtn');
const helpSupportBtn = document.getElementById('helpSupportBtn');
const exportDataBtn = document.getElementById('exportDataBtn');
const importFileInput = document.getElementById('importFileInput');
const resetAllDataBtn = document.getElementById('resetAllDataBtn');
const shareSummaryText = document.getElementById('shareSummaryText');
const copyShareBtn = document.getElementById('copyShareBtn');
const nativeShareBtn = document.getElementById('nativeShareBtn');

// Initialize Application
export function initApp() {
  loadPersistedData();
  setupEventListeners();
  initTheme();

  // If a profile with matches exists, render results; else render onboarding wizard
  if (appState.matches.length > 0 && appState.selectedCareer) {
    renderResultsDashboard();
  } else {
    renderOnboardingWizard();
  }
}

function loadPersistedData() {
  const saved = storageService.loadData();
  if (saved.profile) {
    appState.profile = { ...appState.profile, ...saved.profile };
  }
  if (saved.completedRoadmapWeeks) {
    appState.completedRoadmapWeeks = saved.completedRoadmapWeeks;
  }
  if (saved.completedProjectIds) {
    appState.completedProjectIds = saved.completedProjectIds;
  }
  if (saved.practicedInterviewQuestionIds) {
    appState.practicedInterviewQuestionIds = saved.practicedInterviewQuestionIds;
  }
  if (saved.completedPlacementTopicIds) {
    appState.completedPlacementTopicIds = saved.completedPlacementTopicIds;
  }
  if (saved.roadmapDuration) {
    appState.roadmapDuration = saved.roadmapDuration;
  }
  if (saved.coachMessages && saved.coachMessages.length > 0) {
    appState.coachMessages = saved.coachMessages;
  }

  // Pre-calculate deterministic matches
  if (appState.profile.skills && appState.profile.skills.length > 0) {
    appState.matches = matchProfileToCareers(appState.profile, careerCatalog);
    const targetId = saved.selectedCareerId || appState.matches[0]?.career.id;
    appState.selectedCareer = careerCatalog.find(c => c.id === targetId) || appState.matches[0]?.career;
    refreshCareerDetails();
  }
}

function saveState() {
  storageService.saveData({
    profile: appState.profile,
    selectedCareerId: appState.selectedCareer?.id,
    completedRoadmapWeeks: appState.completedRoadmapWeeks,
    completedProjectIds: appState.completedProjectIds,
    practicedInterviewQuestionIds: appState.practicedInterviewQuestionIds,
    completedPlacementTopicIds: appState.completedPlacementTopicIds,
    roadmapDuration: appState.roadmapDuration || 12,
    coachMessages: appState.coachMessages
  });
}

function refreshCareerDetails() {
  if (!appState.selectedCareer) return;
  appState.skillGaps = analyzeSkillGaps(appState.profile.skills, appState.selectedCareer);
  appState.roadmap = generatePersonalizedRoadmap(
    appState.selectedCareer,
    appState.profile.skills,
    appState.profile.hoursAvailablePerWeek,
    appState.roadmapDuration || 12
  );
}

// -----------------------------------------------------------------------------
// Onboarding Wizard Rendering
// -----------------------------------------------------------------------------
function renderOnboardingWizard() {
  const step = appState.currentStep;

  let stepContent = '';
  if (step === 1) stepContent = renderStepProfile();
  else if (step === 2) stepContent = renderStepEducation();
  else if (step === 3) stepContent = renderStepExperience();
  else if (step === 4) stepContent = renderStepSkills();
  else if (step === 5) stepContent = renderStepInterests();
  else if (step === 6) stepContent = renderStepGoals();
  else if (step === 7) stepContent = renderStepConstraints();

  const stepperHtml = `
    <nav class="stepper" aria-label="Onboarding Progress">
      ${[1, 2, 3, 4, 5, 6, 7].map(s => `
        <div class="step-indicator ${s === step ? 'active' : ''} ${s < step ? 'completed' : ''}" aria-label="Step ${s} of 7">
          ${s < step ? '✓' : s}
        </div>
      `).join('')}
    </nav>
  `;

  appContainer.innerHTML = `
    <div style="max-width: 720px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <h1 style="font-size: 2rem; font-weight: 800; letter-spacing: -0.025em; margin-bottom: 0.5rem;">
          Build Your Career Path
        </h1>
        <p style="color: var(--text-muted); font-size: 0.95rem;">
          Step ${step} of 7: Tailoring your personal trajectory with privacy-conscious local analysis.
        </p>
      </div>

      ${stepperHtml}

      <div class="card" style="margin-top: 1.5rem;">
        ${stepContent}
      </div>
    </div>
  `;

  bindStepFormEvents();
}

function renderStepProfile() {
  return `
    <h2 style="font-size: 1.3rem; margin-bottom: 0.5rem;">Basic Profile</h2>
    <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">
      Name is optional. Your information stays local to your browser.
    </p>

    <div class="form-group">
      <label class="form-label" for="profileName">Preferred Name (Optional)</label>
      <input type="text" id="profileName" class="form-input" placeholder="e.g. Alex" value="${escapeAttr(appState.profile.name || '')}">
    </div>

    <div class="form-group">
      <label class="form-label" for="profileLocation">Location / Region</label>
      <input type="text" id="profileLocation" class="form-input" placeholder="e.g. India, North America, Europe, Remote" value="${escapeAttr(appState.profile.location || '')}">
      <span class="form-helper">Helps match region-appropriate career pathways.</span>
    </div>

    <div style="display: flex; justify-content: flex-end; margin-top: 2rem;">
      <button class="btn btn-primary" id="nextStepBtn">Next: Education →</button>
    </div>
  `;
}

function renderStepEducation() {
  const levels = ["Bachelor's Degree", "Master's Degree", 'Self-Taught / Bootcamp', 'Associate Degree', 'High School', 'Doctorate / PhD', 'Other'];
  return `
    <h2 style="font-size: 1.3rem; margin-bottom: 0.5rem;">Education & Background</h2>
    <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">
      Helps evaluate relevant transferable foundations.
    </p>

    <div class="form-group">
      <label class="form-label" for="educationLevel">Highest Education Level</label>
      <select id="educationLevel" class="form-select">
        ${levels.map(l => `<option value="${l}" ${appState.profile.educationLevel === l ? 'selected' : ''}>${l}</option>`).join('')}
      </select>
    </div>

    <div class="form-group">
      <label class="form-label" for="studyField">Field of Study / Background</label>
      <input type="text" id="studyField" class="form-input" placeholder="e.g. Computer Science, Mechanical Engineering, Arts, Business" value="${escapeAttr(appState.profile.studyField || '')}">
    </div>

    <div style="display: flex; justify-content: space-between; margin-top: 2rem;">
      <button class="btn btn-secondary" id="prevStepBtn">← Back</button>
      <button class="btn btn-primary" id="nextStepBtn">Next: Experience →</button>
    </div>
  `;
}

function renderStepExperience() {
  const expLevels = ['Student / Fresher', 'Entry-Level (0-1 yrs)', 'Early Career (1-3 yrs)', 'Mid-Level (3-5 yrs)', 'Senior (5+ yrs)'];
  const empStatuses = ['Job Seeker', 'Student', 'Freelancer', 'Employed Full-Time', 'Employed Part-Time', 'Career Switcher', 'Exploring'];

  return `
    <h2 style="font-size: 1.3rem; margin-bottom: 0.5rem;">Current Experience</h2>
    <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">
      Helps calibrate recommendations between entry milestones and advanced roles.
    </p>

    <div class="form-group">
      <label class="form-label" for="experienceLevel">Experience Level</label>
      <select id="experienceLevel" class="form-select">
        ${expLevels.map(e => `<option value="${e}" ${appState.profile.experienceLevel === e ? 'selected' : ''}>${e}</option>`).join('')}
      </select>
    </div>

    <div class="form-group">
      <label class="form-label" for="employmentStatus">Employment Status</label>
      <select id="employmentStatus" class="form-select">
        ${empStatuses.map(s => `<option value="${s}" ${appState.profile.employmentStatus === s ? 'selected' : ''}>${s}</option>`).join('')}
      </select>
    </div>

    <div style="display: flex; justify-content: space-between; margin-top: 2rem;">
      <button class="btn btn-secondary" id="prevStepBtn">← Back</button>
      <button class="btn btn-primary" id="nextStepBtn">Next: Skills →</button>
    </div>
  `;
}

function renderStepSkills() {
  const commonSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'HTML', 'CSS',
    'TypeScript', 'Docker', 'Kubernetes', 'Linux', 'AWS', 'Machine Learning',
    'Figma', 'UI Design', 'PostgreSQL', 'Tailwind CSS', 'REST APIs', 'Statistics'
  ];

  const currentSkillChips = (appState.profile.skills || []).map((s, idx) => `
    <span class="chip selected">
      <strong>${escapeHtml(s.name)}</strong> (${s.proficiency})
      <button type="button" class="chip-remove" data-remove-skill="${idx}" aria-label="Remove ${escapeAttr(s.name)}">×</button>
    </span>
  `).join('');

  return `
    <h2 style="font-size: 1.3rem; margin-bottom: 0.5rem;">Skills &amp; Competencies</h2>
    <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">
      Add your technical and domain skills with self-assessed proficiency.
    </p>

    <div class="form-group" style="background: var(--bg-card-subtle); padding: 1rem; border-radius: var(--radius-md);">
      <label class="form-label" for="skillSearchInput">Add a Skill</label>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <input type="text" id="skillSearchInput" class="form-input" placeholder="Type a skill (e.g. Python, React)..." style="flex: 1; min-width: 200px;">
        <select id="skillProficiencyInput" class="form-select" style="width: auto;">
          <option value="Beginner">Beginner</option>
          <option value="Intermediate" selected>Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <button type="button" class="btn btn-primary" id="addSkillBtn">+ Add</button>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Your Active Skills (${appState.profile.skills.length})</label>
      <div class="chips-container" id="activeSkillsContainer">
        ${currentSkillChips.length ? currentSkillChips : '<span style="color: var(--text-muted); font-size: 0.85rem;">No skills added yet. Click suggestions below or type a skill above.</span>'}
      </div>
    </div>

    <div class="form-group" style="margin-top: 1.5rem;">
      <label class="form-label" style="font-size: 0.8rem; color: var(--text-muted);">Quick Suggestions</label>
      <div class="chips-container">
        ${commonSkills.map(skill => `
          <button type="button" class="chip quick-add-skill" data-skill-name="${skill}">+ ${skill}</button>
        `).join('')}
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; margin-top: 2rem;">
      <button class="btn btn-secondary" id="prevStepBtn">← Back</button>
      <button class="btn btn-primary" id="nextStepBtn" ${appState.profile.skills.length === 0 ? 'disabled' : ''}>Next: Interests →</button>
    </div>
  `;
}

function renderStepInterests() {
  const domains = [
    'Software Development', 'Web Development', 'Artificial Intelligence',
    'Machine Learning', 'Cloud & DevOps', 'Cybersecurity', 'UI/UX Design',
    'Data Science & Analytics', 'Mobile Development', 'Distributed Systems'
  ];

  return `
    <h2 style="font-size: 1.3rem; margin-bottom: 0.5rem;">Domain Interests</h2>
    <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">
      Select the technology domains you are genuinely excited to work in.
    </p>

    <div class="chips-container" style="gap: 0.75rem;">
      ${domains.map(dom => {
        const isSel = (appState.profile.interests || []).includes(dom);
        return `
          <button type="button" class="chip ${isSel ? 'selected' : ''} domain-toggle-chip" data-domain="${dom}" style="padding: 0.5rem 1rem; font-size: 0.9rem;">
            ${isSel ? '✓' : '+'} ${dom}
          </button>
        `;
      }).join('')}
    </div>

    <div style="display: flex; justify-content: space-between; margin-top: 2rem;">
      <button class="btn btn-secondary" id="prevStepBtn">← Back</button>
      <button class="btn btn-primary" id="nextStepBtn" ${(appState.profile.interests || []).length === 0 ? 'disabled' : ''}>Next: Goals →</button>
    </div>
  `;
}

function renderStepGoals() {
  const preferences = ['Remote', 'Hybrid', 'On-site', 'Flexible'];
  const timelines = ['Immediate (1-3 months)', 'Short-term (3-6 months)', 'Medium-term (6-12 months)', 'Long-term (1+ years)'];
  const objectives = ['First Job', 'Career Switch', 'Promotion', 'Freelancing', 'Higher Studies'];

  return `
    <h2 style="font-size: 1.3rem; margin-bottom: 0.5rem;">Career Goals</h2>
    <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">
      Define your aspirations so we can tailor roadmap milestones.
    </p>

    <div class="form-group">
      <label class="form-label" for="targetRole">Target Role or Direction (Optional)</label>
      <input type="text" id="targetRole" class="form-input" placeholder="e.g. Full Stack Developer, Data Scientist" value="${escapeAttr(appState.profile.targetRole || '')}">
      <div style="margin-top: 0.6rem;">
        <span style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.4rem;">
          💡 <strong>Undecided or exploring?</strong> Click a domain below to auto-fill or leave empty to match purely on your skills:
        </span>
        <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
          <button type="button" class="btn btn-secondary btn-sm explore-role-chip" data-role="Frontend Engineer">🎨 Visual Apps &amp; UI</button>
          <button type="button" class="btn btn-secondary btn-sm explore-role-chip" data-role="Backend Engineer">⚙️ Logic &amp; Databases</button>
          <button type="button" class="btn btn-secondary btn-sm explore-role-chip" data-role="Full Stack Engineer">🌐 End-to-End Web</button>
          <button type="button" class="btn btn-secondary btn-sm explore-role-chip" data-role="Data Scientist">📊 Data &amp; Machine Learning</button>
          <button type="button" class="btn btn-secondary btn-sm explore-role-chip" data-role="Cloud &amp; DevOps Engineer">☁️ Cloud &amp; DevOps</button>
          <button type="button" class="btn btn-secondary btn-sm explore-role-chip" data-role="Cybersecurity Analyst">🛡️ Security &amp; Networks</button>
          <button type="button" class="btn btn-secondary btn-sm explore-role-chip" data-role="" style="font-style: italic;">✨ Match Based on My Skills</button>
        </div>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label" for="careerObjective">Primary Objective</label>
      <select id="careerObjective" class="form-select">
        ${objectives.map(o => `<option value="${o}" ${appState.profile.careerObjective === o ? 'selected' : ''}>${o}</option>`).join('')}
      </select>
    </div>

    <div class="grid-2">
      <div class="form-group">
        <label class="form-label" for="goalTimeline">Target Timeline</label>
        <select id="goalTimeline" class="form-select">
          ${timelines.map(t => `<option value="${t}" ${appState.profile.timeline === t ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="workPreference">Work Style Preference</label>
        <select id="workPreference" class="form-select">
          ${preferences.map(p => `<option value="${p}" ${appState.profile.workPreference === p ? 'selected' : ''}>${p}</option>`).join('')}
        </select>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; margin-top: 2rem;">
      <button class="btn btn-secondary" id="prevStepBtn">← Back</button>
      <button class="btn btn-primary" id="nextStepBtn">Next: Constraints →</button>
    </div>
  `;
}

function renderStepConstraints() {
  return `
    <h2 style="font-size: 1.3rem; margin-bottom: 0.5rem;">Weekly Budget &amp; Constraints</h2>
    <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem;">
      We adapt your 12-week roadmap so you never get overloaded.
    </p>

    <div class="form-group">
      <label class="form-label" for="weeklyHoursRange">
        Available Study Hours Per Week: <strong id="hoursDisplay">${appState.profile.hoursAvailablePerWeek || 10} hrs/week</strong>
      </label>
      <input type="range" id="weeklyHoursRange" min="4" max="40" step="2" value="${appState.profile.hoursAvailablePerWeek || 10}" style="width: 100%;">
      <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">
        <span>4 hrs (Casual)</span>
        <span>10-15 hrs (Recommended)</span>
        <span>40 hrs (Full-time Bootcamp)</span>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label" for="learningBudget">Resource Cost Preference</label>
      <select id="learningBudget" class="form-select">
        <option value="Free Only" ${appState.profile.learningBudget === 'Free Only' ? 'selected' : ''}>100% Free / Open-Source Resources Only</option>
        <option value="Low Budget (< $50)" ${appState.profile.learningBudget === 'Low Budget (< $50)' ? 'selected' : ''}>Low Budget (< $50)</option>
        <option value="Flexible" ${appState.profile.learningBudget === 'Flexible' ? 'selected' : ''}>Flexible</option>
      </select>
    </div>

    <div style="display: flex; justify-content: space-between; margin-top: 2rem;">
      <button class="btn btn-secondary" id="prevStepBtn">← Back</button>
      <button class="btn btn-primary btn-lg" id="generateResultsBtn">
        <span>🚀</span> Generate My Career Plan
      </button>
    </div>
  `;
}

function bindStepFormEvents() {
  const step = appState.currentStep;

  // Next & Prev button bindings
  const nextBtn = document.getElementById('nextStepBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      saveCurrentStepInputs();
      if (appState.currentStep < appState.totalSteps) {
        appState.currentStep++;
        renderOnboardingWizard();
      }
    });
  }

  const prevBtn = document.getElementById('prevStepBtn');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      saveCurrentStepInputs();
      if (appState.currentStep > 1) {
        appState.currentStep--;
        renderOnboardingWizard();
      }
    });
  }

  // Generate Results button on Step 7
  const generateBtn = document.getElementById('generateResultsBtn');
  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      saveCurrentStepInputs();
      executeCareerGeneration();
    });
  }

  // Step 4: Add Skill button & Suggestion chips
  if (step === 4) {
    const addSkillBtn = document.getElementById('addSkillBtn');
    const skillInput = document.getElementById('skillSearchInput');
    const profInput = document.getElementById('skillProficiencyInput');

    const handleAdd = () => {
      const val = skillInput.value.trim();
      if (!val) return;
      const exists = appState.profile.skills.some(s => s.name.toLowerCase() === val.toLowerCase());
      if (!exists) {
        appState.profile.skills.push({ name: val, proficiency: profInput.value });
        saveState();
        renderOnboardingWizard();
      }
      skillInput.value = '';
    };

    if (addSkillBtn) addSkillBtn.addEventListener('click', handleAdd);
    if (skillInput) {
      skillInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleAdd();
        }
      });
    }

    // Quick add chips
    document.querySelectorAll('.quick-add-skill').forEach(btn => {
      btn.addEventListener('click', () => {
        const skillName = btn.dataset.skillName;
        const exists = appState.profile.skills.some(s => s.name.toLowerCase() === skillName.toLowerCase());
        if (!exists) {
          appState.profile.skills.push({ name: skillName, proficiency: 'Intermediate' });
          saveState();
          renderOnboardingWizard();
        }
      });
    });

    // Remove skill chip
    document.querySelectorAll('[data-remove-skill]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.removeSkill, 10);
        appState.profile.skills.splice(idx, 1);
        saveState();
        renderOnboardingWizard();
      });
    });
  }

  // Step 5: Domain toggle chips
  if (step === 5) {
    document.querySelectorAll('.domain-toggle-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const domain = btn.dataset.domain;
        const list = appState.profile.interests || [];
        const idx = list.indexOf(domain);
        if (idx >= 0) list.splice(idx, 1);
        else list.push(domain);
        appState.profile.interests = list;
        saveState();
        renderOnboardingWizard();
      });
    });
  }

  // Step 6: Quick exploration chips for undecided students
  if (step === 6) {
    document.querySelectorAll('.explore-role-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const role = btn.dataset.role;
        const input = document.getElementById('targetRole');
        if (input) {
          input.value = role;
          appState.profile.targetRole = role;
          saveState();
        }
      });
    });
  }

  // Step 7: Range slider sync
  if (step === 7) {
    const slider = document.getElementById('weeklyHoursRange');
    const display = document.getElementById('hoursDisplay');
    if (slider && display) {
      slider.addEventListener('input', () => {
        display.textContent = `${slider.value} hrs/week`;
        appState.profile.hoursAvailablePerWeek = parseInt(slider.value, 10);
      });
    }
  }
}

function saveCurrentStepInputs() {
  const step = appState.currentStep;
  if (step === 1) {
    const nameEl = document.getElementById('profileName');
    const locEl = document.getElementById('profileLocation');
    if (nameEl) appState.profile.name = nameEl.value.trim();
    if (locEl) appState.profile.location = locEl.value.trim();
  } else if (step === 2) {
    const eduEl = document.getElementById('educationLevel');
    const fieldEl = document.getElementById('studyField');
    if (eduEl) appState.profile.educationLevel = eduEl.value;
    if (fieldEl) appState.profile.studyField = fieldEl.value.trim();
  } else if (step === 3) {
    const expEl = document.getElementById('experienceLevel');
    const statusEl = document.getElementById('employmentStatus');
    if (expEl) appState.profile.experienceLevel = expEl.value;
    if (statusEl) appState.profile.employmentStatus = statusEl.value;
  } else if (step === 6) {
    const targetEl = document.getElementById('targetRole');
    const objEl = document.getElementById('careerObjective');
    const timeEl = document.getElementById('goalTimeline');
    const prefEl = document.getElementById('workPreference');
    if (targetEl) appState.profile.targetRole = targetEl.value.trim();
    if (objEl) appState.profile.careerObjective = objEl.value;
    if (timeEl) appState.profile.timeline = timeEl.value;
    if (prefEl) appState.profile.workPreference = prefEl.value;
  } else if (step === 7) {
    const budgetEl = document.getElementById('learningBudget');
    if (budgetEl) appState.profile.learningBudget = budgetEl.value;
  }
  saveState();
}

// -----------------------------------------------------------------------------
// Generation & Matching Execution
// -----------------------------------------------------------------------------
async function executeCareerGeneration() {
  // Show loading state
  appContainer.innerHTML = `
    <div style="text-align: center; padding: 4rem 1rem;">
      <div style="font-size: 3rem; margin-bottom: 1rem; animation: pulse 1.5s infinite;">⚡</div>
      <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">Analyzing Your Career Matches...</h2>
      <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 1.5rem;">
        Running multi-dimensional deterministic matching against ${careerCatalog.length} role frameworks.
      </p>
      <div class="meter-container" style="max-width: 320px; margin: 0 auto;">
        <div class="meter-fill" style="width: 75%;"></div>
      </div>
    </div>
  `;

  // 1. Instant Deterministic Matching
  appState.matches = matchProfileToCareers(appState.profile, careerCatalog);
  appState.selectedCareer = appState.matches[0]?.career || careerCatalog[0];
  refreshCareerDetails();
  saveState();

  // 2. Optional Serverless Gemini AI Personalization
  try {
    const apiRes = await apiService.getCareerAdvice(appState.profile);
    if (apiRes.success && Array.isArray(apiRes.data)) {
      appState.isAIActive = true;
      updateStatusBadge(true);

      // Merge AI insights with deterministic matches
      apiRes.data.forEach(aiItem => {
        const found = appState.matches.find(m => 
          m.career.title.toLowerCase().includes(aiItem.careerTitle?.toLowerCase()) ||
          aiItem.careerTitle?.toLowerCase().includes(m.career.title.toLowerCase())
        );
        if (found) {
          found.fitExplanation = aiItem.personalizedSummary || found.fitExplanation;
          found.isAIPersonalized = true;
          if (aiItem.recommendedProject) {
            found.career.portfolioProjectIdeas.unshift(
              `${aiItem.recommendedProject.title}: ${aiItem.recommendedProject.description}`
            );
          }
        }
      });
    } else {
      appState.isAIActive = false;
      updateStatusBadge(false);
    }
  } catch (err) {
    console.warn('AI personalization skipped. Local Guidance Mode remains active.');
    appState.isAIActive = false;
    updateStatusBadge(false);
  }

  renderResultsDashboard();
}

function updateStatusBadge(isAI) {
  if (isAI) {
    aiStatusBadge.className = 'badge badge-ai';
    aiStatusBadge.innerHTML = '<span aria-hidden="true">✨</span> AI-Enhanced Mode';
    aiStatusBadge.title = 'Personalized using Google Gemini';
  } else {
    aiStatusBadge.className = 'badge badge-local';
    aiStatusBadge.innerHTML = '<span aria-hidden="true">⚡</span> Local Guidance Mode';
    aiStatusBadge.title = 'Zero-cost, privacy-first deterministic matching';
  }
}

// -----------------------------------------------------------------------------
// Results Dashboard Rendering
// -----------------------------------------------------------------------------
function renderResultsDashboard() {
  if (!appState.selectedCareer) return;

  const topMatches = appState.matches.slice(0, 3);
  const selectedMatch = appState.matches.find(m => m.career.id === appState.selectedCareer.id) || appState.matches[0];
  const readiness = calculateReadinessScore({
    skillGaps: appState.skillGaps,
    completedRoadmapWeeks: appState.completedRoadmapWeeks,
    totalRoadmapWeeks: appState.roadmap?.totalWeeks || appState.roadmapDuration || 12,
    completedProjects: appState.completedProjectIds,
    practicedInterviewQuestions: appState.practicedInterviewQuestionIds
  });

  const cardsHtml = topMatches.map((m, idx) => {
    const isSel = m.career.id === appState.selectedCareer.id;
    return `
      <div class="card card-interactive ${isSel ? 'selected' : ''}" style="${isSel ? 'border-color: var(--primary); background: var(--bg-card);' : ''}" data-select-career="${m.career.id}">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--primary);">#${idx + 1} Match</span>
          <span class="badge ${m.overallScore >= 75 ? 'badge-success' : 'badge-local'}">${m.overallScore}% Fit</span>
        </div>
        <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.35rem;">${escapeHtml(m.career.title)}</h3>
        <p style="font-size: 0.825rem; color: var(--text-muted); margin-bottom: 0.75rem; line-height: 1.4;">
          ${escapeHtml(m.career.description.slice(0, 110))}...
        </p>
        <button class="btn btn-sm ${isSel ? 'btn-primary' : 'btn-secondary'}" style="width: 100%;">
          ${isSel ? 'Active Trajectory' : 'View Trajectory'}
        </button>
      </div>
    `;
  }).join('');

  let tabContent = '';
  if (appState.activeTab === 'overview') tabContent = renderTabOverview(selectedMatch);
  else if (appState.activeTab === 'skillgap') tabContent = renderTabSkillGap();
  else if (appState.activeTab === 'roadmap') tabContent = renderTabRoadmap();
  else if (appState.activeTab === 'placement') tabContent = renderTabPlacement();
  else if (appState.activeTab === 'projects') tabContent = renderTabProjects();
  else if (appState.activeTab === 'interview') tabContent = renderTabInterview();
  else if (appState.activeTab === 'resume') tabContent = renderTabResume();
  else if (appState.activeTab === 'readiness') tabContent = renderTabReadiness(readiness);
  else if (appState.activeTab === 'compare') tabContent = renderTabCompare();

  appContainer.innerHTML = `
    <!-- Top Action Banner -->
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
      <div>
        <h1 style="font-size: 1.6rem; font-weight: 800;">Your Recommended Trajectories</h1>
        <p style="color: var(--text-muted); font-size: 0.875rem;">
          Profile-based match estimate: <strong style="color: var(--text-main);">${selectedMatch.overallScore}% Fit</strong> with ${escapeHtml(appState.selectedCareer.title)}.
        </p>
      </div>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button id="editProfileBtn" class="btn btn-secondary btn-sm">
          <span>✏️</span> Edit Profile
        </button>
        <button id="shareResultsBtn" class="btn btn-secondary btn-sm">
          <span>📤</span> Share Summary
        </button>
        <button id="exportPdfBtn" class="btn btn-primary btn-sm">
          <span>📄</span> Export Report (PDF)
        </button>
      </div>
    </div>

    <!-- Top 3 Career Cards -->
    <div class="grid-3" style="margin-bottom: 2rem;">
      ${cardsHtml}
    </div>

    <!-- Career Detail Section with Tabs -->
    <div class="card" style="padding: 1.75rem;">
      <div style="margin-bottom: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.25rem;">
          <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-main);">${escapeHtml(appState.selectedCareer.title)}</h2>
          <span class="badge ${selectedMatch.isAIPersonalized ? 'badge-ai' : 'badge-local'}">
            ${selectedMatch.isAIPersonalized ? '✨ AI-Personalized' : '⚡ Local Analysis'}
          </span>
        </div>
        <p style="color: var(--text-muted); font-size: 0.925rem;">${escapeHtml(selectedMatch.fitExplanation)}</p>
      </div>

      <!-- Navigation Tabs -->
      <nav class="tabs-nav" aria-label="Career Details Tabs">
        <button class="tab-btn ${appState.activeTab === 'overview' ? 'active' : ''}" data-tab="overview">Overview &amp; Fit</button>
        <button class="tab-btn ${appState.activeTab === 'skillgap' ? 'active' : ''}" data-tab="skillgap">Skill Gap Matrix</button>
        <button class="tab-btn ${appState.activeTab === 'roadmap' ? 'active' : ''}" data-tab="roadmap">Learning Roadmap</button>
        <button class="tab-btn ${appState.activeTab === 'placement' ? 'active' : ''}" data-tab="placement">Campus &amp; Placement Prep</button>
        <button class="tab-btn ${appState.activeTab === 'projects' ? 'active' : ''}" data-tab="projects">Portfolio Projects</button>
        <button class="tab-btn ${appState.activeTab === 'interview' ? 'active' : ''}" data-tab="interview">Interview Prep</button>
        <button class="tab-btn ${appState.activeTab === 'resume' ? 'active' : ''}" data-tab="resume">Resume Assistant</button>
        <button class="tab-btn ${appState.activeTab === 'readiness' ? 'active' : ''}" data-tab="readiness">Career Readiness (${readiness.overallScore}%)</button>
        <button class="tab-btn ${appState.activeTab === 'compare' ? 'active' : ''}" data-tab="compare">Compare Roles</button>
      </nav>

      <!-- Active Tab Panel -->
      <div id="tabPanel" style="animation: fadeIn 0.2s ease-out;">
        ${tabContent}
      </div>
    </div>
  `;

  bindResultsEvents();
}

function renderTabOverview(match) {
  const c = appState.selectedCareer;
  const week1 = appState.roadmap?.weeks?.[0];
  const weeklyHours = appState.profile.hoursAvailablePerWeek || 10;

  return `
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <!-- Student Action Plan: What to Do This Week -->
      <div class="card" style="background: linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(6, 182, 212, 0.08)); border: 1px solid var(--primary-border); padding: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.75rem;">
          <div>
            <span class="badge badge-ai" style="margin-bottom: 0.35rem;">🚀 Immediate Action Plan</span>
            <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-main);">
              What Should You Do This Week? (Week 1 of 12)
            </h3>
          </div>
          <button class="btn btn-primary btn-sm" data-jump-tab="roadmap">
            Open Full 12-Week Roadmap →
          </button>
        </div>
        <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.75rem;">
          Tailored to your <strong>${weeklyHours} hours/week</strong> available study budget for <strong>${escapeHtml(c.title)}</strong>:
        </p>
        <div style="background: var(--bg-card); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
            <strong style="color: var(--primary); font-size: 0.95rem;">${escapeHtml(week1?.title || 'Environment & Core Foundations Setup')}</strong>
            <span class="badge badge-local">${weeklyHours} hrs planned</span>
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 0.5rem;">
            <strong>Immediate Milestone:</strong> ${escapeHtml(week1?.handsOnProjectMilestone || 'Set up your learning repository and practice core concepts.')}
          </p>
          <div style="font-size: 0.8rem; color: var(--text-muted);">
            <strong>Weekly Objectives:</strong> ${(week1?.objectives || []).slice(0, 2).map(o => escapeHtml(o)).join(' &bull; ')}
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div>
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--primary);">Key Responsibilities</h3>
          <ul style="padding-left: 1.25rem; font-size: 0.875rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.4rem;">
            ${(c.responsibilities || []).map(r => `<li>${escapeHtml(r)}</li>`).join('')}
          </ul>
        </div>
        <div>
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--primary);">Transferable Skills &amp; Strengths</h3>
          <div class="chips-container" style="margin-bottom: 1rem;">
            ${(match.contributingSkills || []).map(s => `<span class="chip selected">${escapeHtml(s)}</span>`).join('')}
            ${(match.transferableSkills || []).map(t => `<span class="chip">${escapeHtml(t)}</span>`).join('')}
          </div>
          <h4 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 0.25rem;">Sample Job Titles</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted);">${(c.sampleJobTitles || []).join(' &bull; ')}</p>
        </div>
      </div>

      <!-- Student & Fresher Strategy Guide -->
      <div class="grid-2">
        <div class="card" style="background: var(--bg-card-subtle); padding: 1.25rem;">
          <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--primary);">
            🎯 For Students &amp; Freshers: How to Stand Out
          </h4>
          <ul style="padding-left: 1.25rem; font-size: 0.85rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.4rem;">
            <li><strong>Deploy Live Applications:</strong> Always host working demos on Vercel or GitHub Pages. Hiring managers test live links much more often than raw code repos.</li>
            <li><strong>Visible Git History:</strong> Commit incrementally as you build to demonstrate authentic engineering curiosity and problem solving.</li>
            <li><strong>Document Architecture:</strong> Write clear README explanations describing architectural tradeoffs and technical obstacles you conquered.</li>
          </ul>
        </div>

        <div class="card" style="background: var(--bg-card-subtle); padding: 1.25rem;">
          <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--accent);">
            💼 Internship &amp; Campus Placement Readiness
          </h4>
          <ul style="padding-left: 1.25rem; font-size: 0.85rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.4rem;">
            <li><strong>Core Competencies First:</strong> Campus recruiters prioritize fundamental problem solving and clean coding over framework trivia.</li>
            <li><strong>STAR Behavioral Framework:</strong> Prepare 3 real project stories (Situation, Task, Action, Result) for behavioral interview rounds.</li>
            <li><strong>Realistic Dedication:</strong> Consistent 8-12 week structured practice reliably builds genuine entry-level job confidence.</li>
          </ul>
        </div>
      </div>

      <div style="background: var(--bg-card-subtle); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border);">
        <h3 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem;">Compensation &amp; Market Notice</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">${escapeHtml(c.indicativeCompensationNotice)}</p>
        <span style="font-size: 0.775rem; color: var(--text-muted); font-style: italic;">
          CareerPath AI does not fabricate live salaries. We encourage consulting verified platforms such as Levels.fyi or the Stack Overflow Developer Survey.
        </span>
      </div>
    </div>
  `;
}

function renderTabSkillGap() {
  const gaps = appState.skillGaps;
  const summary = getSkillGapSummary(gaps);

  const rows = gaps.map(g => {
    let badgeClass = 'badge-local';
    if (g.status === 'Strong') badgeClass = 'badge-success';
    else if (g.status === 'Ready') badgeClass = 'badge-ai';
    else if (g.status === 'Missing') badgeClass = 'badge';

    return `
      <tr>
        <td><strong>${escapeHtml(g.skill)}</strong></td>
        <td><span style="font-size: 0.75rem; color: var(--text-muted);">${g.category}</span></td>
        <td>${g.requiredLevel}</td>
        <td>${g.userLevel}</td>
        <td><span class="badge ${badgeClass}">${g.status}</span></td>
        <td><span style="color: ${g.priority === 'High' ? 'var(--danger)' : 'var(--text-muted)'}; font-weight: 600;">${g.priority}</span></td>
        <td style="font-size: 0.85rem;">${escapeHtml(g.action)}</td>
      </tr>
    `;
  }).join('');

  return `
    <div>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
        <div class="card" style="flex: 1; min-width: 140px; padding: 0.75rem 1rem;">
          <div style="font-size: 0.8rem; color: var(--text-muted);">Skill Coverage</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary);">${summary.coveragePct}%</div>
        </div>
        <div class="card" style="flex: 1; min-width: 140px; padding: 0.75rem 1rem;">
          <div style="font-size: 0.8rem; color: var(--text-muted);">Strong Competencies</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--success);">${summary.strong}</div>
        </div>
        <div class="card" style="flex: 1; min-width: 140px; padding: 0.75rem 1rem;">
          <div style="font-size: 0.8rem; color: var(--text-muted);">Ready / Moderate</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent);">${summary.ready}</div>
        </div>
        <div class="card" style="flex: 1; min-width: 140px; padding: 0.75rem 1rem;">
          <div style="font-size: 0.8rem; color: var(--text-muted);">Priority Gaps</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--danger);">${summary.missing}</div>
        </div>
      </div>

      <div style="overflow-x: auto;">
        <table class="matrix-table" aria-label="Skill Gap Competency Table">
          <thead>
            <tr>
              <th>Skill</th>
              <th>Type</th>
              <th>Target</th>
              <th>Current</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Recommended Action</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderTabRoadmap() {
  const rm = appState.roadmap;
  if (!rm) return '<p>Roadmap unavailable.</p>';

  const weeksHtml = rm.weeks.map(w => {
    const isCompleted = appState.completedRoadmapWeeks.includes(w.week);
    return `
      <div class="card" style="margin-bottom: 1rem; border-left: 4px solid ${isCompleted ? 'var(--success)' : 'var(--primary)'}; background: ${isCompleted ? 'var(--bg-card-subtle)' : 'var(--bg-card)'};">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap;">
          <div>
            <span class="badge ${isCompleted ? 'badge-success' : 'badge-ai'}" style="margin-bottom: 0.35rem;">
              Week ${w.week} &bull; ${w.phase}
            </span>
            <h3 style="font-size: 1.1rem; font-weight: 700; margin: 0.2rem 0;">${escapeHtml(w.title)}</h3>
          </div>
          <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.85rem; font-weight: 600;">
            <input type="checkbox" class="toggle-week-checkbox" data-week="${w.week}" ${isCompleted ? 'checked' : ''} style="width: 18px; height: 18px;">
            ${isCompleted ? 'Completed ✓' : 'Mark Completed'}
          </label>
        </div>

        <div style="margin: 0.75rem 0; font-size: 0.875rem;">
          <strong>Objectives:</strong>
          <ul style="padding-left: 1.25rem; margin-top: 0.25rem; color: var(--text-muted);">
            ${w.objectives.map(o => `<li>${escapeHtml(o)}</li>`).join('')}
          </ul>
        </div>

        <div style="font-size: 0.85rem; background: var(--bg-main); padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border);">
          <div><strong>Hands-On Milestone:</strong> ${escapeHtml(w.handsOnProjectMilestone)}</div>
          <div style="color: var(--text-muted); margin-top: 0.25rem;"><strong>Practice Task:</strong> ${escapeHtml(w.practiceTask)}</div>
          ${w.suggestedResource ? `
            <div style="margin-top: 0.4rem;">
              <a href="${w.suggestedResource.url}" target="_blank" rel="noopener noreferrer" style="color: var(--primary); font-weight: 600; text-decoration: none;">
                🔗 ${escapeHtml(w.suggestedResource.title)} (${w.suggestedResource.provider}) →
              </a>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  const completedCount = appState.completedRoadmapWeeks.filter(w => w <= rm.totalWeeks).length;

  return `
    <div>
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
        <div>
          <h3 style="font-size: 1.15rem; font-weight: 700;">Personalized Learning Schedule</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted);">
            Paced for your budget of <strong>${rm.adaptedWeeklyHours} hours/week</strong> (${escapeHtml(rm.effortDescriptor)}). Check off weeks as you progress!
          </p>
        </div>
        <div style="display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap;">
          <span style="font-size: 0.8rem; color: var(--text-muted); margin-right: 0.25rem;">Duration:</span>
          <button class="btn btn-sm ${rm.totalWeeks === 4 ? 'btn-primary' : 'btn-secondary'}" data-set-roadmap-duration="4">
            ⚡ 4-Week Sprint
          </button>
          <button class="btn btn-sm ${rm.totalWeeks === 8 ? 'btn-primary' : 'btn-secondary'}" data-set-roadmap-duration="8">
            🏗️ 8-Week Foundation
          </button>
          <button class="btn btn-sm ${rm.totalWeeks === 12 ? 'btn-primary' : 'btn-secondary'}" data-set-roadmap-duration="12">
            🎯 12-Week Comprehensive
          </button>
          <span class="badge badge-success" style="margin-left: 0.5rem;">${completedCount} / ${rm.totalWeeks} Weeks Done</span>
        </div>
      </div>
      ${weeksHtml}
    </div>
  `;
}

function renderTabPlacement() {
  const c = appState.selectedCareer;
  const completedTopics = appState.completedPlacementTopicIds || [];

  const coreCSTopics = [
    {
      id: 'cs-oop',
      title: 'Object-Oriented Programming (OOP)',
      description: 'Encapsulation, Inheritance, Polymorphism, Abstraction, and SOLID principles (Single Responsibility, Open-Closed, Liskov, Interface Segregation, Dependency Inversion).',
      interviewerLookout: 'Can you demonstrate runtime polymorphism vs compile-time polymorphism with code, and explain why composition is often preferred over deep inheritance hierarchies?'
    },
    {
      id: 'cs-dbms',
      title: 'Database Management Systems (DBMS)',
      description: 'ACID guarantees, SQL Joins (INNER, LEFT, RIGHT, FULL), Normalization (1NF through 3NF), B-Tree indexing mechanisms, Transactions, and Locking vs Concurrency.',
      interviewerLookout: 'Can you explain why indexing speeds up SELECT queries but adds write overhead, and how to debug a slow query using EXPLAIN ANALYZE?'
    },
    {
      id: 'cs-os',
      title: 'Operating Systems (OS)',
      description: 'Process vs Thread, Virtual Memory & Paging, CPU Scheduling algorithms, Inter-Process Communication (IPC), Deadlock conditions (Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait).',
      interviewerLookout: 'Explain what happens during a Context Switch, and the difference between multi-threading and multi-processing.'
    },
    {
      id: 'cs-networks',
      title: 'Computer Networks (CN)',
      description: 'OSI 7-Layer reference model, TCP vs UDP, TCP 3-Way Handshake, DNS resolution journey, HTTP/1.1 vs HTTP/2 multiplexing, CORS headers, and SSL/TLS handshake.',
      interviewerLookout: 'Walk through everything that happens from the millisecond a user presses Enter on a URL in their browser until the webpage renders.'
    }
  ];

  const dsaPatterns = [
    {
      id: 'dsa-twopointers',
      pattern: 'Two Pointers & Sliding Window',
      applications: 'Array subarray sums, palindrome verification, trapped rainwater, anagram substrings.',
      difficulty: 'High Yield for Freshers'
    },
    {
      id: 'dsa-hashmap',
      pattern: 'Hash Maps & Frequency Arrays',
      applications: 'Two-Sum, group anagrams, LRU Cache baseline, longest consecutive sequence.',
      difficulty: 'High Yield for Freshers'
    },
    {
      id: 'dsa-fastslow',
      pattern: 'Fast & Slow Pointers (Floyd Cycle)',
      applications: 'Detecting loops in linked lists, finding middle node in a single pass.',
      difficulty: 'Medium Yield'
    },
    {
      id: 'dsa-binarysearch',
      pattern: 'Binary Search on Range / Answer',
      applications: 'Rotated sorted arrays, peak finding, allocation problems (Koko eating bananas).',
      difficulty: 'High Yield'
    },
    {
      id: 'dsa-trees',
      pattern: 'Tree Traversals (BFS & DFS)',
      applications: 'Level-order traversal, lowest common ancestor (LCA), max depth, path sum.',
      difficulty: 'High Yield'
    }
  ];

  const placementRounds = [
    {
      round: 'Round 1: Online Assessment (OA)',
      focus: 'Aptitude & DSA Coding (60-90 min)',
      strategy: 'Solve 2-3 algorithmic problems. Focus on passing all edge cases (empty inputs, single element, large numbers). Time complexity must meet constraints (usually O(N) or O(N log N)).'
    },
    {
      round: 'Round 2: Technical Interview (Core CS & DSA)',
      focus: 'Live Coding & CS Fundamentals (45-60 min)',
      strategy: 'Think aloud! Write clean variable names, state time & space complexity upfront, test your own code with edge cases before saying you are done. Answer CS questions with real architectural examples.'
    },
    {
      round: 'Round 3: Project Deep-Dive & Architecture',
      focus: 'Portfolio Code Review (45 min)',
      strategy: 'Know every line of code on your GitHub projects. Explain why you chose your tech stack, what bottlenecks you hit, and how you deployed it. Use the STAR framework.'
    },
    {
      round: 'Round 4: HR & Cultural Alignment',
      focus: 'Behavioral Scenarios & Motivation (30 min)',
      strategy: 'Show genuine curiosity about company engineering practices. Prepare 3 thoughtful questions for the interviewer. Be honest about learning curves.'
    }
  ];

  return `
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <!-- Header Banner -->
      <div class="card" style="background: linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(16, 185, 129, 0.08)); border: 1px solid var(--primary-border); padding: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <span class="badge badge-ai" style="margin-bottom: 0.35rem;">🎓 Student &amp; Fresher Preparation Hub</span>
            <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--text-main);">
              Campus Placements &amp; Off-Campus Hiring Playbook
            </h3>
            <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.25rem;">
              Structured preparation for internships, entry-level engineering roles, and college placement drives for <strong>${escapeHtml(c.title)}</strong>.
            </p>
          </div>
          <span class="badge badge-success">
            ${completedTopics.length} / ${coreCSTopics.length + dsaPatterns.length} Placement Checkpoints Completed
          </span>
        </div>
      </div>

      <!-- Campus Placement Rounds Breakdown -->
      <div>
        <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.75rem;">The 4 Campus &amp; Fresher Interview Rounds</h3>
        <div class="grid-2">
          ${placementRounds.map(r => `
            <div class="card" style="padding: 1.1rem;">
              <span class="badge badge-local" style="margin-bottom: 0.4rem;">${escapeHtml(r.round)}</span>
              <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.35rem;">${escapeHtml(r.focus)}</h4>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.45;">${escapeHtml(r.strategy)}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Core CS Fundamentals Checklist -->
      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <div>
            <h3 style="font-size: 1.15rem; font-weight: 700;">Core CS Fundamentals Checklist</h3>
            <p style="font-size: 0.825rem; color: var(--text-muted);">
              Most campus interviewers ask questions from these 4 core Computer Science subjects regardless of framework.
            </p>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${coreCSTopics.map(t => {
            const isDone = completedTopics.includes(t.id);
            return `
              <div class="card" style="border-left: 4px solid ${isDone ? 'var(--success)' : 'var(--primary)'}; background: ${isDone ? 'var(--bg-card-subtle)' : 'var(--bg-card)'}; padding: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem;">
                  <div>
                    <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.25rem;">${escapeHtml(t.title)}</h4>
                    <p style="font-size: 0.85rem; color: var(--text-main); line-height: 1.45; margin-bottom: 0.5rem;">
                      ${escapeHtml(t.description)}
                    </p>
                    <div style="font-size: 0.825rem; color: var(--text-muted); background: var(--bg-main); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border);">
                      💡 <strong>Interviewer Lookout:</strong> ${escapeHtml(t.interviewerLookout)}
                    </div>
                  </div>
                  <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer; font-size: 0.825rem; font-weight: 600; white-space: nowrap;">
                    <input type="checkbox" class="toggle-placement-checkbox" data-topic-id="${t.id}" ${isDone ? 'checked' : ''} style="width: 18px; height: 18px;">
                    ${isDone ? 'Mastered ✓' : 'Mark Mastered'}
                  </label>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- High-Yield DSA Coding Patterns -->
      <div>
        <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.25rem;">High-Yield DSA Patterns for Freshers</h3>
        <p style="font-size: 0.825rem; color: var(--text-muted); margin-bottom: 0.75rem;">
          Rather than memorizing 500 LeetCode problems, master these fundamental patterns that cover 80% of entry-level coding assessments.
        </p>
        <div class="grid-2">
          ${dsaPatterns.map(p => {
            const isDone = completedTopics.includes(p.id);
            return `
              <div class="card" style="padding: 1rem; border-left: 3px solid ${isDone ? 'var(--success)' : 'var(--primary-border)'};">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.35rem;">
                  <span class="badge badge-ai">${escapeHtml(p.difficulty)}</span>
                  <label style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; cursor: pointer;">
                    <input type="checkbox" class="toggle-placement-checkbox" data-topic-id="${p.id}" ${isDone ? 'checked' : ''}>
                    ${isDone ? 'Practiced ✓' : 'Practice'}
                  </label>
                </div>
                <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.3rem;">${escapeHtml(p.pattern)}</h4>
                <p style="font-size: 0.825rem; color: var(--text-muted); line-height: 1.4;">
                  <strong>Common Applications:</strong> ${escapeHtml(p.applications)}
                </p>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Off-Campus & Cold Outreach Strategy -->
      <div class="card" style="background: var(--bg-card); padding: 1.25rem;">
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem;">Off-Campus Outreach Template for Students</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">
          Sending 10 thoughtful, personalized messages to alumni or engineers on LinkedIn has a 10x higher response rate than 200 "Easy Apply" clicks:
        </p>
        <div style="background: var(--bg-main); border: 1px solid var(--border); padding: 1rem; border-radius: var(--radius-sm); font-size: 0.85rem; font-family: monospace; line-height: 1.5; color: var(--text-main); white-space: pre-wrap;">
Hi [Name],

I noticed your engineering journey at [Company] after graduating from [University / or self-learning track]. I am a final-year student passionate about ${escapeHtml(c.title)}.

I recently built and deployed a project: [Project Name - with Live Demo link] using [Primary Tech Stack], where I implemented [Key Feature - e.g. JWT authentication and SQL schema optimization].

I would love to learn from your experience: what is one technical competency your team values most in entry-level engineers that most new graduates overlook?

Thank you for your time,
[Your Name] | [LinkedIn / GitHub link]</div>
      </div>
    </div>
  `;
}

function renderTabProjects() {
  const ideas = appState.selectedCareer.portfolioProjectIdeas || [];
  const projectsHtml = ideas.map((idea, idx) => {
    const isCompleted = appState.completedProjectIds.includes(`proj-${idx}`);
    return `
      <div class="card" style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--primary);">Portfolio Project #${idx + 1}</h3>
          <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; cursor: pointer;">
            <input type="checkbox" class="toggle-project-checkbox" data-proj-id="proj-${idx}" ${isCompleted ? 'checked' : ''} style="width: 18px; height: 18px;">
            ${isCompleted ? 'Built ✓' : 'Mark as Built'}
          </label>
        </div>
        <p style="font-size: 0.9rem; margin: 0.5rem 0; color: var(--text-main);">${escapeHtml(idea)}</p>
        <div style="font-size: 0.8rem; color: var(--text-muted);">
          Key value: Proves technical competence, Git hygiene, and end-to-end architecture to interviewers.
        </div>
      </div>
    `;
  }).join('');

  return `
    <div>
      <div style="margin-bottom: 1.25rem;">
        <h3 style="font-size: 1.15rem; font-weight: 700;">Industry-Relevant Portfolio Ideas</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted);">
          Recruiters prioritize real code over quiz scores. Complete 1-2 substantial projects for this role.
        </p>
      </div>
      ${projectsHtml}
    </div>
  `;
}

function renderTabInterview() {
  const topics = appState.selectedCareer.interviewTopics || [];
  const topicsList = topics.map((t, idx) => {
    const isPracticed = appState.practicedInterviewQuestionIds.includes(`topic-${idx}`);
    return `
      <div class="card" style="margin-bottom: 0.75rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.9rem; font-weight: 600;">${escapeHtml(t)}</span>
          <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; cursor: pointer;">
            <input type="checkbox" class="toggle-interview-checkbox" data-topic-id="topic-${idx}" ${isPracticed ? 'checked' : ''}>
            ${isPracticed ? 'Practiced ✓' : 'Mark Practiced'}
          </label>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div>
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.15rem; font-weight: 700;">Technical &amp; Behavioral Interview Topics</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted);">
          Prepare your responses using the <strong>STAR Framework</strong>:
        </p>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; margin-top: 0.75rem; font-size: 0.8rem; text-align: center;">
          <div class="card" style="padding: 0.5rem;"><strong>S</strong>ituation (Context)</div>
          <div class="card" style="padding: 0.5rem;"><strong>T</strong>ask (Goal)</div>
          <div class="card" style="padding: 0.5rem;"><strong>A</strong>ction (Your work)</div>
          <div class="card" style="padding: 0.5rem;"><strong>R</strong>esult (Measurable outcome)</div>
        </div>
      </div>
      <div style="margin-top: 1rem;">
        <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem;">Core Competencies Assessed:</h4>
        ${topicsList}
      </div>
    </div>
  `;
}

function renderTabResume() {
  return `
    <div>
      <div style="margin-bottom: 1rem;">
        <h3 style="font-size: 1.15rem; font-weight: 700;">ATS Keyword &amp; Experience Assistant</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted);">
          Paste your resume draft or project bullets below. We compare them against <strong>${escapeHtml(appState.selectedCareer.title)}</strong> competencies to identify missing keywords.
        </p>
      </div>

      <div class="form-group">
        <textarea id="resumeInputText" class="form-textarea" rows="6" placeholder="Paste your resume work experience or project bullets here..."></textarea>
      </div>

      <button id="analyzeResumeBtn" class="btn btn-primary btn-sm">
        <span>🔍</span> Analyze Resume Alignment
      </button>

      <div id="resumeAnalysisResults" style="margin-top: 1.5rem; display: none;"></div>
    </div>
  `;
}

function renderTabReadiness(readiness) {
  const dims = readiness.dimensions;
  return `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <div>
          <h3 style="font-size: 1.15rem; font-weight: 700;">Role Preparation Progress</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted);">
            Transparent multi-factor index of your tangible preparation. (Not employment probability).
          </p>
        </div>
        <span class="badge badge-success" style="font-size: 1rem; padding: 0.4rem 1rem;">
          ${readiness.overallScore}% &bull; ${readiness.statusLabel}
        </span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
            <span>Essential Skill Coverage (35% weight)</span>
            <strong>${dims.skillCoverage}%</strong>
          </div>
          <div class="meter-container"><div class="meter-fill" style="width: ${dims.skillCoverage}%;"></div></div>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
            <span>Roadmap Milestones (25% weight)</span>
            <strong>${dims.roadmapProgress}%</strong>
          </div>
          <div class="meter-container"><div class="meter-fill" style="width: ${dims.roadmapProgress}%;"></div></div>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
            <span>Portfolio Projects Completed (20% weight)</span>
            <strong>${dims.projectsCompleted}%</strong>
          </div>
          <div class="meter-container"><div class="meter-fill" style="width: ${dims.projectsCompleted}%;"></div></div>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem;">
            <span>Interview Topics Practiced (10% weight)</span>
            <strong>${dims.interviewPreparation}%</strong>
          </div>
          <div class="meter-container"><div class="meter-fill" style="width: ${dims.interviewPreparation}%;"></div></div>
        </div>
      </div>

      <div class="card" style="background: var(--bg-card-subtle);">
        <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.4rem; color: var(--primary);">Suggested Next Actions</h4>
        <ul style="padding-left: 1.25rem; font-size: 0.85rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.35rem;">
          ${readiness.actionableNextSteps.map(a => `<li>${escapeHtml(a)}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

function renderTabCompare() {
  const topMatches = appState.matches.slice(0, 3);
  if (topMatches.length === 0) {
    return `<p style="color: var(--text-muted);">Please complete the profile wizard to compare matching career paths.</p>`;
  }

  const comparisonCards = topMatches.map((m, idx) => {
    const c = m.career;
    const isCurrentActive = c.id === appState.selectedCareer?.id;
    const missingCount = m.missingSkills?.length || 0;
    const matchedCount = m.contributingSkills?.length || 0;

    return `
      <div class="card" style="flex: 1; min-width: 280px; display: flex; flex-direction: column; justify-content: space-between; border-top: 4px solid ${isCurrentActive ? 'var(--primary)' : 'var(--border)'};">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span class="badge ${isCurrentActive ? 'badge-ai' : 'badge-local'}">
              ${isCurrentActive ? 'Active Trajectory' : `Alternative #${idx + 1}`}
            </span>
            <span style="font-weight: 800; font-size: 1.15rem; color: var(--primary);">${m.overallScore}% Fit</span>
          </div>

          <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 0.25rem; color: var(--text-main);">${escapeHtml(c.title)}</h3>
          <span style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.75rem;">${escapeHtml(c.category)}</span>

          <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1rem;">
            ${escapeHtml(c.description)}
          </p>

          <div style="border-top: 1px solid var(--border); padding-top: 0.75rem; margin-bottom: 0.75rem;">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.35rem;">Skill Alignment:</div>
            <div style="font-size: 0.825rem; color: var(--text-muted); margin-bottom: 0.35rem;">
              <span style="color: var(--success); font-weight: 600;">✓ ${matchedCount} matched</span> &bull; 
              <span style="color: var(--warning); font-weight: 600;">⚡ ${missingCount} gaps to bridge</span>
            </div>
            <div class="chips-container" style="gap: 0.3rem;">
              ${(c.essentialSkills || []).slice(0, 5).map(s => {
                const hasSkill = (m.contributingSkills || []).includes(s);
                return `<span class="chip ${hasSkill ? 'selected' : ''}" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;">${hasSkill ? '✓ ' : ''}${escapeHtml(s)}</span>`;
              }).join('')}
            </div>
          </div>

          <div style="border-top: 1px solid var(--border); padding-top: 0.75rem; margin-bottom: 0.75rem; font-size: 0.825rem;">
            <div style="font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">Work Environments:</div>
            <div style="color: var(--text-muted);">${(c.workEnvironments || ['Remote', 'Hybrid']).join(', ')}</div>
          </div>

          <div style="border-top: 1px solid var(--border); padding-top: 0.75rem; margin-bottom: 0.75rem; font-size: 0.825rem;">
            <div style="font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">Sample Capstone Milestone:</div>
            <div style="color: var(--text-muted); line-height: 1.4;">${escapeHtml(c.portfolioProjectIdeas?.[0] || 'Technical Portfolio Project')}</div>
          </div>
        </div>

        <div style="margin-top: 1.25rem; padding-top: 0.75rem; border-top: 1px solid var(--border);">
          ${isCurrentActive ? `
            <button class="btn btn-secondary btn-sm" style="width: 100%; opacity: 0.85;" disabled>
              ✓ Currently Active Trajectory
            </button>
          ` : `
            <button class="btn btn-primary btn-sm" style="width: 100%;" data-switch-career="${c.id}">
              Switch to ${escapeHtml(c.title)} →
            </button>
          `}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <div>
        <h3 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 0.35rem;">Side-by-Side Career Path Comparison</h3>
        <p style="font-size: 0.875rem; color: var(--text-muted);">
          Evaluate your top candidate roles to make an informed decision on where to focus your study time and portfolio projects.
        </p>
      </div>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        ${comparisonCards}
      </div>

      <!-- Student & Fresher Decision Matrix -->
      <div class="card" style="background: var(--bg-card-subtle); padding: 1.25rem;">
        <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--primary);">
          🎓 Student &amp; Fresher Decision Guide
        </h4>
        <div class="grid-2" style="font-size: 0.85rem; color: var(--text-muted); gap: 1rem;">
          <div>
            <strong style="color: var(--text-main);">How to Choose Between Overlapping Roles:</strong>
            <p style="margin-top: 0.25rem; line-height: 1.5;">
              If you enjoy visual feedback, user interface design, and client-side code, prioritize <strong>Frontend Engineer</strong>. If you prefer database schemas, server architecture, and APIs, lean toward <strong>Backend Engineer</strong>. If you want broad versatility across smaller startups and product teams, select <strong>Full Stack</strong>.
            </p>
          </div>
          <div>
            <strong style="color: var(--text-main);">Transferable Foundations:</strong>
            <p style="margin-top: 0.25rem; line-height: 1.5;">
              Core competencies like <strong>JavaScript, Git, and SQL</strong> transfer seamlessly across 80% of entry-level software trajectories. You are never "locked in"; mastering engineering foundations makes pivoting between tracks later straightforward.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function bindResultsEvents() {
  // Career card selection
  document.querySelectorAll('[data-select-career]').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.selectCareer;
      const found = careerCatalog.find(c => c.id === id);
      if (found) {
        appState.selectedCareer = found;
        refreshCareerDetails();
        saveState();
        renderResultsDashboard();
      }
    });
  });

  // Switch career from comparison tab
  document.querySelectorAll('[data-switch-career]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.switchCareer;
      const found = careerCatalog.find(c => c.id === id);
      if (found) {
        appState.selectedCareer = found;
        refreshCareerDetails();
        saveState();
        appState.activeTab = 'overview';
        renderResultsDashboard();
      }
    });
  });

  // Jump to specific tab from call-to-action buttons
  document.querySelectorAll('[data-jump-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      appState.activeTab = btn.dataset.jumpTab;
      renderResultsDashboard();
    });
  });

  // Tab switching
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      appState.activeTab = btn.dataset.tab;
      renderResultsDashboard();
    });
  });

  // Edit Profile
  const editBtn = document.getElementById('editProfileBtn');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      appState.currentStep = 1;
      renderOnboardingWizard();
    });
  }

  // Export PDF / Print
  const pdfBtn = document.getElementById('exportPdfBtn');
  if (pdfBtn) {
    pdfBtn.addEventListener('click', () => {
      const match = appState.matches.find(m => m.career.id === appState.selectedCareer.id);
      const readiness = calculateReadinessScore({
        skillGaps: appState.skillGaps,
        completedRoadmapWeeks: appState.completedRoadmapWeeks,
        totalRoadmapWeeks: appState.roadmap?.totalWeeks || appState.roadmapDuration || 12,
        completedProjects: appState.completedProjectIds,
        practicedInterviewQuestions: appState.practicedInterviewQuestionIds
      });

      pdfService.openPrintableReport({
        profile: appState.profile,
        selectedCareer: appState.selectedCareer,
        match,
        skillGaps: appState.skillGaps,
        roadmap: appState.roadmap,
        readiness
      });
    });
  }

  // Share Summary Modal
  const shareBtn = document.getElementById('shareResultsBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const match = appState.matches.find(m => m.career.id === appState.selectedCareer.id);
      const summary = `CareerPath AI Summary:\nTarget Role: ${appState.selectedCareer.title} (${match.overallScore}% Fit)\nTop Strengths: ${match.contributingSkills.slice(0, 3).join(', ')}\nPlan: 12-week structured roadmap with zero-budget guidance!\nExplore: https://careerpath-ai.vercel.app`;
      shareSummaryText.value = summary;
      shareModal.style.display = 'flex';
    });
  }

  // Checkbox toggles for roadmap
  document.querySelectorAll('.toggle-week-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      const week = parseInt(cb.dataset.week, 10);
      const idx = appState.completedRoadmapWeeks.indexOf(week);
      if (cb.checked && idx === -1) {
        appState.completedRoadmapWeeks.push(week);
      } else if (!cb.checked && idx !== -1) {
        appState.completedRoadmapWeeks.splice(idx, 1);
      }
      saveState();
      renderResultsDashboard();
    });
  });

  // Checkbox toggles for projects
  document.querySelectorAll('.toggle-project-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = cb.dataset.projId;
      const idx = appState.completedProjectIds.indexOf(id);
      if (cb.checked && idx === -1) {
        appState.completedProjectIds.push(id);
      } else if (!cb.checked && idx !== -1) {
        appState.completedProjectIds.splice(idx, 1);
      }
      saveState();
      renderResultsDashboard();
    });
  });

  // Checkbox toggles for interview topics
  document.querySelectorAll('.toggle-interview-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = cb.dataset.topicId;
      const idx = appState.practicedInterviewQuestionIds.indexOf(id);
      if (cb.checked && idx === -1) {
        appState.practicedInterviewQuestionIds.push(id);
      } else if (!cb.checked && idx !== -1) {
        appState.practicedInterviewQuestionIds.splice(idx, 1);
      }
      saveState();
      renderResultsDashboard();
    });
  });

  // Roadmap duration switcher (4, 8, 12 weeks)
  document.querySelectorAll('[data-set-roadmap-duration]').forEach(btn => {
    btn.addEventListener('click', () => {
      const dur = parseInt(btn.dataset.setRoadmapDuration, 10);
      appState.roadmapDuration = dur;
      refreshCareerDetails();
      saveState();
      renderResultsDashboard();
    });
  });

  // Checkbox toggles for campus placement checkpoints
  document.querySelectorAll('.toggle-placement-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = cb.dataset.topicId;
      const list = appState.completedPlacementTopicIds || [];
      const idx = list.indexOf(id);
      if (cb.checked && idx === -1) {
        list.push(id);
      } else if (!cb.checked && idx !== -1) {
        list.splice(idx, 1);
      }
      appState.completedPlacementTopicIds = list;
      saveState();
      renderResultsDashboard();
    });
  });

  // Resume analysis trigger
  const analyzeResumeBtn = document.getElementById('analyzeResumeBtn');
  if (analyzeResumeBtn) {
    analyzeResumeBtn.addEventListener('click', async () => {
      const text = document.getElementById('resumeInputText')?.value || '';
      const resultContainer = document.getElementById('resumeAnalysisResults');
      if (!resultContainer) return;

      if (text.trim().length < 20) {
        alert('Please paste at least a paragraph of resume content to analyze.');
        return;
      }

      resultContainer.style.display = 'block';
      resultContainer.innerHTML = '<p style="color: var(--primary);">Analyzing resume keywords against target competencies...</p>';

      const res = await apiService.analyzeResume(text, appState.selectedCareer);
      if (res.success && res.data) {
        const d = res.data;
        resultContainer.innerHTML = `
          <div class="card" style="background: var(--bg-card-subtle);">
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">Resume Alignment Analysis</h4>
            <div style="margin-bottom: 0.75rem;">
              <strong>Matched Essential Keywords:</strong>
              <div class="chips-container">
                ${(d.matchedKeywords || []).map(k => `<span class="chip selected">${escapeHtml(k)}</span>`).join('') || '<span style="font-size: 0.8rem; color: var(--text-muted);">None found yet</span>'}
              </div>
            </div>
            <div style="margin-bottom: 0.75rem;">
              <strong>Missing Priority Keywords:</strong>
              <div class="chips-container">
                ${(d.missingKeywords || []).map(k => `<span class="chip" style="color: var(--danger); border-color: var(--danger);">${escapeHtml(k)}</span>`).join('') || '<span style="font-size: 0.8rem; color: var(--text-muted);">All core keywords present!</span>'}
              </div>
            </div>
            <div>
              <strong>Actionable Recommendations:</strong>
              <ul style="padding-left: 1.25rem; font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">
                ${(d.recommendedImprovements || []).map(r => `<li>${escapeHtml(r)}</li>`).join('')}
              </ul>
            </div>
          </div>
        `;
      } else {
        resultContainer.innerHTML = `<p style="color: var(--danger); font-size: 0.85rem;">${escapeHtml(res.error || 'Could not complete resume analysis')}</p>`;
      }
    });
  }
}

// -----------------------------------------------------------------------------
// AI Career Coach
// -----------------------------------------------------------------------------
function setupCoachEvents() {
  if (coachFab) {
    coachFab.addEventListener('click', () => {
      coachDrawer.style.display = coachDrawer.style.display === 'none' ? 'flex' : 'none';
      if (coachDrawer.style.display === 'flex' && coachInput) {
        coachInput.focus();
      }
    });
  }

  if (closeCoachBtn) {
    closeCoachBtn.addEventListener('click', () => {
      coachDrawer.style.display = 'none';
    });
  }

  // Quick prompt chips
  document.querySelectorAll('.coach-prompt-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      if (coachInput) {
        coachInput.value = btn.dataset.prompt;
        coachForm.dispatchEvent(new Event('submit'));
      }
    });
  });

  if (coachForm) {
    coachForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = coachInput.value.trim();
      if (!text) return;

      appendChatMessage('user', text);
      coachInput.value = '';

      // Append typing indicator
      const typingBubble = document.createElement('div');
      typingBubble.className = 'chat-bubble chat-bubble-coach';
      typingBubble.id = 'coachTypingIndicator';
      typingBubble.textContent = 'Thinking...';
      coachChatBody.appendChild(typingBubble);
      coachChatBody.scrollTop = coachChatBody.scrollHeight;

      const context = {
        targetCareer: appState.selectedCareer?.title,
        currentSkills: appState.profile.skills.map(s => s.name).join(', '),
        missingSkills: appState.skillGaps.filter(g => g.status === 'Missing').map(g => g.skill).join(', '),
        weeklyHours: appState.profile.hoursAvailablePerWeek
      };

      const res = await apiService.getCoachResponse(text, context);
      const indicator = document.getElementById('coachTypingIndicator');
      if (indicator) indicator.remove();

      if (res.success && res.data) {
        const reply = res.data.coachResponse || res.data.response || 'I am ready to help you plan your next learning steps!';
        appendChatMessage('coach', reply);
      } else {
        // Fallback local coach response
        appendChatMessage('coach', `[Local Guidance Mode] For ${appState.selectedCareer?.title || 'your path'}, prioritize mastering ${appState.skillGaps.find(g => g.status === 'Missing')?.skill || 'core fundamentals'} and building 1 substantial portfolio deliverable.`);
      }
    });
  }
}

function appendChatMessage(sender, text) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble chat-bubble-${sender}`;
  bubble.textContent = text;
  coachChatBody.appendChild(bubble);
  coachChatBody.scrollTop = coachChatBody.scrollHeight;

  appState.coachMessages.push({
    sender,
    text,
    timestamp: new Date().toISOString()
  });
  saveState();
}

// -----------------------------------------------------------------------------
// Global Event Listeners & Modals
// -----------------------------------------------------------------------------
function setupEventListeners() {
  // Brand link resets view to dashboard if ready or step 1
  if (brandLink) {
    brandLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (appState.matches.length > 0) renderResultsDashboard();
      else renderOnboardingWizard();
    });
  }

  // Backup Modal
  if (dataBackupBtn) dataBackupBtn.addEventListener('click', () => backupModal.style.display = 'flex');
  if (helpSupportBtn) helpSupportBtn.addEventListener('click', () => helpModal.style.display = 'flex');

  // Close modals
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.closeModal;
      const el = document.getElementById(modalId);
      if (el) el.style.display = 'none';
    });
  });

  // Modal backdrop click to close
  [backupModal, helpModal, shareModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    }
  });

  // Export JSON
  if (exportDataBtn) {
    exportDataBtn.addEventListener('click', () => {
      const json = storageService.exportJSON(appState);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `careerpath_ai_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // Import JSON
  if (importFileInput) {
    importFileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = storageService.importJSON(event.target?.result);
        const notifyEl = document.getElementById('backupNotification');
        if (result.success) {
          notifyEl.style.color = 'var(--success)';
          notifyEl.textContent = 'Data imported successfully! Reloading...';
          setTimeout(() => window.location.reload(), 1000);
        } else {
          notifyEl.style.color = 'var(--danger)';
          notifyEl.textContent = `Import failed: ${result.error}`;
        }
      };
      reader.readAsText(file);
    });
  }

  // Reset All
  if (resetAllDataBtn) {
    resetAllDataBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all your CareerPath AI data? This cannot be undone.')) {
        storageService.resetAll();
        window.location.reload();
      }
    });
  }

  // Share Copy & Native Share
  if (copyShareBtn && shareSummaryText) {
    copyShareBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(shareSummaryText.value);
        copyShareBtn.textContent = 'Copied! ✓';
        setTimeout(() => copyShareBtn.textContent = 'Copy to Clipboard', 2000);
      } catch (err) {
        shareSummaryText.select();
        document.execCommand('copy');
      }
    });
  }

  if (nativeShareBtn && shareSummaryText) {
    nativeShareBtn.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'My CareerPath AI Plan',
            text: shareSummaryText.value,
            url: window.location.origin
          });
        } catch (err) {
          // User dismissed or unsupported
        }
      } else {
        alert('Web Share is not supported in this browser. Please use Copy to Clipboard.');
      }
    });
  }

  setupCoachEvents();
}

// Theme handling
function initTheme() {
  const current = localStorage.getItem('careerpath_theme') || 'system';
  applyTheme(current);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme');
      const next = active === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('careerpath_theme', next);
    });
  }
}

function applyTheme(theme) {
  let effectiveTheme = theme;
  if (theme === 'system') {
    effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', effectiveTheme);
  if (themeIcon) {
    themeIcon.textContent = effectiveTheme === 'dark' ? '☀️' : '🌙';
  }
}

// Safe string escaping for HTML rendering
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str)
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Start application on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
