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
      return res.status(503).json({
        error: 'Interview preparation generator is operating in offline mode.',
        code: 'NO_API_KEY'
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
