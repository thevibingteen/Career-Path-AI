import test from 'node:test';
import assert from 'node:assert/strict';
import { matchProfileToCareers } from '../js/services/deterministicMatcher.js';
import { careerCatalog } from '../js/data/careerCatalog.js';
import { storageService, defaultState } from '../js/services/storageService.js';

test('matchProfileToCareers handles candidate with zero skills gracefully without crashing', () => {
  const zeroSkillProfile = {
    name: 'Complete Beginner',
    educationLevel: 'High School',
    studyField: 'General',
    experienceLevel: 'Student / Fresher',
    skills: [],
    interests: ['Web Development'],
    targetRole: '',
    hoursAvailablePerWeek: 5
  };

  const matches = matchProfileToCareers(zeroSkillProfile, careerCatalog);
  assert.ok(Array.isArray(matches), 'Matches array returned');
  assert.equal(matches.length, careerCatalog.length);
  matches.forEach(m => {
    assert.ok(m.overallScore >= 15 && m.overallScore <= 100, 'Score is bounded [15, 100]');
    assert.ok(Array.isArray(m.contributingSkills), 'Contributing skills is array');
    assert.ok(Array.isArray(m.missingSkills), 'Missing skills is array');
  });
});

test('Career comparison differentiates skills between Full Stack, Frontend, and Backend', () => {
  const candidateSkills = [
    { name: 'JavaScript', proficiency: 'Advanced' },
    { name: 'CSS', proficiency: 'Advanced' },
    { name: 'HTML', proficiency: 'Advanced' }
  ];

  const profile = {
    skills: candidateSkills,
    interests: ['Software Development'],
    experienceLevel: 'Entry-Level (0-1 yrs)',
    hoursAvailablePerWeek: 12
  };

  const matches = matchProfileToCareers(profile, careerCatalog);
  const frontendMatch = matches.find(m => m.career.id === 'frontend-engineer');
  const backendMatch = matches.find(m => m.career.id === 'backend-engineer');

  assert.ok(frontendMatch, 'Frontend engineer in matches');
  assert.ok(backendMatch, 'Backend engineer in matches');

  // Frontend fit should be significantly higher than backend fit for HTML/CSS/JS profile
  assert.ok(
    frontendMatch.overallScore > backendMatch.overallScore,
    `Frontend score (${frontendMatch.overallScore}) should exceed Backend score (${backendMatch.overallScore})`
  );
});

test('storageService export and import verifies JSON structure and integrity', () => {
  const testState = {
    profile: { name: 'Alex Student', skills: [{ name: 'Git', proficiency: 'Intermediate' }] },
    selectedCareerId: 'full-stack-engineer',
    completedRoadmapWeeks: [1, 2],
    completedProjectIds: ['proj-1'],
    practicedInterviewQuestionIds: ['q-1'],
    notes: {}
  };

  const exportedJson = storageService.exportJSON(testState);
  assert.ok(typeof exportedJson === 'string');
  const parsed = JSON.parse(exportedJson);
  assert.equal(parsed.exportVersion, 2);
  assert.ok(parsed.data.profile.name === 'Alex Student');
  assert.deepEqual(parsed.data.completedRoadmapWeeks, [1, 2]);

  // Validate corrupted import handling
  const corruptedResult = storageService.importJSON('invalid-json{{{');
  assert.equal(corruptedResult.success, false);
  assert.ok(corruptedResult.error);
});
