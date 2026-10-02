/**
 * Personalized 12-Week Learning Roadmap Generator
 * Adapts to:
 * - target career
 * - user missing vs existing skills
 * - available weekly hours (5h, 10h, 20h+)
 * - 4 progressive phases: Foundations (W1-3), Core Mastery (W4-6), Advanced/Ecosystem (W7-9), Portfolio & Interview Prep (W10-12)
 */

export function generatePersonalizedRoadmap(career, userSkills = [], weeklyHours = 10, totalWeeks = 12) {
  if (!career) return null;

  const hours = Math.max(4, Math.min(40, weeklyHours || 10));
  const planDuration = [4, 8, 12].includes(Number(totalWeeks)) ? Number(totalWeeks) : 12;

  // Determine which essential skills are already present vs missing
  const userSkillNames = new Set(
    (userSkills || []).map(s => (typeof s === 'string' ? s : s.name).toLowerCase().trim())
  );

  const missingSkills = (career.essentialSkills || []).filter(
    s => !userSkillNames.has(s.toLowerCase().trim())
  );

  const primaryMissing = missingSkills.length > 0 
    ? missingSkills 
    : (career.secondarySkills || career.essentialSkills || ['Core Specialization']);

  const skillA = primaryMissing[0] || 'Core Architecture';
  const skillB = primaryMissing[1] || primaryMissing[0] || 'Modern Tooling';
  const skillC = primaryMissing[2] || primaryMissing[0] || 'Cloud & Deployment';

  // Scale weekly task scope according to available hours
  const effortDescriptor = hours >= 20 ? 'Intensive (20h/wk)' : hours >= 12 ? 'Standard (12-15h/wk)' : 'Part-Time (8-10h/wk)';

  const full12Weeks = [
    // Phase 1: Foundations & Environment
    {
      week: 1,
      phase: 'Foundations',
      title: `${career.title} Environment & Tooling Setup`,
      weeklyHoursRequired: hours,
      objectives: [
        `Configure local developer environment and Git repository for your learning track`,
        `Review fundamental concepts and industry standards for ${career.category}`,
        `Complete baseline diagnostic exercise in ${skillA}`
      ],
      skillsFocused: ['Git', 'Environment Setup', skillA],
      practiceTask: `Set up a public GitHub repository with README documenting your 12-week goal for ${career.title}.`,
      handsOnProjectMilestone: 'Initial workspace repository initialized with automated linter and sample scripts.',
      suggestedResource: career.recommendedResources?.[0],
      challenge: 'Automate your environment checks with a single startup script.'
    },
    {
      week: 2,
      phase: 'Foundations',
      title: `Deepening Syntax & Core Patterns in ${skillA}`,
      weeklyHoursRequired: hours,
      objectives: [
        `Master fundamental syntax, data structures, and standard idioms in ${skillA}`,
        `Write modular, readable code following modern community best practices`,
        `Practice decomposing problem requirements into clean unit functions`
      ],
      skillsFocused: [skillA, 'Clean Code', 'Debugging'],
      practiceTask: `Implement 5 practical algorithms or utility functions in ${skillA} with edge-case handling.`,
      handsOnProjectMilestone: 'Utility library repository committed with clean documentation.',
      suggestedResource: career.recommendedResources?.[0],
      challenge: 'Write unit tests for your utilities asserting proper error throwing.'
    },
    {
      week: 3,
      phase: 'Foundations',
      title: `Working with Structured Data & APIs`,
      weeklyHoursRequired: hours,
      objectives: [
        `Understand asynchronous execution, HTTP status codes, and JSON serialization`,
        `Connect to a public REST API and handle errors gracefully`,
        `Store and retrieve data reliably from local storage or databases`
      ],
      skillsFocused: ['REST APIs', 'Async Programming', 'Data Handling'],
      practiceTask: 'Build a small command-line or web fetcher displaying structured data from a free public API.',
      handsOnProjectMilestone: 'Working data fetching module with loading and error state screens.',
      suggestedResource: career.recommendedResources?.[1] || career.recommendedResources?.[0],
      challenge: 'Implement exponential backoff retry logic for failed network requests.'
    },

    // Phase 2: Core Engineering & Architecture
    {
      week: 4,
      phase: 'Core Skills',
      title: `Architectural Deep Dive into ${skillB}`,
      weeklyHoursRequired: hours,
      objectives: [
        `Understand state management and modular architecture in ${skillB}`,
        `Apply separation of concerns: decouple business logic from presentation`,
        `Analyze performance bottlenecks and memory considerations`
      ],
      skillsFocused: [skillB, 'Architecture', 'State Management'],
      practiceTask: `Build a multi-component interactive feature in ${skillB} with shared state.`,
      handsOnProjectMilestone: 'Milestone 1 of Capstone Project: Core domain logic implemented.',
      suggestedResource: career.recommendedResources?.[1] || career.recommendedResources?.[0],
      challenge: 'Profile component render times and eliminate redundant operations.'
    },
    {
      week: 5,
      phase: 'Core Skills',
      title: `Persistence, Schemas & Validation`,
      weeklyHoursRequired: hours,
      objectives: [
        `Design strict schemas and validate inputs at boundaries`,
        `Implement CRUD operations with database or storage layer`,
        `Ensure data integrity with constraints and sanitize untrusted inputs`
      ],
      skillsFocused: ['SQL / Database', 'Validation', 'Data Modeling'],
      practiceTask: 'Model relational tables or schemas for your portfolio project with sample test fixtures.',
      handsOnProjectMilestone: 'Milestone 2 of Capstone Project: Working schema with input validation.',
      suggestedResource: career.recommendedResources?.[2] || career.recommendedResources?.[0],
      challenge: 'Add parameterized queries or schema validators guarding against injection attacks.'
    },
    {
      week: 6,
      phase: 'Core Skills',
      title: `Security Best Practices & OWASP Fundamentals`,
      weeklyHoursRequired: hours,
      objectives: [
        `Audit your code against OWASP Top 10 vulnerabilities (XSS, Injection, CSRF)`,
        `Protect sensitive credentials using server-side environment variables`,
        `Implement secure headers and authentication token storage standards`
      ],
      skillsFocused: ['Application Security', 'Authentication', 'OWASP Top 10'],
      practiceTask: 'Review your project code with an automated linter and eliminate all unsafe DOM/eval patterns.',
      handsOnProjectMilestone: 'Security audit completed; environment secrets removed from git history.',
      challenge: 'Configure a strict Content Security Policy (CSP) header in your project.'
    },

    // Phase 3: Advanced Capabilities & Ecosystem
    {
      week: 7,
      phase: 'Deep Dive',
      title: `Containerization & Infrastructure Basics with ${skillC}`,
      weeklyHoursRequired: hours,
      objectives: [
        `Containerize your application with multi-stage Docker builds or deployment config`,
        `Configure local environment parity so code runs reliably anywhere`,
        `Understand networking, ports, and environment isolation`
      ],
      skillsFocused: ['Docker', 'Linux', skillC],
      practiceTask: 'Create an optimized Dockerfile or deployment bundle for your capstone project.',
      handsOnProjectMilestone: 'Container or production bundle building successfully and passing health checks.',
      suggestedResource: career.recommendedResources?.[0],
      challenge: 'Reduce final container or bundle size by at least 40% using multi-stage builds.'
    },
    {
      week: 8,
      phase: 'Deep Dive',
      title: `Automated Testing & Continuous Integration (CI)`,
      weeklyHoursRequired: hours,
      objectives: [
        `Write meaningful unit and integration tests covering edge cases`,
        `Configure automated GitHub Actions workflow running tests on pull request`,
        `Maintain branch protection rules and code quality gates`
      ],
      skillsFocused: ['Testing', 'CI/CD', 'GitHub Actions'],
      practiceTask: 'Add at least 5 unit tests with mock assertions and configure automated CI pipeline.',
      handsOnProjectMilestone: 'Passing CI badge in your project repository README.',
      challenge: 'Achieve >80% test coverage for core business logic functions.'
    },
    {
      week: 9,
      phase: 'Deep Dive',
      title: `Performance Optimization & Monitoring`,
      weeklyHoursRequired: hours,
      objectives: [
        `Profile application runtime, memory usage, and network payload sizes`,
        `Add structured logging and graceful error recovery`,
        `Optimize asset caching and critical rendering path`
      ],
      skillsFocused: ['Performance Optimization', 'Observability', 'Caching'],
      practiceTask: 'Measure baseline latency/size before and after applying compression and caching.',
      handsOnProjectMilestone: 'Performance benchmark report added to project documentation.',
      challenge: 'Achieve sub-100ms response or 90+ Lighthouse performance score.'
    },

    // Phase 4: Capstone Portfolio & Job Readiness
    {
      week: 10,
      phase: 'Portfolio & Job Ready',
      title: `Portfolio Capstone Project Polish`,
      weeklyHoursRequired: hours,
      objectives: [
        `Finalize portfolio project with polished UI, comprehensive README, and live demo URL`,
        `Record a concise 2-minute walkthrough video or interactive demo instructions`,
        `Document architectural decisions, technical tradeoffs, and future improvements`
      ],
      skillsFocused: ['Project Presentation', 'Technical Writing', 'Documentation'],
      practiceTask: `Polish ${career.portfolioProjectIdeas?.[0] || 'Capstone Project'} for recruiters and engineering managers.`,
      handsOnProjectMilestone: 'Live production URL accessible with clean documentation and zero console errors.',
      challenge: 'Conduct a peer code review or user test session and address 3 pieces of feedback.'
    },
    {
      week: 11,
      phase: 'Portfolio & Job Ready',
      title: `Technical & STAR Behavioral Interview Preparation`,
      weeklyHoursRequired: hours,
      objectives: [
        `Structure project experiences using the STAR method (Situation, Task, Action, Result)`,
        `Practice explaining complex technical tradeoffs under interview conditions`,
        `Rehearse core interview questions specific to ${career.title}`
      ],
      skillsFocused: ['STAR Method', 'Technical Communication', 'System Design'],
      practiceTask: `Draft written STAR responses for 3 challenging scenarios from your portfolio projects.`,
      handsOnProjectMilestone: 'Interview cheat sheet prepared covering your top 3 projects and technical challenges.',
      challenge: 'Record yourself explaining your project architecture in under 3 minutes.'
    },
    {
      week: 12,
      phase: 'Portfolio & Job Ready',
      title: `Resume Optimization, ATS Review & Next Steps`,
      weeklyHoursRequired: hours,
      objectives: [
        `Align resume bullet points with high-impact keywords for ${career.title}`,
        `Quantify project achievements with concrete metrics and technical stack keywords`,
        `Establish weekly job application and professional networking habits`
      ],
      skillsFocused: ['Resume Optimization', 'ATS Alignment', 'Career Networking'],
      practiceTask: 'Conduct a keyword audit of your resume against 5 active job postings for this role.',
      handsOnProjectMilestone: 'Job-ready portfolio, updated resume, and tailored outreach template completed.',
      challenge: 'Connect with 3 practitioners in the field and request informational feedback on your projects.'
    }
  ];

  let selectedWeeks = full12Weeks;
  if (planDuration === 4) {
    // 4-Week Fast-Track Sprint: W1 Setup, W2 Core Syntax, W4 Architecture/Capstone, W10 Portfolio Polish
    selectedWeeks = [full12Weeks[0], full12Weeks[1], full12Weeks[3], full12Weeks[9]];
  } else if (planDuration === 8) {
    // 8-Week Foundation & Capstone Track: W1-W5 Core Fundamentals, W6 Security, W10 Capstone, W11 Interviews
    selectedWeeks = [full12Weeks[0], full12Weeks[1], full12Weeks[2], full12Weeks[3], full12Weeks[4], full12Weeks[5], full12Weeks[9], full12Weeks[10]];
  }

  // Renumber weeks sequentially 1..N
  const weeks = selectedWeeks.map((w, idx) => ({
    ...w,
    week: idx + 1
  }));

  return {
    careerId: career.id,
    careerTitle: career.title,
    totalWeeks: planDuration,
    adaptedWeeklyHours: hours,
    effortDescriptor,
    weeks,
    isAIGenerated: false
  };
}
