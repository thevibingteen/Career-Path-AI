import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSkillFit,
  calculateInterestFit,
  calculateExperienceFit,
  matchProfileToCareers,
  normalizeName
} from '../js/services/deterministicMatcher.js';
import { careerCatalog } from '../js/data/careerCatalog.js';

test('normalizeName correctly cleans and normalizes strings', () => {
  assert.equal(normalizeName(' React.js / Web '), 'react js web');
  assert.equal(normalizeName('NODE_JS'), 'node js');
  assert.equal(normalizeName(null), '');
});

test('calculateSkillFit computes accurate percentage with proficiency weights', () => {
  const career = careerCatalog.find(c => c.id === 'frontend-engineer');
  assert.ok(career, 'Frontend engineer career exists in catalog');

  // Candidate with exact intermediate skills
  const candidateSkills = [
    { name: 'JavaScript', proficiency: 'Advanced' },
    { name: 'React', proficiency: 'Intermediate' },
    { name: 'HTML', proficiency: 'Advanced' },
    { name: 'CSS', proficiency: 'Intermediate' }
  ];

  const analysis = calculateSkillFit(candidateSkills, career);
  assert.ok(analysis.score > 40, 'Skill fit should reflect significant coverage');
  assert.ok(analysis.contributing.includes('JavaScript'));
  assert.ok(analysis.contributing.includes('React'));
  assert.ok(analysis.missing.length > 0, 'Missing skills should be accurately identified');
});

test('matchProfileToCareers ranks top fitting career and produces transparent scores', () => {
  const mockProfile = {
    name: 'Dev Candidate',
    educationLevel: "Bachelor's Degree",
    studyField: 'Computer Science',
    experienceLevel: 'Entry-Level (0-1 yrs)',
    employmentStatus: 'Job Seeker',
    skills: [
      { name: 'Python', proficiency: 'Advanced' },
      { name: 'Machine Learning', proficiency: 'Intermediate' },
      { name: 'SQL', proficiency: 'Intermediate' },
      { name: 'Statistics', proficiency: 'Intermediate' }
    ],
    interests: ['AI', 'Data Science'],
    targetRole: 'Data Scientist',
    timeline: 'Medium-term (6-12 months)',
    workPreference: 'Remote',
    hoursAvailablePerWeek: 15
  };

  const matches = matchProfileToCareers(mockProfile, careerCatalog);
  assert.ok(matches.length > 0, 'Matches should be returned');
  
  // Top match should be Data Scientist or AI/ML Engineer
  const topMatch = matches[0];
  assert.ok(
    topMatch.career.id === 'data-scientist' || topMatch.career.id === 'ai-ml-engineer',
    `Top match expected to be Data Scientist or AI Engineer, got ${topMatch.career.title}`
  );

  // Score should be reasonable and bounded
  assert.ok(topMatch.overallScore >= 50 && topMatch.overallScore <= 100);
  assert.ok(topMatch.fitExplanation.includes('fit score'));
  assert.ok(!topMatch.fitExplanation.includes('guarantee'), 'No deceptive guarantees in output');
});
