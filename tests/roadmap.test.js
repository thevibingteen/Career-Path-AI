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
