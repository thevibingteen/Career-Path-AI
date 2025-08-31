// api/getCareerAdvice.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userData } = req.body;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!userData || !geminiApiKey) {
      throw new Error('Missing user data or API key configuration.');
    }

    const prompt = createPrompt(userData);

    // Use the latest Gemini model
    const model = "gemini-2.0-flash";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;

    console.log("Calling Gemini model:", model);

    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2, // Lower temperature for more focused responses
          topP: 0.8,
          topK: 40,
        }
      }),
    });

    if (!geminiResponse.ok) {
      const bodyText = await geminiResponse.text();
      console.error(
        `Gemini API responded with status: ${geminiResponse.status}`,
        bodyText
      );
      throw new Error(`Gemini API call failed with ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    console.log("Gemini raw response:", JSON.stringify(geminiData));

    const responseText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!responseText) {
      console.error(
        "Unexpected Gemini response shape:",
        JSON.stringify(geminiData)
      );
      throw new Error("Invalid response format");
    }

    const careers = parseGeminiResponse(responseText);
    
    // Validate and enhance the careers data
    const validatedCareers = validateCareerData(careers, userData);
    
    return res.status(200).json({ careers: validatedCareers });
  } catch (error) {
    console.error("Error in serverless function:", error?.message || error);
    const fallbackCareers = getFallbackResponse(userData);
    return res.status(200).json({ careers: fallbackCareers });
  }
}

// ----- helpers -----

function createPrompt(userData) {
  return `
You are an expert career advisor with access to the latest 2024-2025 job market data.
Analyze this user profile and recommend 3 suitable career paths with accurate, up-to-date information:

User Profile:
- Name: ${userData.name}
- Skills: ${userData.skills}
- Experience: ${userData.experience}
- Employment Status: ${userData.employmentStatus}
- Interests: ${(userData.interests || []).join(", ")}
- Career Goals: ${userData.goals}
- Constraints: ${userData.constraints}
- Target Salary: ${userData.salaryRange}

For each career recommendation, provide accurate 2024-2025 data including:
1. Career title (must be a real career)
2. Match percentage (0-100%) based on skills alignment and user goals
3. Brief description (2-3 sentences)
4. Key skills required (5-7 most important skills)
5. Missing skills from user's current skillset
6. Salary range in INR (accurate for 2024 Indian market)
7. Market demand (High/Medium/Low based on current trends)
8. Growth potential (percentage and timeframe)
9. Current industry trend (1-2 sentences about 2024 trends)

Pay special attention to:
- User's employment status (${userData.employmentStatus}) - if "Freelancer", highlight freelancing opportunities
- User's career goals: ${userData.goals}
- User's constraints: ${userData.constraints}
- User's salary expectations: ${userData.salaryRange}

Ensure all information is accurate, up-to-date, and relevant to the Indian job market.
Format the response as a valid JSON array of objects with these exact properties: 
"career", "match", "description", "requiredSkills", "missingSkills", "salary", "demand", "growth", "trend".

Provide only the JSON array with no additional text.
  `.trim();
}

function parseGeminiResponse(text) {
  try {
    // Extract JSON from the response
    const jsonMatch = text.match(/\[\s*{[\s\S]*}\s*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("No JSON array found in response");
  } catch (err) {
    console.error("Error parsing Gemini response:", err);
    throw err;
  }
}

function validateCareerData(careers, userData) {
  if (!Array.isArray(careers)) {
    throw new Error("Invalid careers data format");
  }
  
  return careers.map(career => {
    // Validate and standardize career data
    return {
      career: career.career || "Professional",
      match: Math.min(95, Math.max(0, career.match || 0)), // Cap at 95% for accuracy
      description: career.description || "A promising career path with good growth potential.",
      requiredSkills: Array.isArray(career.requiredSkills) ? career.requiredSkills : [],
      missingSkills: Array.isArray(career.missingSkills) ? career.missingSkills : [],
      salary: validateSalary(career.salary),
      demand: validateDemand(career.demand),
      growth: validateGrowth(career.growth),
      trend: career.trend || "Growing field with opportunities in 2024-2025"
    };
  });
}

function validateSalary(salary) {
  if (!salary || typeof salary !== "string") {
    return "₹5-12 LPA";
  }
  
  // Ensure salary follows expected format
  if (!salary.includes("LPA") && !salary.includes("Lakh")) {
    return "₹5-12 LPA";
  }
  
  return salary;
}

function validateDemand(demand) {
  const validLevels = ["Very High", "High", "Medium", "Low"];
  if (!demand || !validLevels.includes(demand)) {
    return "High";
  }
  
  return demand;
}

function validateGrowth(growth) {
  if (!growth || typeof growth !== "string") {
    return "15% by 2029";
  }
  
  // Ensure growth follows expected format
  if (!growth.includes("%") || !growth.includes("by")) {
    return "15% by 2029";
  }
  
  return growth;
}

function getFallbackResponse(userData) {
  console.log("Providing fallback response due to an error.");
  
  // Filter careers based on user's employment status and interests
  let filteredCareers = [];
  
  if (userData.employmentStatus === "Freelancer") {
    filteredCareers = [
      {
        career: "Front-End Developer",
        match: 85,
        description: "Front-End Developers build user interfaces for websites and web applications. They work with HTML, CSS, and JavaScript to create visually appealing and interactive experiences.",
        requiredSkills: ["HTML", "CSS", "JavaScript", "React", "Responsive Design"],
        missingSkills: ["React", "Responsive Design"],
        salary: "₹3-6 LPA",
        demand: "High",
        growth: "15% by 2029",
        trend: "Increased focus on component-based architectures and serverless front-end development"
      },
      {
        career: "Digital Marketer",
        match: 75,
        description: "Digital Marketers promote products and services through digital channels. They analyze market trends and create strategies to reach target audiences.",
        requiredSkills: ["SEO", "SEM", "Social Media", "Content Marketing", "Google Analytics"],
        missingSkills: ["SEO", "Google Analytics"],
        salary: "₹3-8 LPA",
        demand: "High",
        growth: "10% by 2029",
        trend: "Growing digital presence for businesses across industries"
      },
      {
        career: "Content Writer",
        match: 70,
        description: "Content Writers create written material for websites, blogs, and marketing materials. They research topics and produce engaging content for target audiences.",
        requiredSkills: ["Writing", "Research", "SEO", "Grammar", "Content Strategy"],
        missingSkills: ["SEO", "Content Strategy"],
        salary: "₹2-5 LPA",
        demand: "Medium",
        growth: "8% by 2029",
        trend: "Increasing demand for quality content across digital platforms"
      }
    ];
  } else if (userData.employmentStatus === "Job Seeker") {
    filteredCareers = [
      {
        career: "Full Stack Developer",
        match: 85,
        description: "Full Stack Developers build both the front-end and back-end of web applications. They work with various technologies to create seamless user experiences and robust server-side functionality.",
        requiredSkills: ["JavaScript", "React", "Node.js", "HTML/CSS", "SQL", "Git"],
        missingSkills: ["React", "Node.js"],
        salary: "₹6-15 LPA",
        demand: "High",
        growth: "22% by 2029",
        trend: "Increasing demand for full-stack developers with cloud experience"
      },
      {
        career: "Data Scientist",
        match: 75,
        description: "Data Scientists analyze and interpret complex data to help organizations make informed decisions. They use statistical methods, machine learning, and data visualization techniques.",
        requiredSkills: ["Python", "Machine Learning", "Statistics", "Data Visualization", "SQL"],
        missingSkills: ["Machine Learning", "Statistics"],
        salary: "₹8-20 LPA",
        demand: "Very High",
        growth: "31% by 2029",
        trend: "Rising need for AI and machine learning expertise across industries"
      },
      {
        career: "UX/UI Designer",
        match: 65,
        description: "UX/UI Designers create user-friendly interfaces that provide meaningful and relevant experiences to users. They combine design, psychology, and business needs.",
        requiredSkills: ["Figma", "User Research", "Wireframing", "Prototyping", "UI Design"],
        missingSkills: ["Figma", "User Research"],
        salary: "₹5-12 LPA",
        demand: "High",
        growth: "13% by 2029",
        trend: "Growing emphasis on user experience in digital products"
      }
    ];
  } else {
    // Default fallback for other employment statuses
    filteredCareers = [
      {
        career: "Full Stack Developer",
        match: 85,
        description: "Full Stack Developers build both the front-end and back-end of web applications. They work with various technologies to create seamless user experiences and robust server-side functionality.",
        requiredSkills: ["JavaScript", "React", "Node.js", "HTML/CSS", "SQL", "Git"],
        missingSkills: ["React", "Node.js"],
        salary: "₹6-15 LPA",
        demand: "High",
        growth: "22% by 2029",
        trend: "Increasing demand for full-stack developers with cloud experience"
      },
      {
        career: "Data Scientist",
        match: 75,
        description: "Data Scientists analyze and interpret complex data to help organizations make informed decisions. They use statistical methods, machine learning, and data visualization techniques.",
        requiredSkills: ["Python", "Machine Learning", "Statistics", "Data Visualization", "SQL"],
        missingSkills: ["Machine Learning", "Statistics"],
        salary: "₹8-20 LPA",
        demand: "Very High",
        growth: "31% by 2029",
        trend: "Rising need for AI and machine learning expertise across industries"
      },
      {
        career: "UX/UI Designer",
        match: 65,
        description: "UX/UI Designers create user-friendly interfaces that provide meaningful and relevant experiences to users. They combine design, psychology, and business needs.",
        requiredSkills: ["Figma", "User Research", "Wireframing", "Prototyping", "UI Design"],
        missingSkills: ["Figma", "User Research"],
        salary: "₹5-12 LPA",
        demand: "High",
        growth: "13% by 2029",
        trend: "Growing emphasis on user experience in digital products"
      }
    ];
  }
  
  // Adjust match percentages based on user skills
  const userSkills = userData.skills.toLowerCase();
  filteredCareers.forEach(career => {
    const matchedSkills = career.requiredSkills.filter(skill => 
      userSkills.includes(skill.toLowerCase())
    );
    career.match = Math.min(95, Math.round((matchedSkills.length / career.requiredSkills.length) * 100));
    career.missingSkills = career.requiredSkills.filter(skill => 
      !userSkills.includes(skill.toLowerCase())
    );
  });
  
  // Sort by match percentage
  filteredCareers.sort((a, b) => b.match - a.match);
  
  return filteredCareers.slice(0, 3);
}
