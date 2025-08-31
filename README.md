# CareerPath AI

**CareerPath AI** is an intelligent career guidance platform that uses Google's Gemini AI to provide personalized career recommendations based on your skills, interests, and goals.

---

## Features

- 🤖 **AI-Powered Recommendations** — Get career suggestions powered by Google Gemini AI.
- 🎯 **Personalized Matching** — 3 tailored career paths with match percentages.
- 📊 **Skill Gap Analysis** — Identify missing skills and get learning recommendations.
- 📅 **Learning Roadmap** — 12-week structured plan with curated resources.
- 🌙 **Dark Mode** — Comfortable viewing in any lighting condition.
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile.
- 📤 **Export & Share** — Export results as PDF or share with others.

---

## How to Use

1. **Enter Your Skills:** Provide your current skills, experience level, and employment status.
2. **Select Interests:** Choose 2–3 areas that genuinely interest you.
3. **Set Goals:** Define your career objectives, constraints, and salary expectations.
4. **Get Results:** Receive personalized career recommendations with detailed analysis.

---

## Prerequisites

- Node.js (v14 or higher)
- A Google Cloud account with access to the Generative Language (Gemini) API
- A Vercel account (for deployment)

---

## Local Development

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd careerpath-ai
```

2. **Install dependencies** (if your project has any server-side packages)

```bash
npm install
```

3. **Set environment variables**

Create a `.env` file in the project root and add your Gemini API key:

```text
GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Run the development server**

```bash
npm run dev
```

Visit `http://localhost:3000` (or the port your app uses) to test locally.

---

## Deployment to Vercel

1. Fork or push the repository to GitHub.
2. Go to https://vercel.com and click **New Project** to import your repository.
3. During setup, add the environment variable `GEMINI_API_KEY` with your API key.
4. Deploy — Vercel will build and publish your app. Your app will be available at `https://your-project-name.vercel.app`.

---

## API Configuration

- Get a Gemini API key from Google AI Studio.
- Add the key to your Vercel environment variables as `GEMINI_API_KEY`.
- The serverless function in `api/getCareerAdvice.js` calls the Gemini API to generate personalized career recommendations. The app falls back to a local sample response when the API is unavailable.

---

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Tailwind CSS
- **Icons:** Font Awesome
- **Charts:** Chart.js
- **Backend:** Vercel Serverless Functions
- **AI:** Google Gemini (Generative Language API)

---

## File Structure

```
careerpath-ai/
├── index.html                # Main application file
├── style.css                 # Styles and animations
├── script.js                 # Application logic and functionality
├── api/
│   └── getCareerAdvice.js    # Serverless function for Gemini API
└── README.md                 # Project README (this file)
```

---

## Testing / Example Request

You can test your deployed API using `curl`. Replace `<YOUR_DOMAIN>` with your deployment:

```bash
curl -X POST "https://<YOUR_DOMAIN>/api/getCareerAdvice" \
  -H "Content-Type: application/json" \
  -d '{ "userData": { "name": "Test User", "skills": "javascript, html, css", "experience": "0-1 years", "interests": ["Software Development"], "goals": "Transition to a tech career within 12 months" }, "forceSearch": true }'
```

The endpoint returns JSON with a `careers` array containing recommended career objects.

---

## Support

If you need help, open an issue in the GitHub repository or use the Help & Support feature in the application.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Acknowledgments

- Powered by Google Gemini AI
- Built with ❤️ by Team Neurix

> **Note:** This application requires a valid Gemini API key to function properly. Without it, the application will use fallback/sample data for demonstration purposes.

