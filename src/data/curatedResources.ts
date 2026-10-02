import { Resource } from '../types';

export const verifiedResources: Record<string, Resource[]> = {
  javascript: [
    {
      title: 'MDN Web Docs: JavaScript Guide',
      provider: 'Mozilla',
      category: 'Documentation',
      skill: 'JavaScript',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      isFree: true,
      estimatedEffort: '30-40 hours',
      verificationDate: '2026-03'
    },
    {
      title: 'JavaScript Algorithms and Data Structures',
      provider: 'FreeCodeCamp',
      category: 'Course',
      skill: 'JavaScript',
      url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/',
      isFree: true,
      estimatedEffort: '300 hours (self-paced)',
      verificationDate: '2026-03'
    }
  ],
  react: [
    {
      title: 'Official React Documentation & Interactive Tutorials',
      provider: 'React Core Team',
      category: 'Documentation',
      skill: 'React',
      url: 'https://react.dev/learn',
      isFree: true,
      estimatedEffort: '25 hours',
      verificationDate: '2026-03'
    },
    {
      title: 'Full Stack Open: Deep Dive Into Modern Web Development',
      provider: 'University of Helsinki',
      category: 'Course',
      skill: 'React',
      url: 'https://fullstackopen.com/en/',
      isFree: true,
      estimatedEffort: '100+ hours',
      verificationDate: '2026-03'
    }
  ],
  python: [
    {
      title: 'Official Python Tutorial',
      provider: 'Python Software Foundation',
      category: 'Documentation',
      skill: 'Python',
      url: 'https://docs.python.org/3/tutorial/',
      isFree: true,
      estimatedEffort: '20 hours',
      verificationDate: '2026-03'
    },
    {
      title: 'CS50P: Introduction to Programming with Python',
      provider: 'Harvard University / edX',
      category: 'Course',
      skill: 'Python',
      url: 'https://cs50.harvard.edu/python/',
      isFree: true,
      estimatedEffort: '60 hours',
      verificationDate: '2026-03'
    }
  ],
  machineLearning: [
    {
      title: 'Kaggle Intro & Intermediate Machine Learning Courses',
      provider: 'Kaggle',
      category: 'Interactive',
      skill: 'Machine Learning',
      url: 'https://www.kaggle.com/learn/intro-to-machine-learning',
      isFree: true,
      estimatedEffort: '15 hours',
      verificationDate: '2026-03'
    },
    {
      title: 'Machine Learning Specialization',
      provider: 'DeepLearning.AI / Coursera',
      category: 'Course',
      skill: 'Machine Learning',
      url: 'https://www.coursera.org/specializations/machine-learning-introduction',
      isFree: false, // Audit option available on Coursera
      estimatedEffort: '3 months (9 hrs/wk)',
      verificationDate: '2026-03'
    }
  ],
  cloudDevOps: [
    {
      title: 'Docker Getting Started Guide & Playground',
      provider: 'Docker Inc.',
      category: 'Documentation',
      skill: 'Docker',
      url: 'https://docs.docker.com/get-started/',
      isFree: true,
      estimatedEffort: '15 hours',
      verificationDate: '2026-03'
    },
    {
      title: 'Kubernetes Basics Interactive Tutorials',
      provider: 'Cloud Native Computing Foundation (CNCF)',
      category: 'Interactive',
      skill: 'Kubernetes',
      url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/',
      isFree: true,
      estimatedEffort: '20 hours',
      verificationDate: '2026-03'
    },
    {
      title: 'AWS Skill Builder & Free Digital Training',
      provider: 'Amazon Web Services',
      category: 'Course',
      skill: 'AWS Cloud',
      url: 'https://explore.skillbuilder.aws/',
      isFree: true,
      estimatedEffort: 'Varies by module',
      verificationDate: '2026-03'
    }
  ],
  design: [
    {
      title: 'Figma Learn: Official Design Fundamentals',
      provider: 'Figma',
      category: 'Interactive',
      skill: 'Figma & UI Design',
      url: 'https://help.figma.com/hc/en-us/categories/360002042553-Figma-Design',
      isFree: true,
      estimatedEffort: '20 hours',
      verificationDate: '2026-03'
    },
    {
      title: 'Google UX Design Professional Certificate',
      provider: 'Google / Coursera',
      category: 'Certification',
      skill: 'UX Research & Design',
      url: 'https://www.coursera.org/professional-certificates/google-ux-design',
      isFree: false,
      estimatedEffort: '6 months (10 hrs/wk)',
      verificationDate: '2026-03'
    }
  ],
  cybersecurity: [
    {
      title: 'OWASP Top 10 Security Risks and Countermeasures',
      provider: 'OWASP Foundation',
      category: 'Documentation',
      skill: 'Web Security',
      url: 'https://owasp.org/www-project-top-ten/',
      isFree: true,
      estimatedEffort: '15 hours',
      verificationDate: '2026-03'
    },
    {
      title: 'OverTheWire: Bandit Wargame (Linux Security Fundamentals)',
      provider: 'OverTheWire Community',
      category: 'Interactive',
      skill: 'Linux Security',
      url: 'https://overthewire.org/wargames/bandit/',
      isFree: true,
      estimatedEffort: '25 hours',
      verificationDate: '2026-03'
    }
  ]
};
