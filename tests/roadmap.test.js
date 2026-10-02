import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePersonalizedRoadmap } from '../js/services/roadmapGenerator.js';
import { careerCatalog } from '../js/data/careerCatalog.js';

test('generatePersonalizedRoadmap generates 12 customized weeks adapted to weekly hours', () => {
  const career = careerCatalog.find(c => c.id === 'cloud-devops-engineer');
  assert.ok(career);

  const roadmap10h = generatePersonalizedRoadmap(career, [{ name: 'Linux', proficiency: 'Beginner' }], 10);
  assert.equal(roadmap10h.totalWeeks, 12);
  assert.equal(roadmap10h.adaptedWeeklyHours, 10);
  assert.equal(roadmap10h.weeks.length, 12);

  // Validate progressive phases
  assert.equal(roadmap10h.weeks[0].phase, 'Foundations');
  assert.equal(roadmap10h.weeks[4].phase, 'Core Skills');
  assert.equal(roadmap10h.weeks[7].phase, 'Deep Dive');
  assert.equal(roadmap10h.weeks[11].phase, 'Portfolio & Job Ready');

  // Verify that each week contains concrete milestone & practice task
  roadmap10h.weeks.forEach((w, idx) => {
    assert.ok(w.objectives.length > 0, `Week ${idx + 1} has objectives`);
    assert.ok(w.handsOnProjectMilestone, `Week ${idx + 1} has milestone`);
    assert.ok(w.practiceTask, `Week ${idx + 1} has practice task`);
  });
});

test('generatePersonalizedRoadmap supports 4-week and 8-week tracks', () => {
  const career = careerCatalog.find(c => c.id === 'frontend-engineer');
  assert.ok(career);

  const r4 = generatePersonalizedRoadmap(career, [], 10, 4);
  assert.equal(r4.totalWeeks, 4);
  assert.equal(r4.weeks.length, 4);
  assert.equal(r4.weeks[0].week, 1);
  assert.equal(r4.weeks[3].week, 4);

  const r8 = generatePersonalizedRoadmap(career, [], 10, 8);
  assert.equal(r8.totalWeeks, 8);
  assert.equal(r8.weeks.length, 8);
  assert.equal(r8.weeks[0].week, 1);
  assert.equal(r8.weeks[7].week, 8);
});
