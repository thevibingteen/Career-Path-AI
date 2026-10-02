import { callGeminiStructured, sanitizeUserInput } from './_gemini.js';
import { checkRateLimit } from './_rateLimiter.js';

export default async function handler(req, res) {
  // 1. Validate HTTP Method
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Best-effort Rate Limiting
  const rateLimit = checkRateLimit(req);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Please wait a moment before sending another request.',
      retryAfterSec: rateLimit.retryAfterSec
    });
  }

  try {
    const { userData } = req.body || {};
    if (!userData || typeof userData !== 'object') {
      return res.status(400).json({ error: 'Invalid request: "userData" object is required.' });
    }

    // 3. Check for API key presence
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'AI service is currently not configured. Local Guidance Mode is available.',
        code: 'NO_API_KEY'
      });
    }

    // 4. Sanitize Inputs
    const safeSkills = Array.isArray(userData.skills)
      ? userData.skills.map(s => typeof s === 'string' ? s : s.name).join(', ')
      : sanitizeUserInput(userData.skills || '');

    const safeExperience = sanitizeUserInput(userData.experienceLevel || userData.experience || 'Entry-Level');
    const safeEducation = sanitizeUserInput(userData.educationLevel || 'Not specified');
    const safeInterests = Array.isArray(userData.interests)
      ? userData.interests.map(i => sanitizeUserInput(i)).join(', ')
      : sanitizeUserInput(userData.interests || '');
    const safeGoals = sanitizeUserInput(userData.targetRole || userData.goals || '');
    const safeHours = parseInt(userData.hoursAvailablePerWeek || 10, 10);

    const systemInstruction = `You are a thoughtful, realistic career advisor.
Your objective is to provide personalized commentary on suitable career paths.
CRITICAL RULES:
1. Do NOT fabricate live salary figures, hiring guarantees, or employment rates.
2. Clearly identify genuine strengths and realistic skill gaps.
3. Suggest practical portfolio projects tailored to the user's available time.
4. Output strict JSON only matching the requested schema.`;

    const prompt = `Analyze this candidate profile:
- Primary Skills: ${safeSkills}
- Experience Level: ${safeExperience}
- Education: ${safeEducation}
- Domain Interests: ${safeInterests}
- Career Goal: ${safeGoals}
- Available Study Hours/Week: ${safeHours}

Provide an array of up to 3 personalized career recommendations in this exact JSON structure:
{
  "recommendations": [
    {
      "careerTitle": "Exact Career Title",
      "personalizedSummary": "2-3 sentences explaining why this role fits their specific combination of skills and interests",
      "keyStrengths": ["Strength 1", "Strength 2"],
      "priorityLearningFocus": ["Skill to prioritize first", "Skill to prioritize second"],
      "recommendedProject": {
        "title": "Project Title",
        "description": "What to build and why it demonstrates competence",
        "techStack": ["Tech 1", "Tech 2"]
      }
    }
  ]
}`;

    const geminiResult = await callGeminiStructured({
      systemInstruction,
      prompt,
      temperature: 0.2
    });

    return res.status(200).json({
      success: true,
      result: geminiResult.recommendations || geminiResult,
      isAIEnriched: true
    });
  } catch (error) {
    console.error('[api/getCareerAdvice] Error:', error.message || error);
    const status = error.status || (error.code === 'NO_API_KEY' ? 503 : 500);
    return res.status(status).json({
      error: error.message || 'An error occurred while generating recommendations.',
      code: error.code || 'AI_ERROR'
    });
  }
}
