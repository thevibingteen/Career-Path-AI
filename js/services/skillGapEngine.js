import { normalizeName } from './deterministicMatcher.js';

/**
 * Skill Gap Analysis Engine
 * Compares user's actual skills and proficiency against career requirements.
 * Categorizes into: Strong, Ready, Developing, Missing
 * Determines Priority: High, Medium, Low
 * Provides concrete, actionable recommendations.
 */
export function analyzeSkillGaps(userSkills, career) {
  if (!career) return [];

  const userSkillMap = new Map();
  (userSkills || []).forEach(s => {
    const rawName = typeof s === 'string' ? s : s.name;
    const proficiency = (typeof s === 'object' && s.proficiency) ? s.proficiency : 'Intermediate';
    const norm = normalizeName(rawName);
    if (norm) {
      userSkillMap.set(norm, proficiency);
    }
  });

  const proficiencyRanks = {
    'None': 0,
    'Beginner': 1,
    'Intermediate': 2,
    'Advanced': 3
  };

  const gapItems = [];

  // 1. Analyze Essential Skills (High Priority)
  (career.essentialSkills || []).forEach(essential => {
    const norm = normalizeName(essential);
    let matchedProficiency = 'None';

    for (const [userNorm, prof] of userSkillMap.entries()) {
      if (userNorm === norm || userNorm.includes(norm) || norm.includes(userNorm)) {
        matchedProficiency = prof;
        break;
      }
    }

    const targetProficiency = 'Intermediate'; // Standard entry-to-mid baseline
    const targetRank = proficiencyRanks[targetProficiency];
    const userRank = proficiencyRanks[matchedProficiency];
    const rankDiff = targetRank - userRank;

    let gap = 'None';
    let status = 'Strong';
    let priority = 'Low';
    let action = `Maintain and leverage ${essential} in portfolio projects.`;

    if (userRank === 0) {
      gap = 'Significant';
      status = 'Missing';
      priority = 'High';
      action = `Learn ${essential} fundamentals and build a hands-on exercise.`;
    } else if (rankDiff > 0) {
      gap = 'Minor';
      status = 'Developing';
      priority = 'High';
      action = `Deepen ${essential} to intermediate proficiency through project implementation.`;
    } else if (userRank >= 3) {
      gap = 'None';
      status = 'Strong';
      priority = 'Low';
      action = `Demonstrate advanced ${essential} architecture in technical interviews.`;
    } else {
      gap = 'None';
      status = 'Ready';
      priority = 'Medium';
      action = `Review real-world design patterns for ${essential}.`;
    }

    gapItems.push({
      skill: essential,
      category: 'Essential',
      requiredLevel: targetProficiency,
      userLevel: matchedProficiency,
      gap,
      status,
      priority,
      action
    });
  });

  // 2. Analyze Secondary Skills (Medium/Low Priority)
  (career.secondarySkills || []).forEach(secondary => {
    const norm = normalizeName(secondary);
    let matchedProficiency = 'None';

    for (const [userNorm, prof] of userSkillMap.entries()) {
      if (userNorm === norm || userNorm.includes(norm) || norm.includes(userNorm)) {
        matchedProficiency = prof;
        break;
      }
    }

    const targetProficiency = 'Beginner';
    const targetRank = proficiencyRanks[targetProficiency];
    const userRank = proficiencyRanks[matchedProficiency];

    let gap = 'None';
    let status = 'Ready';
    let priority = 'Low';
    let action = `Optional enhancer: gain familiarity with ${secondary}.`;

    if (userRank === 0) {
      gap = 'Moderate';
      status = 'Missing';
      priority = 'Medium';
      action = `Explore ${secondary} documentation to strengthen differentiation.`;
    } else if (userRank >= 2) {
      status = 'Strong';
      action = `Great differentiator: highlight ${secondary} on resume.`;
    }

    gapItems.push({
      skill: secondary,
      category: 'Secondary',
      requiredLevel: targetProficiency,
      userLevel: matchedProficiency,
      gap,
      status,
      priority,
      action
    });
  });

  return gapItems;
}

/**
 * Calculate numerical statistics for skill gap dashboard
 */
export function getSkillGapSummary(gapItems) {
  const total = gapItems.length;
  if (total === 0) {
    return { strong: 0, ready: 0, developing: 0, missing: 0, coveragePct: 0 };
  }

  const strong = gapItems.filter(g => g.status === 'Strong').length;
  const ready = gapItems.filter(g => g.status === 'Ready').length;
  const developing = gapItems.filter(g => g.status === 'Developing').length;
  const missing = gapItems.filter(g => g.status === 'Missing').length;

  const coveragePct = Math.round(((strong * 1.0 + ready * 0.8 + developing * 0.4) / total) * 100);

  return {
    total,
    strong,
    ready,
    developing,
    missing,
    coveragePct
  };
}
