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
      error: 'Rate limit exceeded. Please wait a moment.',
      retryAfterSec: rateLimit.retryAfterSec
    });
  }

  try {
    const { resumeText, careerTitle, essentialSkills } = req.body || {};
    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide at least a couple of sentences of resume text to analyze.' });
    }

    // Limit resume length to prevent token abuse
    const safeResume = sanitizeUserInput(resumeText.slice(0, 3000));
    const safeTitle = sanitizeUserInput(careerTitle || 'Software Professional');
    const safeEssential = Array.isArray(essentialSkills) 
      ? essentialSkills.join(', ') 
      : sanitizeUserInput(essentialSkills || '');

    if (!process.env.GEMINI_API_KEY) {
      // Deterministic keyword matching fallback
      const foundSkills = [];
      const missingSkills = [];
      const lower = safeResume.toLowerCase();
      (Array.isArray(essentialSkills) ? essentialSkills : []).forEach(s => {
        if (lower.includes(s.toLowerCase())) {
          foundSkills.push(s);
        } else {
          missingSkills.push(s);
        }
      });

      return res.status(200).json({
        success: true,
        result: {
          matchedKeywords: foundSkills,
          missingKeywords: missingSkills,
          strengths: ['Identified existing skills in your profile'],
          recommendedImprovements: [
            'Quantify your bullet points with measurable impact (e.g., latency, users, throughput)',
            'Include specific tools and libraries used in each project description'
          ],
          isLocalFallback: true
        }
      });
    }

    const systemInstruction = `You are an expert technical resume coach and ATS keyword specialist.
Analyze the user's provided resume text against the target role: "${safeTitle}".
Target essential competencies: ${safeEssential}.
CRITICAL RULES:
1. NEVER fabricate qualifications, experiences, degrees, or employers.
2. Provide suggestions as suggestions only.
3. Highlight missing keywords, wording enhancements, and formatting improvements.
4. Output strict JSON only.`;

    const prompt = `Candidate Resume Text:
"""
${safeResume}
"""

Analyze and return JSON matching this structure:
{
  "matchedKeywords": ["Key skill found 1", "Key skill found 2"],
  "missingKeywords": ["Important missing keyword 1", "Important missing keyword 2"],
  "strengths": ["Clear strength in resume 1", "Strength 2"],
  "recommendedImprovements": [
    "Actionable bullet point rewording recommendation 1",
    "Section or formatting enhancement 2"
  ],
  "atsMatchScoreEstimate": 68
}`;

    const geminiResult = await callGeminiStructured({
      systemInstruction,
      prompt,
      temperature: 0.2
    });

    return res.status(200).json({
      success: true,
      result: geminiResult
    });
  } catch (error) {
    console.error('[api/analyzeResume] Error:', error.message || error);
    const status = error.status || (error.code === 'NO_API_KEY' ? 503 : 500);
    return res.status(status).json({
      error: error.message || 'Error analyzing resume.',
      code: error.code || 'RESUME_ERROR'
    });
  }
}
