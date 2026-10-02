import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateReadinessScore } from '../js/services/readinessEngine.js';

test('calculateReadinessScore scales appropriately based on user milestones', () => {
  // Empty state
  const emptyScore = calculateReadinessScore({});
  assert.equal(emptyScore.overallScore, 4); // Only baseline default
  assert.equal(emptyScore.statusLabel, 'Getting Started');
  assert.ok(emptyScore.actionableNextSteps.length > 0);

  // Advanced preparation state
  const mockGaps = [
    { skill: 'React', category: 'Essential', status: 'Strong' },
    { skill: 'JavaScript', category: 'Essential', status: 'Strong' },
    { skill: 'CSS', category: 'Essential', status: 'Ready' }
  ];

  const preparedScore = calculateReadinessScore({
    skillGaps: mockGaps,
    completedRoadmapWeeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    totalRoadmapWeeks: 12,
    completedProjects: ['p1', 'p2'],
    practicedInterviewQuestions: ['q1', 'q2', 'q3', 'q4', 'q5'],
    resumeAnalysisScore: 85
  });

  assert.ok(preparedScore.overallScore >= 80, `Expected >= 80, got ${preparedScore.overallScore}`);
  assert.equal(preparedScore.statusLabel, 'Job Ready');
});
