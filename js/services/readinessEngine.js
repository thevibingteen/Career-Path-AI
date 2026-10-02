/**
 * Job-Readiness & Preparation Progress Model
 * 
 * Transparent, multi-factor calculation of current preparation status:
 * 1. Skill Coverage (35%): How many essential skills meet target proficiency
 * 2. Roadmap Milestone Progress (25%): Percentage of weekly roadmap tasks completed
 * 3. Portfolio Projects (20%): Completed realistic portfolio deliverables
 * 4. Interview Preparation (10%): Practiced behavioral & technical questions
 * 5. Resume / ATS Alignment (10%): Profile keywords matched to role requirements
 * 
 * Note: Clearly labeled as "Preparation Progress" — never false hiring probability.
 */

export function calculateReadinessScore({
  skillGaps = [],
  completedRoadmapWeeks = [],
  totalRoadmapWeeks = 12,
  completedProjects = [],
  practicedInterviewQuestions = [],
  resumeAnalysisScore = 0
}) {
  // 1. Skill Coverage Score (0-100)
  let skillCoverage = 0;
  if (skillGaps.length > 0) {
    const essentialGaps = skillGaps.filter(g => g.category === 'Essential');
    const totalEssential = essentialGaps.length || 1;
    const readyOrStrong = essentialGaps.filter(g => g.status === 'Strong' || g.status === 'Ready').length;
    const developing = essentialGaps.filter(g => g.status === 'Developing').length;
    skillCoverage = Math.min(100, Math.round(((readyOrStrong + developing * 0.5) / totalEssential) * 100));
  }

  // 2. Roadmap Progress Score (0-100)
  const roadmapProgress = totalRoadmapWeeks > 0
    ? Math.min(100, Math.round((completedRoadmapWeeks.length / totalRoadmapWeeks) * 100))
    : 0;

  // 3. Projects Score (0-100)
  // 2 substantial portfolio projects are considered 100% preparation benchmark
  const projectsScore = Math.min(100, Math.round((completedProjects.length / 2) * 100));

  // 4. Interview Preparation (0-100)
  // Practicing at least 5 key questions is considered baseline target
  const interviewScore = Math.min(100, Math.round((practicedInterviewQuestions.length / 5) * 100));

  // 5. Resume / ATS Alignment (0-100)
  const resumeScore = Math.max(0, Math.min(100, resumeAnalysisScore || 40));

  // Weighted overall calculation
  const overallScore = Math.round(
    skillCoverage * 0.35 +
    roadmapProgress * 0.25 +
    projectsScore * 0.20 +
    interviewScore * 0.10 +
    resumeScore * 0.10
  );

  let statusLabel = 'Getting Started';
  if (overallScore >= 80) {
    statusLabel = 'Job Ready';
  } else if (overallScore >= 60) {
    statusLabel = 'Nearly Ready';
  } else if (overallScore >= 35) {
    statusLabel = 'Developing';
  }

  const actionableNextSteps = [];
  if (skillCoverage < 70) {
    const topMissing = skillGaps.find(g => g.status === 'Missing');
    actionableNextSteps.push(topMissing 
      ? `Bridge essential skill gap: start practicing ${topMissing.skill}.`
      : 'Build proficiency in remaining core competencies.');
  }
  if (completedProjects.length < 2) {
    actionableNextSteps.push(`Build ${2 - completedProjects.length} more portfolio project to showcase practical application.`);
  }
  if (roadmapProgress < 50) {
    actionableNextSteps.push('Work through your weekly roadmap milestones to maintain structured momentum.');
  }
  if (practicedInterviewQuestions.length < 3) {
    actionableNextSteps.push('Practice answering STAR framework behavioral and technical interview questions.');
  }

  return {
    overallScore,
    statusLabel,
    dimensions: {
      skillCoverage,
      roadmapProgress,
      projectsCompleted: projectsScore,
      interviewPreparation: interviewScore,
      resumeKeywords: resumeScore
    },
    actionableNextSteps: actionableNextSteps.slice(0, 3)
  };
}
