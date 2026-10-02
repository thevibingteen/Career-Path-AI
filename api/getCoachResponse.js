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
      error: 'Rate limit reached. Please pause for a moment before sending another message.',
      retryAfterSec: rateLimit.retryAfterSec
    });
  }

  try {
    const { message, context } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message string is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Deterministic Local Mentor Guidance Fallback
      const queryLower = (message || '').toLowerCase();
      const targetRole = context?.targetCareer || 'Software Professional';
      const hours = parseInt(context?.weeklyHours || 10, 10);
      const currentSkills = context?.currentSkills || 'Programming basics';
      const missingSkills = context?.missingSkills || 'Core architecture';

      let responseText = `You are viewing advice in Local Guidance Mode (No AI key configured). Based on your selected goal of ${targetRole} and your study budget of ${hours} hours/week:`;
      const prompts = [
        "What should I do this week?",
        "What project should I build?",
        "Am I ready for campus placements?"
      ];

      if (queryLower.includes('week') || queryLower.includes('today') || queryLower.includes('start') || queryLower.includes('learn first')) {
        responseText = `In Local Guidance Mode for ${targetRole}: Your immediate priority is to establish your fundamentals. With ${hours} hours/week available, dedicate 60% of your time to hands-on coding (building small scripts in your primary language), 20% to reading official documentation, and 20% to committing your work to Git. Check Week 1 of your personalized roadmap tab for your specific milestone.`;
      } else if (queryLower.includes('project') || queryLower.includes('portfolio') || queryLower.includes('build')) {
        responseText = `In Local Guidance Mode for ${targetRole}: A strong entry-level portfolio requires 2 substantial, deployed projects rather than 10 tiny tutorials. Build a full-featured application with user authentication, database persistence, and a clean, responsive UI. Deploy it publicly to Vercel or GitHub Pages and document your architecture in the README.`;
      } else if (queryLower.includes('placement') || queryLower.includes('interview') || queryLower.includes('intern') || queryLower.includes('ready')) {
        responseText = `In Local Guidance Mode: Campus and internship placement interviews typically evaluate three pillars: 1) Data Structures & Algorithms (arrays, strings, hash maps, trees), 2) Core CS Fundamentals (OOP, DBMS, OS, Computer Networks), and 3) Deep knowledge of your own projects using the STAR method. Visit the "Campus & Placement Prep" tab for your structured preparation checklist.`;
      } else if (queryLower.includes('hour') || queryLower.includes('time') || queryLower.includes('pace') || queryLower.includes('busy')) {
        responseText = `In Local Guidance Mode: Having limited time (${hours} hours/week or ~1 hour/day) is completely fine when approached with consistency. Daily 45-minute focused blocks beat sporadic weekend cramming. Focus on one core topic per week, finish the weekly milestone, and push your code to GitHub.`;
      } else if (queryLower.includes('resume') || queryLower.includes('cv') || queryLower.includes('ats')) {
        responseText = `In Local Guidance Mode: For entry-level resumes, keep it strictly to 1 page. Lead with technical skills and portfolio projects with live demo and GitHub links. Describe projects using the formula: "Built [X] utilizing [Tech Stack] achieving [Outcome or Metric]". Use the "Resume Assistant" tab to audit your keywords against ${targetRole}.`;
      } else {
        responseText = `In Local Guidance Mode: As you work toward ${targetRole}, focus on bridging your priority skill gaps (${missingSkills}) while leveraging your current strengths (${currentSkills}). Follow your weekly roadmap milestones and commit your exercises regularly to GitHub.`;
      }

      return res.status(200).json({
        success: true,
        result: {
          coachResponse: responseText,
          suggestedPrompts: prompts,
          isLocalFallback: true
        }
      });
    }

    const safeMessage = sanitizeUserInput(message);
    const safeCareer = sanitizeUserInput(context?.targetCareer || 'Software Professional');
    const safeSkills = sanitizeUserInput(context?.currentSkills || 'General Programming');
    const safeMissing = sanitizeUserInput(context?.missingSkills || 'Core Tools');
    const safeHours = parseInt(context?.weeklyHours || 10, 10);

    const systemInstruction = `You are an encouraging, pragmatic, and senior technical career coach.
The candidate is working toward becoming a "${safeCareer}".
Their current skills: "${safeSkills}".
Their identified skill gaps: "${safeMissing}".
Their weekly study availability: ${safeHours} hours/week.

COACHING GUIDELINES:
1. Be actionable, specific, and empathetic.
2. Give clear, direct answers without unnecessary fluff.
3. Suggest concrete code exercises, official documentation, or project steps when relevant.
4. Provide 2-3 quick follow-up prompt suggestions that the user can click next.
5. Return strict JSON only.`;

    const prompt = `Candidate question: "${safeMessage}"

Provide your coaching response in this exact JSON format:
{
  "coachResponse": "Your clear, actionable, friendly response here (2-4 paragraphs max).",
  "suggestedPrompts": [
    "Suggested follow-up 1",
    "Suggested follow-up 2",
    "Suggested follow-up 3"
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
    console.error('[api/getCoachResponse] Error:', error.message || error);
    const status = error.status || (error.code === 'NO_API_KEY' ? 503 : 500);
    return res.status(status).json({
      error: error.message || 'Error processing coach request.',
      code: error.code || 'COACH_ERROR'
    });
  }
}
