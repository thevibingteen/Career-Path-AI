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
      return res.status(503).json({
        error: 'AI Career Coach requires an active Gemini API key. Local mode is active.',
        code: 'NO_API_KEY'
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
