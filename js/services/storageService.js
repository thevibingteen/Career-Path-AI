/**
 * Privacy-First Local Storage Service
 * - Versioned schema management
 * - Corrupted data recovery
 * - Export & Import user data as JSON
 * - Full reset capability
 * - NEVER stores API secrets or credentials
 */

const STORAGE_KEY = 'careerpath_ai_data_v2';
const SCHEMA_VERSION = 2;

export const defaultState = {
  version: SCHEMA_VERSION,
  profile: null,
  selectedCareerId: null,
  roadmapDuration: 12,
  completedRoadmapWeeks: [],
  completedProjectIds: [],
  practicedInterviewQuestionIds: [],
  completedPlacementTopicIds: [],
  completedSkillNames: [],
  notes: {},
  coachMessages: [],
  settings: {
    theme: 'system',
    useAIIfAvailable: true
  },
  lastSaved: null
};

export const storageService = {
  loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...defaultState };

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        console.warn('Invalid storage format encountered. Resetting to default state.');
        return { ...defaultState };
      }

      // Schema migration if necessary
      if (parsed.version !== SCHEMA_VERSION) {
        return this.migrate(parsed);
      }

      return {
        ...defaultState,
        ...parsed,
        settings: { ...defaultState.settings, ...(parsed.settings || {}) }
      };
    } catch (err) {
      console.error('Failed to parse localStorage data. Recovering safely.', err);
      return { ...defaultState };
    }
  },

  saveData(data) {
    try {
      if (!data || typeof data !== 'object') return false;

      // Sanitization: Ensure API keys or secrets are NEVER stored
      const sanitized = {
        version: SCHEMA_VERSION,
        profile: data.profile || null,
        selectedCareerId: data.selectedCareerId || null,
        completedRoadmapWeeks: Array.isArray(data.completedRoadmapWeeks) ? data.completedRoadmapWeeks : [],
        completedProjectIds: Array.isArray(data.completedProjectIds) ? data.completedProjectIds : [],
        practicedInterviewQuestionIds: Array.isArray(data.practicedInterviewQuestionIds) ? data.practicedInterviewQuestionIds : [],
        completedSkillNames: Array.isArray(data.completedSkillNames) ? data.completedSkillNames : [],
        notes: data.notes && typeof data.notes === 'object' ? data.notes : {},
        coachMessages: Array.isArray(data.coachMessages) ? data.coachMessages.slice(-50) : [], // keep last 50
        settings: {
          theme: data.settings?.theme || 'system',
          useAIIfAvailable: data.settings?.useAIIfAvailable !== false
        },
        lastSaved: new Date().toISOString()
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
      return true;
    } catch (err) {
      console.error('Failed to save data to localStorage:', err);
      return false;
    }
  },

  migrate(oldData) {
    console.log('Migrating local data from older schema to v2...');
    return {
      ...defaultState,
      profile: oldData.userData ? {
        name: oldData.userData.name || '',
        educationLevel: "Bachelor's Degree",
        studyField: oldData.userData.studyField || 'Computer Science / Engineering',
        isStudentOrRecentGrad: false,
        experienceLevel: oldData.userData.experience || 'Entry-Level (0-1 yrs)',
        employmentStatus: oldData.userData.employmentStatus || 'Job Seeker',
        hasInternshipExperience: false,
        hasProjectExperience: true,
        skills: (oldData.userData.skills || '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
          .map(name => ({ name, proficiency: 'Intermediate' })),
        interests: Array.isArray(oldData.userData.interests) ? oldData.userData.interests : [],
        timeline: 'Medium-term (6-12 months)',
        workPreference: 'Remote',
        careerObjective: 'First Job',
        hoursAvailablePerWeek: 10,
        learningBudget: 'Free Only'
      } : null,
      lastSaved: new Date().toISOString()
    };
  },

  resetAll() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      // Clean up legacy keys if present
      localStorage.removeItem('careerpath_user_data');
      localStorage.removeItem('careerpath_ai_results');
      return true;
    } catch (err) {
      console.error('Failed to reset storage:', err);
      return false;
    }
  },

  exportJSON(currentState) {
    const exportData = {
      exportVersion: 2,
      exportedAt: new Date().toISOString(),
      disclaimer: 'This file contains your local CareerPath AI profile, progress, and roadmap notes.',
      data: currentState || this.loadData()
    };
    return JSON.stringify(exportData, null, 2);
  },

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid JSON structure');
      }

      const importedData = parsed.data || parsed;
      if (!importedData || typeof importedData !== 'object') {
        throw new Error('No valid CareerPath AI data block found in file');
      }

      // Save imported state
      this.saveData(importedData);
      return { success: true, data: this.loadData() };
    } catch (err) {
      return { success: false, error: err.message || 'Corrupted file format' };
    }
  }
};
