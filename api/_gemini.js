/**
 * Google Gemini API Serverless Client
 * - Configurable model via GEMINI_MODEL (defaults to current free-tier supported model)
 * - Strict server-side key management via GEMINI_API_KEY
 * - Structured JSON output (responseMimeType: 'application/json')
 * - Prompt injection defense with systemInstruction separation
 * - Request timeouts, limited exponential backoff, safe error reporting
 */

export const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
export const TIMEOUT_MS = parseInt(process.env.GEMINI_TIMEOUT_MS || '15000', 10);
export const MAX_RETRIES = parseInt(process.env.GEMINI_MAX_RETRIES || '2', 10);

/**
 * Call Gemini API with structured JSON output and error handling
 */
export async function callGeminiStructured({
  systemInstruction,
  prompt,
  schema = null,
  temperature = 0.2
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const error = new Error('GEMINI_API_KEY is not configured on the server.');
    error.code = 'NO_API_KEY';
    throw error;
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    systemInstruction: systemInstruction ? {
      parts: [{ text: systemInstruction }]
    } : undefined,
    generationConfig: {
      temperature,
      topP: 0.8,
      responseMimeType: 'application/json'
    }
  };

  let attempt = 0;
  let lastError = null;

  while (attempt <= MAX_RETRIES) {
    attempt++;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.status === 429) {
        const error = new Error('Gemini API free-tier quota exceeded.');
        error.status = 429;
        throw error;
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error(`Gemini API error (Status ${response.status}):`, errorText.slice(0, 300));
        const error = new Error(`Gemini API upstream error (${response.status})`);
        error.status = response.status >= 500 ? 502 : response.status;
        throw error;
      }

      const responseJson = await response.json();
      const rawText = responseJson?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error('Empty response received from Gemini API');
      }

      // Parse JSON from structured output
      const parsedData = JSON.parse(rawText);
      return parsedData;
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;

      // Do NOT retry 429 quota exhaustion or client input errors
      if (err.status === 429 || (err.status && err.status < 500)) {
        throw err;
      }

      // Retry once if transient network/timeout error
      if (attempt <= MAX_RETRIES) {
        const delay = Math.pow(2, attempt) * 500;
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }

  throw lastError || new Error('Failed to communicate with Gemini API');
}

/**
 * Sanitizes user input before embedding into prompts to guard against prompt injection
 */
export function sanitizeUserInput(input) {
  if (typeof input !== 'string') return '';
  // Truncate to reasonable length and strip suspicious instruction override tokens
  return input
    .slice(0, 2000)
    .replace(/```/g, '')
    .trim();
}
