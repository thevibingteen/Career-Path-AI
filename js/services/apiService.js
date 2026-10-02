/**
 * Robust Client API Service
 * Handles serverless communication with timeout, quota detection, and graceful Local Guidance fallback.
 * Strictly avoids infinite retries and prevents exposing sensitive details.
 */

export const apiService = {
  timeoutMs: 15000,

  /**
   * Request AI-enhanced personalized advice
   */
  async getCareerAdvice(userData) {
    return this._fetchWithFallback('/api/getCareerAdvice', { userData }, 'career recommendations');
  },

  /**
   * Send question to contextual AI Career Coach
   */
  async getCoachResponse(message, context) {
    return this._fetchWithFallback('/api/getCoachResponse', { message, context }, 'career coaching');
  },

  /**
   * Request role-specific STAR interview questions
   */
  async getInterviewPrep(careerTitle, experienceLevel) {
    return this._fetchWithFallback('/api/getInterviewPrep', { careerTitle, experienceLevel }, 'interview preparation');
  },

  /**
   * Analyze resume text against target career
   */
  async analyzeResume(resumeText, career) {
    return this._fetchWithFallback('/api/analyzeResume', { resumeText, careerTitle: career.title, essentialSkills: career.essentialSkills }, 'resume analysis');
  },

  async _fetchWithFallback(url, payload, featureName) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timer);

      if (response.status === 429) {
        return {
          success: false,
          isQuotaExhausted: true,
          error: 'AI service free-tier quota is currently busy. CareerPath AI has switched to Local Guidance Mode.'
        };
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          status: response.status,
          error: errorData.error || `AI service returned status ${response.status}. Local guidance is active.`
        };
      }

      const data = await response.json();
      return {
        success: true,
        data: data.result || data
      };
    } catch (err) {
      clearTimeout(timer);
      const isTimeout = err.name === 'AbortError';
      const userMessage = isTimeout
        ? `Request timed out for ${featureName}. Falling back to deterministic local guidance.`
        : `Network connection to AI service failed. CareerPath AI is running in offline Local Guidance Mode.`;

      console.warn(`[apiService] Handled failure for ${url}:`, err.message || err);
      return {
        success: false,
        isNetworkError: true,
        isTimeout,
        error: userMessage
      };
    }
  }
};
