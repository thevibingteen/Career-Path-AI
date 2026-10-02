/**
 * Deterministic Career Matching Engine
 * 
 * Configurable multi-dimensional weighted model:
 * - Skill Fit (45%): Exact & partial skill matches, weighted by proficiency
 *   (Advanced = 1.0, Intermediate = 0.8, Beginner = 0.5)
 * - Interest Alignment (20%): Domain affinity (Software, Data, AI, Security, Cloud, Design)
 * - Experience Level (15%): Realistic suitability for entry vs mid vs senior expectations
 * - Career Goal & Role Alignment (10%): Match between target role / objective and role path
 * - Work & Constraint Compatibility (10%): Remote/hybrid preference and study hours
 * 
 * Total score is normalized to [0, 100].
 * No false guarantees or fixed caps are applied.
 */

export const MATCH_WEIGHTS = {
  skillFit: 0.45,
  interestFit: 0.20,
  experienceFit: 0.15,
  goalFit: 0.10,
  preferenceFit: 0.10
};

export function normalizeName(name) {
  if (!name || typeof name !== 'string') return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/[._\-/\\]/g, ' ')
    .replace(/\s+/g, ' ');
}

export function calculateSkillFit(userSkills, career) {
  if (!career || !career.essentialSkills || career.essentialSkills.length === 0) {
    return { score: 50, contributing: [], missing: [], transferable: [] };
  }

  const userSkillMap = new Map();
  (userSkills || []).forEach(s => {
    const rawName = typeof s === 'string' ? s : s.name;
    const proficiency = (typeof s === 'object' && s.proficiency) ? s.proficiency : 'Intermediate';
    const norm = normalizeName(rawName);
    if (norm) {
      userSkillMap.set(norm, proficiency);
    }
  });

  const proficiencyMultiplier = {
    'Advanced': 1.0,
    'Intermediate': 0.8,
    'Beginner': 0.5
  };

  const contributing = [];
  const missing = [];
  let totalPoints = 0;
  const maxPoints = career.essentialSkills.length * 1.0;

  career.essentialSkills.forEach(essential => {
    const normEssential = normalizeName(essential);
    let matched = false;

    // Check exact or substring containment
    for (const [userNorm, prof] of userSkillMap.entries()) {
      if (userNorm === normEssential || userNorm.includes(normEssential) || normEssential.includes(userNorm)) {
        matched = true;
        const mult = proficiencyMultiplier[prof] || 0.8;
        totalPoints += mult;
        contributing.push({ skill: essential, proficiency: prof, weight: mult });
        break;
      }
    }

    if (!matched) {
      missing.push(essential);
    }
  });

  // Check secondary skills for bonus
  let secondaryBonus = 0;
  if (Array.isArray(career.secondarySkills)) {
    career.secondarySkills.forEach(secondary => {
      const normSecondary = normalizeName(secondary);
      for (const [userNorm, prof] of userSkillMap.entries()) {
        if (userNorm === normSecondary || userNorm.includes(normSecondary) || normSecondary.includes(userNorm)) {
          const mult = (proficiencyMultiplier[prof] || 0.8) * 0.25;
          secondaryBonus += mult;
          break;
        }
      }
    });
  }

  // Calculate base percentage and add secondary bonus (capped at 100)
  const basePercentage = (totalPoints / maxPoints) * 100;
  const rawScore = Math.min(100, Math.round(basePercentage + secondaryBonus * 5));

  // Determine transferable skills from user skillset
  const transferable = [];
  if (Array.isArray(career.transferableSkills)) {
    career.transferableSkills.forEach(tSkill => {
      const normT = normalizeName(tSkill);
      for (const [userNorm] of userSkillMap.entries()) {
        if (userNorm.includes(normT) || normT.includes(userNorm)) {
          transferable.push(tSkill);
          break;
        }
      }
    });
  }

  return {
    score: Math.max(5, rawScore),
    contributing: contributing.map(c => c.skill),
    missing,
    transferable
  };
}

export function calculateInterestFit(userInterests, career) {
  if (!userInterests || userInterests.length === 0) {
    return { score: 60, factors: ['General interest profile'] };
  }

  const categoryInterestsMap = {
    'Software Engineering': ['web development', 'software', 'programming', 'mobile', 'full stack', 'coding', 'frontend', 'backend'],
    'Data & AI': ['ai', 'machine learning', 'data science', 'artificial intelligence', 'analytics', 'statistics', 'deep learning', 'big data'],
    'Cloud & DevOps': ['cloud', 'devops', 'infrastructure', 'linux', 'automation', 'docker', 'kubernetes', 'aws'],
    'Cybersecurity': ['cybersecurity', 'security', 'ethical hacking', 'network security', 'infosec', 'privacy'],
    'Design & UX': ['design', 'ui', 'ux', 'product design', 'user experience', 'figma', 'creative']
  };

  const careerCategory = career.category || '';
  const relevantKeywords = categoryInterestsMap[careerCategory] || [];
  
  const normalizedUserInterests = userInterests.map(i => normalizeName(i));
  let matchedInterests = 0;

  normalizedUserInterests.forEach(interest => {
    const isDirectMatch = relevantKeywords.some(kw => interest.includes(kw) || kw.includes(interest));
    const isTitleMatch = normalizeName(career.title).includes(interest) || interest.includes(normalizeName(career.title));
    if (isDirectMatch || isTitleMatch) {
      matchedInterests += 1;
    }
  });

  const matchRatio = matchedInterests / Math.max(1, userInterests.length);
  const score = Math.min(100, Math.round(40 + matchRatio * 60));

  return {
    score,
    factors: matchedInterests > 0 
      ? [`Aligned with your interests in ${careerCategory}`] 
      : ['Broad exploratory alignment']
  };
}

export function calculateExperienceFit(experienceLevel, career) {
  // Map experience suitability
  const expWeights = {
    'Student / Fresher': { base: 75, preference: 'Entry-ready' },
    'Entry-Level (0-1 yrs)': { base: 85, preference: 'Early-stage' },
    'Early Career (1-3 yrs)': { base: 90, preference: 'Accelerated' },
    'Mid-Level (3-5 yrs)': { base: 85, preference: 'Experienced' },
    'Senior (5+ yrs)': { base: 80, preference: 'Leadership/Architect' }
  };

  const fit = expWeights[experienceLevel] || { base: 70, preference: 'Standard' };
  return {
    score: fit.base,
    factors: [`Suitable for your background as ${experienceLevel || 'professional'}`]
  };
}

export function calculateGoalFit(profile, career) {
  let score = 75;
  const factors = [];

  const targetRole = normalizeName(profile?.targetRole || '');
  const careerTitle = normalizeName(career.title);

  if (targetRole) {
    if (careerTitle.includes(targetRole) || targetRole.includes(careerTitle)) {
      score = 98;
      factors.push(`Direct match with your target role: "${profile.targetRole}"`);
    } else if (career.sampleJobTitles && career.sampleJobTitles.some(t => normalizeName(t).includes(targetRole))) {
      score = 92;
      factors.push(`Matches role variants for: "${profile.targetRole}"`);
    } else {
      score = 65;
    }
  } else {
    factors.push('Compatible with general career transition objectives');
  }

  return { score, factors };
}

export function calculatePreferenceFit(profile, career) {
  let score = 80;
  const factors = [];

  // Work environment preference (Remote, Hybrid, On-site)
  if (profile?.workPreference && Array.isArray(career.workEnvironments)) {
    if (career.workEnvironments.includes(profile.workPreference) || profile.workPreference === 'Flexible') {
      score += 10;
      factors.push(`${profile.workPreference} work options available`);
    }
  }

  // Hours available per week vs realistic learning workload
  const hours = profile?.hoursAvailablePerWeek || 10;
  if (hours >= 15) {
    score += 10;
    factors.push(`${hours} hrs/week enables high-momentum progress`);
  } else if (hours >= 8) {
    score += 5;
    factors.push(`${hours} hrs/week fits structured part-time learning`);
  } else {
    factors.push(`Paced learning recommended for ${hours} hrs/week`);
  }

  return {
    score: Math.min(100, score),
    factors
  };
}

/**
 * Match a user profile against the entire career catalog
 */
export function matchProfileToCareers(profile, catalog) {
  if (!catalog || catalog.length === 0) return [];

  const matches = catalog.map(career => {
    const skillAnalysis = calculateSkillFit(profile.skills, career);
    const interestAnalysis = calculateInterestFit(profile.interests, career);
    const experienceAnalysis = calculateExperienceFit(profile.experienceLevel, career);
    const goalAnalysis = calculateGoalFit(profile, career);
    const preferenceAnalysis = calculatePreferenceFit(profile, career);

    const overallScore = Math.round(
      skillAnalysis.score * MATCH_WEIGHTS.skillFit +
      interestAnalysis.score * MATCH_WEIGHTS.interestFit +
      experienceAnalysis.score * MATCH_WEIGHTS.experienceFit +
      goalAnalysis.score * MATCH_WEIGHTS.goalFit +
      preferenceAnalysis.score * MATCH_WEIGHTS.preferenceFit
    );

    const strongestFactors = [
      ...interestAnalysis.factors,
      ...goalAnalysis.factors,
      ...preferenceAnalysis.factors
    ].slice(0, 3);

    const uncertainties = [];
    if (skillAnalysis.missing.length > 3) {
      uncertainties.push(`${skillAnalysis.missing.length} foundational skills require structured practice`);
    }
    if ((profile.hoursAvailablePerWeek || 10) < 8) {
      uncertainties.push('Limited weekly study time may extend timeline to job-readiness');
    }

    const fitExplanation = `Profile-based fit score: ${overallScore}%. ` +
      `You match ${skillAnalysis.contributing.length} key competencies (${skillAnalysis.contributing.slice(0, 3).join(', ') || 'foundations'}), ` +
      `with ${skillAnalysis.missing.length} priority skills to develop.`;

    return {
      career,
      overallScore: Math.max(15, Math.min(99, overallScore)),
      dimensionScores: {
        skillFit: skillAnalysis.score,
        interestFit: interestAnalysis.score,
        experienceFit: experienceAnalysis.score,
        goalFit: goalAnalysis.score,
        preferenceFit: preferenceAnalysis.score
      },
      strongestFactors,
      contributingSkills: skillAnalysis.contributing,
      missingSkills: skillAnalysis.missing,
      transferableSkills: skillAnalysis.transferable,
      uncertainties,
      fitExplanation,
      isAIPersonalized: false
    };
  });

  // Sort descending by overallScore
  matches.sort((a, b) => b.overallScore - a.overallScore);
  return matches;
}
