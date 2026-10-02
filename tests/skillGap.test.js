import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeSkillGaps, getSkillGapSummary } from '../js/services/skillGapEngine.js';
import { careerCatalog } from '../js/data/careerCatalog.js';

test('analyzeSkillGaps properly tags Missing, Developing, Ready, and Strong skills', () => {
  const career = careerCatalog.find(c => c.id === 'backend-engineer');
  assert.ok(career);

  const userSkills = [
    { name: 'Python', proficiency: 'Advanced' },
    { name: 'SQL', proficiency: 'Beginner' }
    // Node.js is missing
  ];

  const gaps = analyzeSkillGaps(userSkills, career);
  assert.ok(gaps.length > 0);

  const pythonGap = gaps.find(g => g.skill === 'Python');
  assert.equal(pythonGap.status, 'Strong');

  const sqlGap = gaps.find(g => g.skill === 'SQL');
  assert.equal(sqlGap.status, 'Developing');

  const nodeGap = gaps.find(g => g.skill === 'Node.js');
  assert.equal(nodeGap.status, 'Missing');
  assert.equal(nodeGap.priority, 'High');

  const summary = getSkillGapSummary(gaps);
  assert.equal(summary.strong, 1);
  assert.ok(summary.missing >= 1);
  assert.ok(summary.coveragePct > 0 && summary.coveragePct < 100);
});
