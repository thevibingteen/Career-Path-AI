export type EducationLevel = 
  | 'High School'
  | 'Associate Degree'
  | "Bachelor's Degree"
  | "Master's Degree"
  | 'Doctorate / PhD'
  | 'Self-Taught / Bootcamp'
  | 'Other';

export type ExperienceLevel = 
  | 'Student / Fresher'
  | 'Entry-Level (0-1 yrs)'
  | 'Early Career (1-3 yrs)'
  | 'Mid-Level (3-5 yrs)'
  | 'Senior (5+ yrs)';

export type EmploymentStatus = 
  | 'Job Seeker'
  | 'Employed Full-Time'
  | 'Employed Part-Time'
  | 'Student'
  | 'Freelancer'
  | 'Career Switcher'
  | 'Exploring';

export type WorkPreference = 
  | 'Remote'
  | 'Hybrid'
  | 'On-site'
  | 'Flexible';

export type GoalTimeline = 
  | 'Immediate (1-3 months)'
  | 'Short-term (3-6 months)'
  | 'Medium-term (6-12 months)'
  | 'Long-term (1+ years)';

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced';

export interface UserSkill {
  name: string;
  proficiency: SkillProficiency;
  category?: 'Language' | 'Framework' | 'Tool' | 'Cloud' | 'Database' | 'DevOps' | 'Soft' | 'Other';
}

export interface UserProfile {
  // Basic info (strictly privacy-conscious, name is optional)
  name?: string;
  country?: string;
  location?: string;
  preferredLanguage?: string;

  // Education
  educationLevel: EducationLevel;
  studyField: string;
  isStudentOrRecentGrad: boolean;
  graduationYear?: number;

  // Experience
  experienceLevel: ExperienceLevel;
  employmentStatus: EmploymentStatus;
  hasInternshipExperience: boolean;
  hasProjectExperience: boolean;

  // Skills
  skills: UserSkill[];

  // Interests (domain interests like AI, Web, Cloud, Security, Design, etc.)
  interests: string[];

  // Goals
  targetRole?: string;
  timeline: GoalTimeline;
  workPreference: WorkPreference;
  careerObjective: 'First Job' | 'Promotion' | 'Career Switch' | 'Freelancing' | 'Higher Studies';
  salaryTarget?: string;

  // Constraints
  hoursAvailablePerWeek: number; // e.g. 5, 10, 15, 20, 30
  learningBudget: 'Free Only' | 'Low Budget (< $50)' | 'Flexible';
  existingCommitments?: string;
}

export interface Resource {
  title: string;
  provider: string;
  category: 'Course' | 'Documentation' | 'Book' | 'Interactive' | 'Certification' | 'Project Guide';
  skill: string;
  url: string;
  isFree: boolean;
  estimatedEffort?: string;
  verificationDate: string; // e.g. "2026-03"
}

export interface Career {
  id: string;
  title: string;
  category: 'Software Engineering' | 'Data & AI' | 'Cloud & DevOps' | 'Cybersecurity' | 'Design & UX' | 'Product & Management';
  description: string;
  responsibilities: string[];
  essentialSkills: string[];
  secondarySkills: string[];
  prerequisites: string[];
  transferableSkills: string[];
  sampleJobTitles: string[];
  industries: string[];
  workEnvironments: ('Remote' | 'Hybrid' | 'On-site')[];
  learningPriorities: string[];
  portfolioProjectIdeas: string[];
  interviewTopics: string[];
  recommendedResources: Resource[];
  // Stable indicative compensation guidance (with source & note, never fabricated live data)
  indicativeCompensationNotice: string;
}

export interface SkillGapItem {
  skill: string;
  requiredLevel: SkillProficiency;
  userLevel: SkillProficiency | 'None';
  gap: 'None' | 'Minor' | 'Moderate' | 'Significant';
  status: 'Strong' | 'Ready' | 'Developing' | 'Missing';
  priority: 'High' | 'Medium' | 'Low';
  action: string;
}

export interface CareerMatch {
  career: Career;
  overallScore: number; // 0-100 calculated deterministically
  dimensionScores: {
    skillFit: number;
    interestFit: number;
    experienceFit: number;
    goalFit: number;
    preferenceFit: number;
  };
  strongestFactors: string[];
  contributingSkills: string[];
  missingSkills: string[];
  transferableSkills: string[];
  uncertainties: string[];
  fitExplanation: string; // Generated deterministically or enriched by Gemini
  isAIPersonalized: boolean;
}

export interface RoadmapWeek {
  week: number;
  phase: 'Foundations' | 'Core Skills' | 'Deep Dive' | 'Portfolio & Job Ready';
  title: string;
  objectives: string[];
  skillsFocused: string[];
  practiceTask: string;
  handsOnProjectMilestone: string;
  suggestedResource?: Resource;
  weeklyHoursRequired: number;
  challenge?: string;
  completed?: boolean;
}

export interface Roadmap {
  careerId: string;
  careerTitle: string;
  totalWeeks: number;
  adaptedWeeklyHours: number;
  weeks: RoadmapWeek[];
  isAIGenerated: boolean;
}

export interface ProjectRecommendation {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  skillsPracticed: string[];
  features: string[];
  recommendedTechStack: string[];
  milestones: string[];
  portfolioValue: string;
  interviewTalkingPoints: string[];
  extensionIdeas: string[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'Technical' | 'Behavioral' | 'System Design' | 'Role-Specific';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  guidance: string; // Tips & STAR framework approach
  sampleTalkingPoints: string[];
}

export interface InterviewPlan {
  careerId: string;
  careerTitle: string;
  questions: InterviewQuestion[];
  starFrameworkGuide: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
}

export interface ReadinessScore {
  overallScore: number; // 0-100
  dimensions: {
    skillCoverage: number;
    projectsCompleted: number;
    resumeKeywords: number;
    interviewPreparation: number;
    roadmapProgress: number;
  };
  statusLabel: 'Getting Started' | 'Developing' | 'Nearly Ready' | 'Job Ready';
  actionableNextSteps: string[];
}

export interface CoachMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
}

export interface UserProgress {
  selectedCareerId?: string;
  completedRoadmapWeeks: number[];
  completedProjectIds: string[];
  practicedInterviewQuestionIds: string[];
  completedSkillNames: string[];
  notes: Record<string, string>;
  lastUpdated: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  useAIIfAvailable: boolean;
  telemetryConsent: boolean;
}

export interface CareerGuidanceState {
  profile: UserProfile | null;
  matches: CareerMatch[];
  selectedCareer: Career | null;
  skillGaps: SkillGapItem[];
  roadmap: Roadmap | null;
  projects: ProjectRecommendation[];
  interviewPlan: InterviewPlan | null;
  readiness: ReadinessScore | null;
  coachMessages: CoachMessage[];
  progress: UserProgress;
  settings: AppSettings;
  isAIActive: boolean;
  aiErrorMessage?: string;
}
