import { callGeminiStructured, sanitizeUserInput } from './_gemini.js';
import { checkRateLimit } from './_rateLimiter.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rateLimit = checkRateLimit(req);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: 'Too many requests. Please wait a moment.',
      retryAfterSec: rateLimit.retryAfterSec
    });
  }

  try {
    const { careerTitle, experienceLevel, focusArea } = req.body || {};
    if (!careerTitle) {
      return res.status(400).json({ error: 'careerTitle is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Deterministic Local Interview Preparation Guidance Fallback
      const safeRole = careerTitle || 'Software Engineer';
      const roleLower = safeRole.toLowerCase();

      let technicalQuestions = [
        {
          id: 'tech-1',
          question: `Explain how you design and structure a clean, maintainable application for ${safeRole}. What principles guide your architectural decisions?`,
          category: 'Technical Architecture',
          difficulty: 'Intermediate',
          guidance: 'Discuss separation of concerns, modularity, single responsibility principle, and how you handle state and error boundaries.',
          sampleTalkingPoints: [
            'Modular folder structure separating presentation, business logic, and API adapters',
            'Defensive error handling and boundary logging',
            'Predictable data flow and dependency injection'
          ]
        },
        {
          id: 'tech-2',
          question: `How do you measure and optimize performance and latency in your ${safeRole} projects?`,
          category: 'Performance & Scalability',
          difficulty: 'Intermediate',
          guidance: 'Mention specific profiling tools, caching strategies, reducing payload sizes, and addressing bottlenecks.',
          sampleTalkingPoints: [
            'Profiling runtime execution and network waterfalls using developer tools',
            'Effective caching (in-memory, HTTP cache headers, or Redis where applicable)',
            'Asynchronous processing and lazy-loading of heavy modules'
          ]
        }
      ];

      if (roleLower.includes('front') || roleLower.includes('ui') || roleLower.includes('web')) {
        technicalQuestions.push({
          id: 'tech-frontend',
          question: 'What are Core Web Vitals (LCP, INP, CLS) and how do you optimize frontend rendering performance?',
          category: 'Frontend Specialization',
          difficulty: 'Intermediate',
          guidance: 'Explain the difference between bundle size optimization, critical rendering path, image compression, and minimizing layout shifts.',
          sampleTalkingPoints: ['Lazy loading non-critical assets', 'Using CSS transform for smooth GPU animations', 'Minimizing re-renders with memoization and shallow props comparisons']
        });
      } else if (roleLower.includes('data') || roleLower.includes('machine') || roleLower.includes('ai')) {
        technicalQuestions.push({
          id: 'tech-data',
          question: 'How do you detect and mitigate data leakage or overfitting during model development and validation?',
          category: 'Data Science & ML',
          difficulty: 'Intermediate',
          guidance: 'Explain stratified k-fold cross-validation, feature pipeline isolation before splitting, and regularization techniques.',
          sampleTalkingPoints: ['Fitting transforms only on training splits', 'L1/L2 regularization and early stopping', 'Evaluating ROC-AUC, precision-recall curve alongside raw accuracy']
        });
      } else if (roleLower.includes('cloud') || roleLower.includes('devops') || roleLower.includes('security')) {
        technicalQuestions.push({
          id: 'tech-cloud',
          question: 'How do you implement zero-trust security and automated CI/CD pipeline gating for production deployments?',
          category: 'Infrastructure & DevOps',
          difficulty: 'Intermediate',
          guidance: 'Walk through secret management, immutable infrastructure, automated lint/test stages, and blue-green rollback strategies.',
          sampleTalkingPoints: ['Injecting environment secrets at runtime rather than baking into images', 'Automated security vulnerability scanning (SAST/DAST)', 'Health check verification before traffic cutover']
        });
      } else {
        technicalQuestions.push({
          id: 'tech-general',
          question: 'Explain the trade-offs between SQL (relational) and NoSQL (document/key-value) databases for this application type.',
          category: 'Data Architecture',
          difficulty: 'Intermediate',
          guidance: 'Focus on ACID transactions, schema consistency vs flexible schemas, and read/write scaling characteristics.',
          sampleTalkingPoints: ['Relational databases guarantee strict ACID compliance and relational integrity', 'NoSQL facilitates horizontal partitioning and unstructured schemaless documents', 'Choose based on query patterns and data consistency requirements']
        });
      }

      const questions = [
        ...technicalQuestions,
        {
          id: 'beh-1',
          question: 'Tell me about a challenging technical bug or blocker you encountered in a project, and how you resolved it.',
          category: 'Behavioral (STAR Method)',
          difficulty: 'Beginner to Intermediate',
          guidance: 'Structure your response strictly with STAR: Situation (context), Task (your goal), Action (the specific steps YOU took), Result (measurable outcome and learnings).',
          sampleTalkingPoints: [
            'Clearly explain the symptom vs the underlying root cause discovered through systematic debugging',
            'Highlight how you validated the fix with automated regression tests',
            'Reflect on what architectural safeguard you implemented to prevent recurrence'
          ]
        },
        {
          id: 'beh-2',
          question: 'How do you prioritize learning new technologies when preparing for your target career while managing limited time?',
          category: 'Growth & Work Style',
          difficulty: 'Beginner',
          guidance: 'Demonstrate self-awareness, pragmatic prioritization of fundamentals over fleeting frameworks, and deliberate daily practice.',
          sampleTalkingPoints: [
            'Focusing on first principles (e.g. vanilla JavaScript and HTTP before frameworks)',
            'Building working projects rather than getting stuck in tutorial loops',
            'Tracking progress with measurable weekly milestones and Git commits'
          ]
        }
      ];

      const generalTips = [
        `Structure every project and behavioral story with the STAR method (Situation, Task, Action, Result).`,
        `For technical coding assessments, articulate your thought process aloud before writing code. State your time and space complexity (Big-O).`,
        `Be prepared to explain every single library and design decision mentioned on your resume or portfolio.`,
        `Ask thoughtful questions at the end of the interview about team engineering practices, CI/CD, and mentorship.`
      ];

      return res.status(200).json({
        success: true,
        result: {
          questions,
          generalTips,
          isLocalFallback: true
        }
      });
    }

    const safeTitle = sanitizeUserInput(careerTitle);
    const safeExp = sanitizeUserInput(experienceLevel || 'Entry-Level');
    const safeFocus = sanitizeUserInput(focusArea || 'Comprehensive');

    const systemInstruction = `You are a principal engineering hiring manager.
Generate realistic interview questions for a "${safeTitle}" candidate (${safeExp}).
Include both technical architecture questions and behavioral scenarios suitable for the STAR method.
Do not claim these exact questions are guaranteed in any specific interview.
Return strict JSON only.`;

    const prompt = `Generate 5 realistic interview practice questions for a ${safeExp} ${safeTitle}.
Format as JSON:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text",
      "category": "Technical | Behavioral | Role-Specific",
      "difficulty": "Beginner | Intermediate | Advanced",
      "guidance": "How to structure the answer effectively using the STAR method or technical reasoning",
      "sampleTalkingPoints": ["Point 1", "Point 2", "Point 3"]
    }
  ],
  "generalTips": [
    "Tip 1 for interviewing for this specific role",
    "Tip 2"
  ]
}`;

    const geminiResult = await callGeminiStructured({
      systemInstruction,
      prompt,
      temperature: 0.3
    });

    return res.status(200).json({
      success: true,
      result: geminiResult
    });
  } catch (error) {
    console.error('[api/getInterviewPrep] Error:', error.message || error);
    const status = error.status || (error.code === 'NO_API_KEY' ? 503 : 500);
    return res.status(status).json({
      error: error.message || 'Error generating interview preparation.',
      code: error.code || 'INTERVIEW_ERROR'
    });
  }
}
