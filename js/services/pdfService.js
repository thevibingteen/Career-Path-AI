/**
 * Career Report Export Service
 * Produces structured, professional printable reports and downloadable PDFs.
 * Includes complete disclaimer, skill gap breakdowns, roadmap milestones,
 * and transparent fit scores.
 */

export const pdfService = {
  /**
   * Generates a printable, highly styled career plan report in a new tab / print dialog.
   * Universal compatibility across mobile and desktop browsers with zero dependencies.
   */
  openPrintableReport({ profile, selectedCareer, match, skillGaps, roadmap, readiness }) {
    if (!selectedCareer) {
      alert('Please select a career path first to export your detailed report.');
      return;
    }

    const reportWindow = window.open('', '_blank');
    if (!reportWindow) {
      alert('Popup blocker prevented opening the report. Please allow popups for this site.');
      return;
    }

    const dateStr = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const userSkillsFormatted = (profile?.skills || [])
      .map(s => `${s.name} (${s.proficiency})`)
      .join(', ') || 'Not specified';

    const missingSkills = skillGaps
      .filter(g => g.status === 'Missing')
      .map(g => g.skill)
      .join(', ') || 'None';

    const strongSkills = skillGaps
      .filter(g => g.status === 'Strong' || g.status === 'Ready')
      .map(g => g.skill)
      .join(', ') || 'Foundational competencies';

    const roadmapWeeksHtml = (roadmap?.weeks || []).map(w => `
      <div class="week-row">
        <div class="week-badge">Week ${w.week}: ${w.phase}</div>
        <div class="week-title"><strong>${escapeHtml(w.title)}</strong></div>
        <div class="week-objectives">
          <ul>${w.objectives.map(o => `<li>${escapeHtml(o)}</li>`).join('')}</ul>
        </div>
        <div class="week-task"><strong>Milestone:</strong> ${escapeHtml(w.handsOnProjectMilestone)}</div>
      </div>
    `).join('');

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CareerPath AI - ${escapeHtml(selectedCareer.title)} Plan</title>
  <style>
    @page { margin: 15mm; size: A4; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      line-height: 1.5;
      font-size: 11pt;
      margin: 0;
      padding: 20px;
    }
    .header {
      border-bottom: 2px solid #4f46e5;
      padding-bottom: 12px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .header h1 { margin: 0; color: #1e1b4b; font-size: 20pt; }
    .header .subtitle { color: #64748b; font-size: 10pt; }
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 16px;
      page-break-inside: avoid;
    }
    .card h2 { margin-top: 0; font-size: 13pt; color: #4338ca; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 10pt; }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 9pt;
      font-weight: 600;
      background: #e0e7ff;
      color: #3730a3;
    }
    .week-row {
      border-bottom: 1px dashed #cbd5e1;
      padding: 8px 0;
      page-break-inside: avoid;
    }
    .week-badge { font-size: 9pt; font-weight: bold; color: #4f46e5; }
    .week-title { font-size: 11pt; margin: 2px 0; }
    .week-objectives { font-size: 9.5pt; color: #334155; margin: 4px 0; }
    .week-objectives ul { margin: 2px 0 2px 20px; padding: 0; }
    .week-task { font-size: 9.5pt; color: #0f172a; }
    .disclaimer {
      margin-top: 24px;
      padding: 12px;
      background: #f1f5f9;
      border-left: 4px solid #64748b;
      font-size: 8.5pt;
      color: #475569;
    }
    @media print {
      .no-print { display: none; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 16px; background: #eef2ff; padding: 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
    <div><strong>Ready to Print / Save as PDF:</strong> Click the button or press Ctrl+P.</div>
    <button onclick="window.print()" style="background: #4f46e5; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">Print / Save as PDF</button>
  </div>

  <div class="header">
    <div>
      <h1>CareerPath AI Report</h1>
      <div class="subtitle">Personalized Career Trajectory & Learning Plan</div>
    </div>
    <div style="text-align: right; font-size: 9pt; color: #64748b;">
      <div>Generated: ${dateStr}</div>
      <div>Target Role: <strong>${escapeHtml(selectedCareer.title)}</strong></div>
    </div>
  </div>

  <div class="card">
    <h2>1. Candidate Profile & Fit Assessment</h2>
    <div class="meta-grid">
      <div><strong>Candidate:</strong> ${escapeHtml(profile?.name || 'Anonymous User')}</div>
      <div><strong>Experience Level:</strong> ${escapeHtml(profile?.experienceLevel || 'Entry-Level')}</div>
      <div><strong>Work Preference:</strong> ${escapeHtml(profile?.workPreference || 'Remote')}</div>
      <div><strong>Weekly Commitment:</strong> ${profile?.hoursAvailablePerWeek || 10} hours/week</div>
    </div>
    <div style="margin-top: 10px;">
      <strong>Profile-Based Fit Score:</strong> <span class="badge">${match?.overallScore || 85}% Match</span>
      <p style="margin: 6px 0 0 0; font-size: 10pt; color: #334155;">${escapeHtml(match?.fitExplanation || selectedCareer.description)}</p>
    </div>
  </div>

  <div class="card">
    <h2>2. Competency Analysis & Skill Gap Matrix</h2>
    <div style="font-size: 10pt;">
      <div style="margin-bottom: 6px;"><strong>Validated Strengths:</strong> ${escapeHtml(strongSkills)}</div>
      <div style="margin-bottom: 6px;"><strong>Priority Skill Gaps to Bridge:</strong> ${escapeHtml(missingSkills)}</div>
      <div><strong>Current Skills Inventory:</strong> ${escapeHtml(userSkillsFormatted)}</div>
    </div>
  </div>

  <div class="card">
    <h2>3. 12-Week Personalized Action Roadmap</h2>
    <p style="font-size: 9.5pt; color: #475569; margin-top: 0;">Adapted to your ${profile?.hoursAvailablePerWeek || 10} hours/week available study budget.</p>
    ${roadmapWeeksHtml}
  </div>

  <div class="card">
    <h2>4. Portfolio Projects & Interview Preparation</h2>
    <div style="font-size: 10pt;">
      <strong>Recommended Portfolio Projects:</strong>
      <ul>
        ${(selectedCareer.portfolioProjectIdeas || []).map(p => `<li>${escapeHtml(p)}</li>`).join('')}
      </ul>
      <strong>Key Interview Competencies:</strong>
      <ul>
        ${(selectedCareer.interviewTopics || []).map(i => `<li>${escapeHtml(i)}</li>`).join('')}
      </ul>
    </div>
  </div>

  <div class="disclaimer">
    <strong>Transparency Notice & Informational Disclaimer:</strong><br>
    CareerPath AI is an informational planning assistant. Fit scores and learning paths are computed deterministically based on your profile inputs and optionally augmented by Google Gemini AI. Compensation ranges and hiring metrics are indicative references based on public industry surveys (e.g. Stack Overflow Developer Survey, Bureau of Labor Statistics) and do not represent employment guarantees.
  </div>
</body>
</html>`;

    reportWindow.document.open();
    reportWindow.document.write(htmlContent);
    reportWindow.document.close();
  }
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
