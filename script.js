// Application State
const state = {
    currentStep: 1,
    totalSteps: 4,
    userData: {
        name: '',
        email: '',
        skills: '',
        experience: '',
        employmentStatus: '',
        interests: [],
        goals: '',
        constraints: '',
        salaryRange: ''
    },
    results: null,
    acceptedTerms: false,
    topCareers: [],
    errors: {},
    apiSource: null,
    currentCareerIndex: 0,
    currentModalStep: 4,
    currentCareer: null
};

// DOM Elements
const app = document.getElementById('app');
const careerModal = document.getElementById('careerModal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const shareModal = document.getElementById('shareModal');
const supportModal = document.getElementById('supportModal');
const themeToggle = document.getElementById('themeToggle');

// Career trends data
const careerTrends = {
    "Full Stack Developer": {
        demand: "High",
        growth: "22% by 2029",
        skills: ["JavaScript", "React", "Node.js", "HTML/CSS", "SQL", "Git", "REST APIs"],
        salary: "₹6-15 LPA",
        trend: "Increasing demand for full-stack developers with cloud experience",
        description: "Full Stack Developers build both the front-end and back-end of web applications. They work with various technologies to create seamless user experiences and robust server-side functionality.",
        resources: [
            { name: "FreeCodeCamp", provider: "Free", type: "Course", duration: "300 hours", free: true, link: "https://www.freecodecamp.org/" },
            { name: "The Complete Web Developer Bootcamp", provider: "Udemy", type: "Course", duration: "60 hours", free: false, link: "https://www.udemy.com/course/the-complete-web-development-bootcamp/" },
            { name: "Full Stack Open", provider: "University of Helsinki", type: "Course", duration: "Free", free: true, link: "https://fullstackopen.com/en/" },
            { name: "JavaScript: The Advanced Concepts", provider: "ZeroToMastery", type: "Course", duration: "25 hours", free: false, link: "https://www.udemy.com/course/advanced-javascript-concepts/" }
        ],
        companies: ["Infosys", "TCS", "Wipro", "HCL", "Startups"],
        learningPath: "Start with HTML/CSS and JavaScript, then learn a frontend framework like React, followed by backend technologies like Node.js and databases.",
        freelancing: true,
        freelancingPlatforms: ["Upwork", "Freelancer", "Fiverr", "Toptal"]
    },
    "Data Scientist": {
        demand: "Very High",
        growth: "31% by 2029",
        skills: ["Python", "R", "Machine Learning", "Statistics", "Data Visualization", "SQL", "TensorFlow"],
        salary: "₹8-20 LPA",
        trend: "Rising need for AI and machine learning expertise across industries",
        description: "Data Scientists analyze and interpret complex data to help organizations make informed decisions. They use statistical methods, machine learning, and data visualization techniques.",
        resources: [
            { name: "Kaggle Learn", provider: "Free", type: "Courses", duration: "Free", free: true, link: "https://www.kaggle.com/learn" },
            { name: "Data Science Specialization", provider: "Coursera", type: "Specialization", duration: "11 months", free: false, link: "https://www.coursera.org/specializations/jhu-data-science" },
            { name: "Python for Data Science and Machine Learning", provider: "Udemy", type: "Course", duration: "44 hours", free: false, link: "https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/" },
            { name: "Introduction to Machine Learning", provider: "Kaggle", type: "Course", duration: "Free", free: true, link: "https://www.kaggle.com/learn/intro-to-machine-learning" }
        ],
        companies: ["Google", "Microsoft", "Amazon", "IBM", "JPMorgan Chase"],
        learningPath: "Start with Python programming, then learn statistics and data analysis, followed by machine learning algorithms and data visualization.",
        freelancing: true,
        freelancingPlatforms: ["Upwork", "Toptal", "Kaggle"]
    },
    "UX/UI Designer": {
        demand: "High",
        growth: "13% by 2029",
        skills: ["Figma", "User Research", "Wireframing", "Prototyping", "UI Design", "User Testing", "Adobe XD"],
        salary: "₹5-12 LPA",
        trend: "Growing emphasis on user experience in digital products",
        description: "UX/UI Designers create user-friendly interfaces that provide meaningful and relevant experiences to users. They combine design, psychology, and business needs.",
        resources: [
            { name: "Figma Tutorials", provider: "Figma", type: "Tutorials", duration: "Free", free: true, link: "https://www.figma.com/resources/learn/" },
            { name: "UI/UX Design Specialization", provider: "Coursera", type: "Specialization", duration: "6 months", free: false, link: "https://www.coursera.org/specializations/ui-ux-design" },
            { name: "Learn Figma - UI/UX Design Essential Training", provider: "Udemy", type: "Course", duration: "12 hours", free: false, link: "https://www.udemy.com/course/learn-figma/" },
            { name: "Google UX Design Certificate", provider: "Coursera", type: "Certificate", duration: "6 months", free: false, link: "https://www.coursera.org/professional-certificates/google-ux-design" }
        ],
        companies: ["Apple", "Google", "Adobe", "Airbnb", "Facebook"],
        learningPath: "Start with design principles and color theory, then learn wireframing and prototyping tools, followed by user research methodologies.",
        freelancing: true,
        freelancingPlatforms: ["Dribbble", "Behance", "Upwork", "99designs"]
    },
    "Cloud Engineer": {
        demand: "Very High",
        growth: "26% by 2029",
        skills: ["AWS", "Azure", "Docker", "Kubernetes", "Infrastructure as Code", "Linux", "Networking"],
        salary: "₹7-18 LPA",
        trend: "Accelerated cloud adoption across all business sectors",
        description: "Cloud Engineers design, implement, and maintain cloud infrastructure and services. They help organizations leverage cloud computing for scalability and efficiency.",
        resources: [
            { name: "AWS Free Tier", provider: "Amazon", type: "Hands-on", duration: "Free", free: true, link: "https://aws.amazon.com/free/" },
            { name: "AWS Certified Solutions Architect", provider: "A Cloud Guru", type: "Course", duration: "40 hours", free: false, link: "https://acloudguru.com/course/aws-certified-solutions-architect-associate-saa-c03" },
            { name: "Docker and Kubernetes: The Complete Guide", provider: "Udemy", type: "Course", duration: "23 hours", free: false, link: "https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/" },
            { name: "Google Cloud Platform Fundamentals", provider: "Coursera", type: "Course", duration: "15 hours", free: false, link: "https://www.coursera.org/learn/gcp-fundamentals" }
        ],
        companies: ["Amazon", "Microsoft", "Google", "IBM", "Netflix"],
        learningPath: "Start with cloud fundamentals and Linux, then learn a specific cloud platform (AWS/Azure/GCP), followed by containerization and orchestration tools.",
        freelancing: false,
        freelancingPlatforms: []
    },
    "DevOps Engineer": {
        demand: "High",
        growth: "21% by 2029",
        skills: ["CI/CD", "Docker", "Kubernetes", "AWS", "Scripting", "Jenkins", "Monitoring"],
        salary: "₹7-16 LPA",
        trend: "Increasing focus on automation and deployment efficiency",
        description: "DevOps Engineers bridge the gap between development and operations teams. They automate processes and ensure reliable software delivery.",
        resources: [
            { name: "DevOps Bootcamp", provider: "Udemy", type: "Course", duration: "55 hours", free: false, link: "https://www.udemy.com/course/devops-bootcamp/" },
            { name: "Kubernetes for Absolute Beginners", provider: "YouTube", type: "Course", duration: "4 hours", free: true, link: "https://www.youtube.com/watch?v=7XDeI5fyj2w" },
            { name: "Introduction to DevOps", provider: "Coursera", type: "Course", duration: "10 hours", free: true, link: "https://www.coursera.org/learn/intro-to-devops" },
            { name: "GitLab CI/CD Tutorial", provider: "GitLab", type: "Tutorial", duration: "Free", free: true, link: "https://docs.gitlab.com/ee/ci/" }
        ],
        companies: ["Netflix", "Amazon", "Google", "Etsy", "Target"],
        learningPath: "Start with Linux and scripting, then learn CI/CD tools and containerization, followed by infrastructure as code and monitoring solutions.",
        freelancing: true,
        freelancingPlatforms: ["Upwork", "Toptal", "Freelancer"]
    },
    "Digital Marketer": {
        demand: "High",
        growth: "10% by 2029",
        skills: ["SEO", "SEM", "Social Media", "Content Marketing", "Google Analytics", "Email Marketing"],
        salary: "₹3-8 LPA",
        trend: "Growing digital presence for businesses across industries",
        description: "Digital Marketers promote products and services through digital channels. They analyze market trends and create strategies to reach target audiences.",
        resources: [
            { name: "Google Digital Garage", provider: "Google", type: "Course", duration: "40 hours", free: true, link: "https://learndigital.withgoogle.com/digitalgarage/" },
            { name: "HubSpot Academy", provider: "HubSpot", type: "Courses", duration: "Free", free: true, link: "https://academy.hubspot.com/" },
            { name: "Digital Marketing Specialization", provider: "Coursera", type: "Specialization", duration: "6 months", free: false, link: "https://www.coursera.org/specializations/digital-marketing" },
            { name: "Facebook Blueprint", provider: "Facebook", type: "Certification", duration: "Free", free: true, link: "https://www.facebook.com/business/learn" }
        ],
        companies: ["Any industry with online presence", "Startups", "E-commerce", "Agencies"],
        learningPath: "Start with fundamentals of marketing, then learn SEO and SEM, followed by social media marketing and analytics.",
        freelancing: true,
        freelancingPlatforms: ["Upwork", "Fiverr", "PeoplePerHour"]
    },
    "Cybersecurity Analyst": {
        demand: "Very High",
        growth: "33% by 2030",
        skills: ["Network Security", "Ethical Hacking", "SIEM", "Incident Response", "Risk Assessment", "Cryptography"],
        salary: "₹8-18 LPA",
        trend: "Growing need for security professionals due to increasing cyber threats",
        description: "Cybersecurity Analysts protect organizations from cyber threats by monitoring systems, investigating incidents, and implementing security measures.",
        resources: [
            { name: "Cybersecurity Specialization", provider: "Coursera", type: "Specialization", duration: "8 months", free: false, link: "https://www.coursera.org/specializations/cyber-security" },
            { name: "CompTIA Security+", provider: "CompTIA", type: "Certification", duration: "60 hours", free: false, link: "https://www.comptia.org/certifications/security" },
            { name: "Introduction to Cybersecurity", provider: "Cisco", type: "Course", duration: "Free", free: true, link: "https://www.netacad.com/courses/cybersecurity/introduction-cybersecurity" },
            { name: "Ethical Hacking", provider: "Udemy", type: "Course", duration: "15 hours", free: false, link: "https://www.udemy.com/course/learn-ethical-hacking-from-scratch/" }
        ],
        companies: ["IBM", "Deloitte", "EY", "Accenture", "Wipro", "TCS"],
        learningPath: "Start with networking fundamentals, then learn security concepts, followed by specialized areas like ethical hacking and incident response.",
        freelancing: true,
        freelancingPlatforms: ["Upwork", "Freelancer", "HackerOne"]
    },
    "AI/ML Engineer": {
        demand: "Very High",
        growth: "40% by 2029",
        skills: ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Natural Language Processing", "Computer Vision"],
        salary: "₹10-25 LPA",
        trend: "Rapid growth in AI applications across industries",
        description: "AI/ML Engineers develop and deploy machine learning models to solve complex problems and create intelligent systems.",
        resources: [
            { name: "Machine Learning Specialization", provider: "Coursera", type: "Specialization", duration: "6 months", free: false, link: "https://www.coursera.org/specializations/machine-learning-introduction" },
            { name: "Deep Learning Specialization", provider: "Coursera", type: "Specialization", duration: "5 months", free: false, link: "https://www.coursera.org/specializations/deep-learning" },
            { name: "Fast.ai Practical Deep Learning", provider: "Fast.ai", type: "Course", duration: "Free", free: true, link: "https://course.fast.ai/" },
            { name: "TensorFlow Developer Certificate", provider: "Google", type: "Certification", duration: "3 months", free: false, link: "https://www.tensorflow.org/certificate" }
        ],
        companies: ["Google", "Microsoft", "Amazon", "NVIDIA", "OpenAI", "IBM"],
        learningPath: "Start with Python programming and mathematics, then learn machine learning fundamentals, followed by deep learning and specialized AI domains.",
        freelancing: true,
        freelancingPlatforms: ["Upwork", "Toptal", "Kaggle"]
    },
    "Front-End Developer": {
        demand: "High",
        growth: "15% by 2029",
        skills: ["HTML", "CSS", "JavaScript", "React", "Vue", "Angular", "Responsive Design"],
        salary: "₹3-6 LPA",
        trend: "Increased focus on component-based architectures and serverless front-end development",
        description: "Front-End Developers are responsible for building the user interface and user experience of websites and web applications.",
        resources: [
            { name: "Frontend Development Libraries", provider: "FreeCodeCamp", type: "Course", duration: "300 hours", free: true, link: "https://www.freecodecamp.org/learn/front-end-development-libraries/" },
            { name: "Modern React with Redux", provider: "Udemy", type: "Course", duration: "52 hours", free: false, link: "https://www.udemy.com/course/react-redux/" },
            { name: "JavaScript Algorithms and Data Structures", provider: "FreeCodeCamp", type: "Course", duration: "300 hours", free: true, link: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
            { name: "Advanced CSS and Sass", provider: "Udemy", type: "Course", duration: "28 hours", free: false, link: "https://www.udemy.com/course/advanced-css-and-sass/" }
        ],
        companies: ["Infosys", "TCS", "Wipro", "HCL", "Startups"],
        learningPath: "Start with HTML/CSS and JavaScript, then learn a frontend framework like React, followed by state management and responsive design.",
        freelancing: true,
        freelancingPlatforms: ["Upwork", "Freelancer", "Fiverr"]
    },
    "Junior Security Analyst": {
        demand: "High",
        growth: "33% by 2030",
        skills: ["Network Security", "SIEM Tools", "Incident Response", "Vulnerability Assessment", "Security Policies"],
        salary: "₹2.4-3.5 LPA",
        trend: "Increased focus on proactive threat hunting and incident response due to rising ransomware attacks",
        description: "Junior Security Analysts assist in protecting an organization's systems and data from cyber threats under the guidance of senior analysts.",
        resources: [
            { name: "Introduction to Cybersecurity", provider: "Cisco", type: "Course", duration: "30 hours", free: true, link: "https://www.netacad.com/courses/cybersecurity/introduction-cybersecurity" },
            { name: "Cybersecurity Fundamentals", provider: "IBM", type: "Specialization", duration: "3 months", free: false, link: "https://www.coursera.org/specializations/cyber-security-fundamentals" },
            { name: "CompTIA Security+ (SY0-701) Complete Course", provider: "Udemy", type: "Course", duration: "25 hours", free: false, link: "https://www.udemy.com/course/comptia-security-sy0-701-complete-course-exam-prep" },
            { name: "Cybersecurity Essentials", provider: "TryHackMe", type: "Learning Path", duration: "40 hours", free: true, link: "https://tryhackme.com/path/outline/cybersecurity" }
        ],
        companies: ["Wipro", "TCS", "Infosys", "HCL Technologies", "Accenture"],
        learningPath: "Start with networking fundamentals and basic security concepts. Then learn about security tools and technologies. Get hands-on with security monitoring and incident response.",
        freelancing: true,
        freelancingPlatforms: ["Upwork", "Freelancer", "HackerOne"]
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    // Set up event listeners
    themeToggle.addEventListener('click', toggleDarkMode);
    
    // Initialize the app
    render();
});

// Enhanced Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    if (isDarkMode) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('darkMode', 'true');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', 'false');
    }
    
    // Update all elements that need dark mode
    updateDarkModeElements(isDarkMode);
}

// Update all elements for dark mode
function updateDarkModeElements(isDarkMode) {
    // Update cards
    const cards = document.querySelectorAll('.card, .career-path-card');
    cards.forEach(card => {
        if (isDarkMode) {
            card.classList.add('dark:bg-gray-800');
        } else {
            card.classList.remove('dark:bg-gray-800');
        }
    });
    
    // Update text elements
    const textElements = document.querySelectorAll('.dark\\:text-white, .dark\\:text-gray-300');
    textElements.forEach(el => {
        if (isDarkMode) {
            el.classList.add('dark:text-white');
        } else {
            el.classList.remove('dark:text-white');
        }
    });
    
    // Re-render to update styles
    render();
}

// Support modal functions
function openSupportModal() {
    supportModal.style.display = 'flex';
}

function closeSupportModal() {
    supportModal.style.display = 'none';
}

function submitSupportRequest() {
    const email = document.getElementById('supportEmail').value;
    const supportType = document.getElementById('supportType').value;
    const message = document.getElementById('supportMessage').value;
    
    if (!email || !supportType || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // In a real application, this would send the data to a server
    alert('Thank you for your feedback! We will get back to you soon.');
    closeSupportModal();
    
    // Clear the form
    document.getElementById('supportEmail').value = '';
    document.getElementById('supportType').value = '';
    document.getElementById('supportMessage').value = '';
}

// Add accuracy indicator
function addAccuracyIndicator() {
    // Remove existing indicator if any
    const existingIndicator = document.querySelector('.accuracy-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    const indicator = document.createElement('div');
    indicator.className = 'accuracy-indicator';
    indicator.innerHTML = '<i class="fas fa-check-circle mr-1"></i> 95% Accuracy Guarantee';
    document.body.appendChild(indicator);
    
    // Remove after 5 seconds
    setTimeout(() => {
        indicator.style.opacity = '0';
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 1000);
    }, 5000);
}

// Render the application based on current step
function render() {
    switch(state.currentStep) {
        case 1:
            renderSkillsStep();
            break;
        case 2:
            renderInterestsStep();
            break;
        case 3:
            renderGoalsStep();
            break;
        case 4:
            renderResultsStep();
            break;
    }
}

// Validation functions
function validateName(name) {
    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(name) && name.length >= 2;
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validateSkills(skills) {
    return skills.trim().length > 0;
}

function validateStep1() {
    const errors = {};
    
    if (!validateName(state.userData.name)) {
        errors.name = "Please enter a valid name (letters and spaces only)";
    }
    
    if (!validateEmail(state.userData.email)) {
        errors.email = "Please enter a valid email address";
    }
    
    if (!validateSkills(state.userData.skills)) {
        errors.skills = "Please enter at least one skill";
    }
    
    if (!state.userData.employmentStatus) {
        errors.employmentStatus = "Please select your employment status";
    }
    
    if (!state.userData.experience) {
        errors.experience = "Please select your experience level";
    }
    
    state.errors = errors;
    return Object.keys(errors).length === 0;
}

function validateStep2() {
    if (state.userData.interests.length === 0) {
        state.errors.interests = "Please select at least one interest area";
        return false;
    }
    
    if (state.userData.interests.length > 5) {
        state.errors.interests = "Please select no more than 5 interest areas";
        return false;
    }
    
    return true;
}

function validateStep3() {
    const errors = {};
    
    if (!state.userData.goals.trim()) {
        errors.goals = "Please describe your career goals";
    }
    
    if (!state.userData.salaryRange) {
        errors.salaryRange = "Please select your expected salary range";
    }
    
    state.errors = errors;
    return Object.keys(errors).length === 0;
}

// Step 1: Skills
function renderSkillsStep() {
    app.innerHTML = `
        <div class="md:flex">
            <div class="md:w-1/2 p-8">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Let's plan your career path</h2>
                
                <div class="mb-6">
                    <div class="flex mb-2">
                        <div class="w-1/4">
                            <div class="text-center p-2 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-lg font-semibold">1. Skills</div>
                        </div>
                        <div class="w-1/4">
                            <div class="text-center p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">2. Interests</div>
                        </div>
                        <div class="w-1/4">
                            <div class="text-center p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">3. Goals</div>
                        </div>
                        <div class="w-1/4">
                            <div class="text-center p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">4. Results</div>
                        </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="bg-blue-600 h-2.5 rounded-full progress-bar" style="width: 25%"></div>
                    </div>
                </div>
                
                <div class="space-y-4">
                    <div class="floating-label">
                        <input type="text" value="${state.userData.name}" oninput="updateUserData('name', event)" class="floating-input" placeholder=" ">
                        <label class="floating-label-text">Your Name*</label>
                        ${state.errors.name ? `<p class="error-message">${state.errors.name}</p>` : ''}
                    </div>
                    
                    <div class="floating-label">
                        <input type="email" value="${state.userData.email}" oninput="updateUserData('email', event)" class="floating-input" placeholder=" ">
                        <label class="floating-label-text">Your Email*</label>
                        ${state.errors.email ? `<p class="error-message">${state.errors.email}</p>` : ''}
                    </div>
                    
                    <div class="floating-label">
                        <textarea oninput="updateUserData('skills', event)" class="floating-input" rows="3" placeholder=" ">${state.userData.skills}</textarea>
                        <label class="floating-label-text">Your Current Skills*</label>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate skills with commas</p>
                        ${state.errors.skills ? `<p class="error-message">${state.errors.skills}</p>` : ''}
                    </div>
                    
                    <div class="floating-label">
                        <select onchange="updateUserData('employmentStatus', event)" class="floating-input">
                            <option value="">Select your status</option>
                            <option ${state.userData.employmentStatus === 'Student' ? 'selected' : ''}>Student</option>
                            <option ${state.userData.employmentStatus === 'Fresher' ? 'selected' : ''}>Fresher (0-1 years)</option>
                            <option ${state.userData.employmentStatus === 'Experienced' ? 'selected' : ''}>Experienced (1+ years)</option>
                            <option ${state.userData.employmentStatus === 'Job Seeker' ? 'selected' : ''}>Job Seeker</option>
                            <option ${state.userData.employmentStatus === 'Freelancer' ? 'selected' : ''}>Freelancer</option>
                            <option ${state.userData.employmentStatus === 'Career Changer' ? 'selected' : ''}>Career Changer</option>
                        </select>
                        <label class="floating-label-text">Employment Status*</label>
                        ${state.errors.employmentStatus ? `<p class="error-message">${state.errors.employmentStatus}</p>` : ''}
                    </div>
                    
                    <div class="floating-label">
                        <select onchange="updateUserData('experience', event)" class="floating-input">
                            <option value="">Select experience</option>
                            <option ${state.userData.experience === 'Fresher (0 years)' ? 'selected' : ''}>Fresher (0 years)</option>
                            <option ${state.userData.experience === '0-1 years' ? 'selected' : ''}>0-1 years</option>
                            <option ${state.userData.experience === '1-3 years' ? 'selected' : ''}>1-3 years</option>
                            <option ${state.userData.experience === '3-5 years' ? 'selected' : ''}>3-5 years</option>
                            <option ${state.userData.experience === '5-10 years' ? 'selected' : ''}>5-10 years</option>
                            <option ${state.userData.experience === '10+ years' ? 'selected' : ''}>10+ years</option>
                        </select>
                        <label class="floating-label-text">Years of Experience*</label>
                        ${state.errors.experience ? `<p class="error-message">${state.errors.experience}</p>` : ''}
                    </div>
                    
                    <button onclick="validateAndProceed()" class="w-full btn-primary flex items-center justify-center">
                        <i class="fas fa-arrow-right mr-2"></i> Continue to Interests
                    </button>
                </div>
            </div>
            
            <div class="md:w-1/2 gradient-bg text-white p-8 flex flex-col justify-center">
                <div class="text-center mb-6">
                    <i class="fas fa-brain text-5xl mb-4 opacity-90"></i>
                    <h2 class="text-2xl font-bold mb-2">AI-Powered Career Guidance</h2>
                    <p class="opacity-90">We analyze your skills and goals to build a personalized career roadmap</p>
                </div>
                
                <div class="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-4 mb-6">
                    <h3 class="font-semibold mb-2">What you'll get:</h3>
                    <ul class="space-y-2">
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-green-300 mt-1 mr-2"></i>
                            <span>Personalized career paths matched to your profile</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-green-300 mt-1 mr-2"></i>
                            <span>Skill gap analysis and learning roadmap</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-green-300 mt-1 mr-2"></i>
                            <span>Job readiness score and probability matching</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-green-300 mt-1 mr-2"></i>
                            <span>Weekly learning plan with curated resources</span>
                        </li>
                    </ul>
                </div>
                
                <div class="flex justify-center">
                    <div class="bg-white rounded-lg p-3 shadow-lg w-64">
                        <div class="text-gray-800">
                            <div class="font-semibold mb-2">Sample Career Match</div>
                            <div class="flex items-center mb-2">
                                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                    <i class="fas fa-code text-blue-600"></i>
                                </div>
                                <div>
                                    <div class="font-bold">Full Stack Developer</div>
                                    <div class="text-xs text-gray-500">85% match</div>
                                </div>
                            </div>
                            <div class="flex justify-between text-xs text-gray-600">
                                <span>Salary: ₹6-15 LPA</span>
                                <span>Time: 6-9 months</span>
                            </div>
                        </div>
                        <div class="text-xs text-gray-500 mt-2 text-center">Based on similar profiles</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Step 2: Interests
function renderInterestsStep() {
    const techInterests = ['Software Development', 'Data Science', 'UI/UX Design', 'Cloud Computing', 'Digital Marketing', 'DevOps', 'Cybersecurity', 'AI/ML Engineering'];
    const nonTechInterests = ['Business Management', 'Healthcare', 'Education', 'Finance', 'Sales', 'Content Writing', 'Graphic Design', 'Photography', 'Music', 'Art', 'Sports', 'Fitness'];
    
    app.innerHTML = `
        <div class="md:flex">
            <div class="md:w-1/2 p-8">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Your Interests & Passions</h2>
                
                <div class="mb-6">
                    <div class="flex mb-2">
                        <div class="w-1/4">
                            <div class="text-center p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">1. Skills</div>
                        </div>
                        <div class="w-1/4">
                            <div class="text-center p-2 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-lg font-semibold">2. Interests</div>
                        </div>
                        <div class="w-1/4">
                            <div class="text-center p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">3. Goals</div>
                        </div>
                        <div class="w-1/4">
                            <div class="text-center p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">4. Results</div>
                        </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="bg-blue-600 h-2.5 rounded-full progress-bar" style="width: 50%"></div>
                    </div>
                </div>
                
                <div class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">What are you passionate about? (Select up to 5)*</label>
                        ${state.errors.interests ? `<p class="error-message">${state.errors.interests}</p>` : ''}
                        
                        <h3 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">Tech Interests</h3>
                        <div class="grid grid-cols-2 gap-3 mb-4">
                            ${techInterests.map(interest => `
                                <div class="interest-option border border-gray-300 rounded-lg p-4 text-center cursor-pointer transition-colors ${state.userData.interests.includes(interest) ? 'selected' : ''}" data-interest="${interest}">
                                    <i class="fas ${getInterestIcon(interest)} text-2xl mb-2 text-blue-600"></i>
                                    <div class="dark:text-white">${interest}</div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <h3 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">Non-Tech Interests</h3>
                        <div class="grid grid-cols-2 gap-3 mb-4">
                            ${nonTechInterests.map(interest => `
                                <div class="interest-option border border-gray-300 rounded-lg p-4 text-center cursor-pointer transition-colors ${state.userData.interests.includes(interest) ? 'selected' : ''}" data-interest="${interest}">
                                    <i class="fas ${getNonTechInterestIcon(interest)} text-2xl mb-2 text-blue-600"></i>
                                    <div class="dark:text-white">${interest}</div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="custom-interest-container">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Add Custom Interest</label>
                            <div class="custom-interest-input">
                                <input type="text" id="customInterest" class="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600" placeholder="Enter your interest">
                                <button onclick="addCustomInterest()" class="bg-blue-600 text-white px-4 py-2 rounded-lg">Add</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex gap-3">
                        <button onclick="prevStep()" class="w-1/3 btn-secondary flex items-center justify-center">
                            <i class="fas fa-arrow-left mr-2"></i> Back
                        </button>
                        <button onclick="validateInterestsAndProceed()" class="w-2/3 btn-primary flex items-center justify-center">
                            Continue to Goals <i class="fas fa-arrow-right ml-2"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="md:w-1/2 gradient-bg text-white p-8 flex flex-col justify-center">
                <div class="text-center mb-6">
                    <i class="fas fa-lightbulb text-5xl mb-4 opacity-90"></i>
                    <h2 class="text-2xl font-bold mb-2">Follow Your Passions</h2>
                    <p class="opacity-90">Your interests help us recommend careers you'll truly enjoy</p>
                </div>
                
                <div class="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-4 mb-6">
                    <h3 class="font-semibold mb-2">Why interests matter:</h3>
                    <ul class="space-y-2">
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-green-300 mt-1 mr-2"></i>
                            <span>People who work in fields they're passionate about report higher job satisfaction</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-green-300 mt-1 mr-2"></i>
                            <span>Interest alignment leads to better long-term career growth</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-green-300 mt-1 mr-2"></i>
                            <span>You're more likely to excel in areas that genuinely interest you</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `;

    // Add event listeners to interest options
    setTimeout(() => {
        const options = document.querySelectorAll('.interest-option');
        options.forEach(option => {
            option.addEventListener('click', function() {
                const interest = this.getAttribute('data-interest');
                
                if (state.userData.interests.includes(interest)) {
                    // Remove if already selected
                    state.userData.interests = state.userData.interests.filter(i => i !== interest);
                    this.classList.remove('selected');
                } else {
                    // Add if not selected and less than 5
                    if (state.userData.interests.length < 5) {
                        state.userData.interests.push(interest);
                        this.classList.add('selected');
                    } else {
                        alert("You can select up to 5 interests only");
                    }
                }
            });
        });
    }, 100);
}

// Add custom interest
function addCustomInterest() {
    const customInterestInput = document.getElementById('customInterest');
    const customInterest = customInterestInput.value.trim();
    
    if (!customInterest) {
        alert("Please enter an interest");
        return;
    }
    
    if (state.userData.interests.includes(customInterest)) {
        alert("This interest is already added");
        return;
    }
    
    if (state.userData.interests.length >= 5) {
        alert("You can select up to 5 interests only");
        return;
    }
    
    state.userData.interests.push(customInterest);
    customInterestInput.value = '';
    
    // Re-render to show the updated interests
    renderInterestsStep();
}

// Step 3: Goals
function renderGoalsStep() {
    app.innerHTML = `
        <div class="md:flex">
            <div class="md:w-1/2 p-8">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Your Career Goals</h2>
                
                <div class="mb-6">
                    <div class="flex mb-2">
                        <div class="w-1/4">
                            <div class="text-center p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">1. Skills</div>
                        </div>
                        <div class="w-1/4">
                            <div class="text-center p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">2. Interests</div>
                        </div>
                        <div class="w-1/4">
                            <div class="text-center p-2 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-lg font-semibold">3. Goals</div>
                        </div>
                        <div class="w-1/4">
                            <div class="text-center p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">4. Results</div>
                        </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="bg-blue-600 h-2.5 rounded-full progress-bar" style="width: 75%"></div>
                    </div>
                </div>
                
                <div class="space-y-6">
                    <div class="floating-label">
                        <textarea oninput="updateUserData('goals', event)" class="floating-input" rows="3" placeholder=" ">${state.userData.goals}</textarea>
                        <label class="floating-label-text">Career Goals*</label>
                        ${state.errors.goals ? `<p class="error-message">${state.errors.goals}</p>` : ''}
                    </div>
                    
                    <div class="floating-label">
                        <textarea oninput="updateUserData('constraints', event)" class="floating-input" rows="2" placeholder=" ">${state.userData.constraints}</textarea>
                        <label class="floating-label-text">Constraints (time, location, etc.)</label>
                    </div>
                    
                    <div class="floating-label">
                        <select onchange="updateUserData('salaryRange', event)" class="floating-input">
                            <option value="">Select expected salary</option>
                            <option ${state.userData.salaryRange === 'Under ₹3 LPA' ? 'selected' : ''}>Under ₹3 LPA</option>
                            <option ${state.userData.salaryRange === '₹3-5 LPA' ? 'selected' : ''}>₹3-5 LPA</option>
                            <option ${state.userData.salaryRange === '₹5-7 LPA' ? 'selected' : ''}>₹5-7 LPA</option>
                            <option ${state.userData.salaryRange === '₹7-10 LPA' ? 'selected' : ''}>₹7-10 LPA</option>
                            <option ${state.userData.salaryRange === '₹10-15 LPA' ? 'selected' : ''}>₹10-15 LPA</option>
                            <option ${state.userData.salaryRange === '₹15-20 LPA' ? 'selected' : ''}>₹15-20 LPA</option>
                            <option ${state.userData.salaryRange === '₹20+ LPA' ? 'selected' : ''}>₹20+ LPA</option>
                        </select>
                        <label class="floating-label-text">Target Salary Range (INR)*</label>
                        ${state.errors.salaryRange ? `<p class="error-message">${state.errors.salaryRange}</p>` : ''}
                    </div>
                    
                    <div class="flex gap-3">
                        <button onclick="prevStep()" class="w-1/3 btn-secondary flex items-center justify-center">
                            <i class="fas fa-arrow-left mr-2"></i> Back
                        </button>
                        <button onclick="validateGoalsAndGenerate()" class="w-2/3 btn-primary flex items-center justify-center">
                            Generate Results <i class="fas fa-bolt ml-2"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="md:w-1/2 gradient-bg text-white p-8 flex flex-col justify-center">
                <div class="text-center mb-6">
                    <i class="fas fa-bullseye text-5xl mb-4 opacity-90"></i>
                    <h2 class="text-2xl font-bold mb-2">Set Clear Goals</h2>
                    <p class="opacity-90">Define what success looks like for your career journey</p>
                </div>
                
                <div class="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-4 mb-6">
                    <h3 class="font-semibold mb-2">Realistic planning:</h3>
                    <ul class="space-y-2">
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-green-300 mt-1 mr-2"></i>
                            <span>Be specific about your timeline and constraints</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-green-300 mt-1 mr-2"></i>
                            <span>Consider your financial needs and salary expectations</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-green-300 mt-1 mr-2"></i>
                            <span>We'll create a personalized plan based on your goals</span>
                        </li>
                    </ul>
                </div>
                
                <div class="flex justify-center">
                    <div class="bg-white rounded-lg p-3 shadow-lg w-64">
                        <div class="text-gray-800">
                            <div class="font-semibold mb-2">Sample Timeline</div>
                            <div class="space-y-2">
                                <div class="flex justify-between">
                                    <span>Learning Foundation</span>
                                    <span>3 months</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Projects & Portfolio</span>
                                    <span>2 months</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Job Search</span>
                                    <span>1-2 months</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Step 4: Results
function renderResultsStep() {
    // Guard if nothing loaded
    const haveCareers = Array.isArray(state.topCareers) && state.topCareers.length > 0;
    const firstCareer = haveCareers ? state.topCareers[0] : null;
    const missingSkillsList = firstCareer?.missingSkills || [];

    // Small source badge text + style — tiny, unobtrusive, no layout changes
    const sourceBadge = state.apiSource === 'gemini'
        ? `<span class="ml-3 inline-flex items-center text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-200" title="Results are live from Gemini API">Live from Gemini</span>`
        : state.apiSource === 'fallback'
            ? `<span class="ml-3 inline-flex items-center text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200" title="Fallback expert analysis used because API was unavailable">Fallback: Expert analysis</span>`
            : '';

    app.innerHTML = `
        <div class="p-8">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">${state.userData.name}'s Personalized Career Plan ${sourceBadge}</h2>
            
            <div class="mb-6">
                <div class="flex mb-2">
                    <div class="w-1/4">
                        <div class="text-center p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">1. Skills</div>
                    </div>
                    <div class="w-1/4">
                        <div class="text-center p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">2. Interests</div>
                    </div>
                    <div class="w-1/4">
                        <div class="text-center p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">3. Goals</div>
                    </div>
                    <div class="w-1/4">
                        <div class="text-center p-2 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded-lg font-semibold">4. Results</div>
                    </div>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="bg-blue-600 h-2.5 rounded-full progress-bar" style="width: 100%"></div>
                </div>
            </div>
            
            <!-- User Summary Section -->
            <div class="summary-box mb-8">
                <h3 class="summary-title">Personalized Career Analysis for ${state.userData.name}</h3>
                <div class="summary-content">
                    <p>Based on your skills in <strong>${state.userData.skills.split(',').slice(0, 3).join(', ')}</strong>, 
                    interest in <strong>${state.userData.interests.join(' and ')}</strong>, and career goals of 
                    <strong>${state.userData.goals.substring(0, 100)}${state.userData.goals.length > 100 ? '...' : ''}</strong>, 
                    we've identified the following career paths that align with your profile and current market trends.</p>
                    
                    <p class="mt-2">Your target salary range of <strong>${state.userData.salaryRange}</strong> is achievable 
                    in these fields with the right skill development.</p>
                </div>
            </div>
            
            ${haveCareers ? `
            <div class="grid md:grid-cols-3 gap-6 mb-8">
                ${state.topCareers.map((career, index) => `
                    <div class="career-path-card bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md animate-card" style="animation-delay: ${index * 0.1}s">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 ${index === 0 ? 'bg-blue-100 dark:bg-blue-900' : index === 1 ? 'bg-green-100 dark:bg-green-900' : 'bg-purple-100 dark:bg-purple-900'} rounded-lg flex items-center justify-center mr-3">
                                <i class="fas ${getCareerIcon(career.career)} ${index === 0 ? 'text-blue-600 dark:text-blue-300' : index === 1 ? 'text-green-600 dark:text-green-300' : 'text-purple-600 dark:text-purple-300'}"></i>
                            </div>
                            <div>
                                <h3 class="font-bold dark:text-white">${career.career}</h3>
                                <div class="text-xs ${index === 0 ? 'text-blue-600 dark:text-blue-300' : index === 1 ? 'text-green-600 dark:text-green-300' : 'text-purple-600 dark:text-purple-300'}">${career.match}% Match</div>
                            </div>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">${career.description || 'Build a successful career in this high-demand field'}</p>
                        <div class="mb-4">
                            <div class="flex justify-between text-xs mb-1 dark:text-gray-300">
                                <span>Salary Range</span>
                                <span>${career.salary}</span>
                            </div>
                            <div class="flex justify-between text-xs mb-1 dark:text-gray-300">
                                <span>Market Demand</span>
                                <span>${career.demand}</span>
                            </div>
                            <div class="flex justify-between text-xs dark:text-gray-300">
                                <span>Growth</span>
                                <span>${career.growth}</span>
                            </div>
                        </div>
                        ${career.freelancing ? `<div class="text-xs text-green-600 dark:text-green-400 mb-2"><i class="fas fa-check-circle"></i> Freelancing opportunities available</div>` : ''}
                        <div class="text-xs text-gray-500 dark:text-gray-400 mb-3">Trend: ${career.trend}</div>
                        <button onclick="showCareerDetails('${career.career}')" class="w-full ${index === 0 ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800' : index === 1 ? 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800' : 'bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800'} py-2 rounded-lg text-sm font-semibold transition-colors">View Details</button>
                    </div>
                `).join('')}
            </div>
            
            <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-8">
                <h3 class="font-bold text-lg mb-4 dark:text-white">Your Skill Gap Analysis</h3>
                ${missingSkillsList.map((skill, i) => `
                    <div class="mb-4 animate-skill" style="animation-delay: ${i * 0.1}s">
                        <div class="flex justify-between mb-1 dark:text-white">
                            <span class="font-medium">${skill}</span>
                            <span class="text-blue-600 dark:text-blue-300 font-semibold">0%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5">
                            <div class="bg-blue-600 h-2.5 rounded-full skill-bar" style="width: 0%"></div>
                        </div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Critical skill for ${firstCareer?.career || 'this path'}. Consider learning through online courses.</p>
                    </div>
                `).join('')}
                <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <h4 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">Skill Improvement Strategy</h4>
                    <p class="text-sm text-blue-700 dark:text-blue-300">Based on your current skills, we recommend focusing on ${missingSkillsList.slice(0, 2).join(' and ') || 'foundational skills'} first, as these are fundamental to your chosen career path.</p>
                </div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                <h3 class="font-bold text-lg mb-4 dark:text-white">12-Week Learning Plan</h3>
                <div class="space-y-4">
                    <div class="flex items-start">
                        <div class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold px-2 py-1 rounded mr-3">Weeks 1-4</div>
                        <div>
                            <div class="font-semibold dark:text-white">Foundational Skills</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">Focus on ${missingSkillsList.slice(0, 2).join(' and ') || 'core fundamentals'}</div>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <div class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold px-2 py-1 rounded mr-3">Weeks 5-8</div>
                        <div>
                            <div class="font-semibold dark:text-white">Intermediate Concepts</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">Build projects using ${missingSkillsList.slice(2, 4).join(' and ') || 'practical exercises'}</div>
                        </div>
                    </div>
                    <div class="flex items-start">
                        <div class="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-semibold px-2 py-1 rounded mr-3">Weeks 9-12</div>
                        <div>
                            <div class="font-semibold dark:text-white">Portfolio Development</div>
                            <div class="text-sm text-gray-600 dark:text-gray-300">Create a portfolio showcasing your new skills</div>
                        </div>
                    </div>
                </div>
            </div>
            ` : `
            <div class="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                No results found. Please go back and try again.
            </div>`}
            
            <div class="flex gap-4 flex-wrap">
                <button onclick="generatePDF()" class="download-btn px-6 py-3 text-white rounded-lg flex items-center">
                    <i class="fas fa-file-pdf mr-2"></i> Export PDF Plan
                </button>
                <button onclick="openShareModal()" class="bg-gray-200 dark:bg-gray-700 px-6 py-3 text-gray-800 dark:text-white rounded-lg flex items-center">
                    <i class="fas fa-share-alt mr-2"></i> Share Results
                </button>
                <button onclick="restartProcess()" class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-6 py-3 text-gray-800 dark:text-white rounded-lg flex items-center">
                    <i class="fas fa-redo mr-2"></i> Start Over
                </button>
            </div>
        </div>
    `;

    // Animate skill bars after a short delay
    setTimeout(() => {
        document.querySelectorAll('.skill-bar').forEach(bar => {
            bar.style.width = '0%';
        });
    }, 500);
}

// Helper functions
function getInterestIcon(interest) {
    const icons = {
        'Software Development': 'fa-laptop-code',
        'Data Science': 'fa-chart-line',
        'UI/UX Design': 'fa-paint-brush',
        'Cloud Computing': 'fa-cloud',
        'Digital Marketing': 'fa-bullhorn',
        'DevOps': 'fa-code-branch',
        'Cybersecurity': 'fa-shield-alt',
        'AI/ML Engineering': 'fa-robot'
    };
    return icons[interest] || 'fa-star';
}

function getNonTechInterestIcon(interest) {
    const icons = {
        'Business Management': 'fa-briefcase',
        'Healthcare': 'fa-heartbeat',
        'Education': 'fa-graduation-cap',
        'Finance': 'fa-chart-line',
        'Sales': 'fa-handshake',
        'Content Writing': 'fa-pen',
        'Graphic Design': 'fa-palette',
        'Photography': 'fa-camera',
        'Music': 'fa-music',
        'Art': 'fa-paint-brush',
        'Sports': 'fa-running',
        'Fitness': 'fa-dumbbell'
    };
    return icons[interest] || 'fa-heart';
}

function getCareerIcon(career) {
    const icons = {
        'Full Stack Developer': 'fa-code',
        'Data Scientist': 'fa-chart-line',
        'UX/UI Designer': 'fa-paint-brush',
        'Cloud Engineer': 'fa-cloud',
        'DevOps Engineer': 'fa-code-branch',
        'Digital Marketer': 'fa-bullhorn',
        'Cybersecurity Analyst': 'fa-shield-alt',
        'AI/ML Engineer': 'fa-robot',
        'Front-End Developer': 'fa-laptop-code',
        'Junior Security Analyst': 'fa-user-shield'
    };
    return icons[career] || 'fa-briefcase';
}

// Function to show different steps in modal
function showStepInModal(step) {
    state.currentModalStep = step;
    updateModalContent();
}

// Function to update modal content based on selected step
function updateModalContent() {
    switch(state.currentModalStep) {
        case 1:
            showSkillsInModal();
            break;
        case 2:
            showInterestsInModal();
            break;
        case 3:
            showGoalsInModal();
            break;
        case 4:
            showCareerDetailsInModal(state.currentCareer.career);
            break;
    }
}

// Functions to show user data in modal
function showSkillsInModal() {
    modalTitle.textContent = "Your Skills";
    modalContent.innerHTML = `
        <div class="space-y-4">
            <div>
                <h3 class="font-semibold text-lg mb-2 dark:text-white">Skills Summary</h3>
                <p class="text-gray-700 dark:text-gray-300">${state.userData.skills}</p>
            </div>
            <div>
                <h3 class="font-semibold text-lg mb-2 dark:text-white">Experience Level</h3>
                <p class="text-gray-700 dark:text-gray-300">${state.userData.experience}</p>
            </div>
            <div>
                <h3 class="font-semibold text-lg mb-2 dark:text-white">Employment Status</h3>
                <p class="text-gray-700 dark:text-gray-300">${state.userData.employmentStatus}</p>
            </div>
        </div>
    `;
}

function showInterestsInModal() {
    modalTitle.textContent = "Your Interests";
    modalContent.innerHTML = `
        <div class="space-y-4">
            <h3 class="font-semibold text-lg mb-2 dark:text-white">Areas of Interest</h3>
            <div class="flex flex-wrap gap-2">
                ${state.userData.interests.map(interest => `
                    <span class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">${interest}</span>
                `).join('')}
            </div>
        </div>
    `;
}

function showGoalsInModal() {
    modalTitle.textContent = "Your Goals";
    modalContent.innerHTML = `
        <div class="space-y-4">
            <div>
                <h3 class="font-semibold text-lg mb-2 dark:text-white">Career Goals</h3>
                <p class="text-gray-700 dark:text-gray-300">${state.userData.goals}</p>
            </div>
            <div>
                <h3 class="font-semibold text-lg mb-2 dark:text-white">Constraints</h3>
                <p class="text-gray-700 dark:text-gray-300">${state.userData.constraints || 'Not specified'}</p>
            </div>
            <div>
                <h3 class="font-semibold text-lg mb-2 dark:text-white">Salary Expectations</h3>
                <p class="text-gray-700 dark:text-gray-300">${state.userData.salaryRange}</p>
            </div>
        </div>
    `;
}

// Show career details in modal
function showCareerDetails(careerName) {
    state.currentModalStep = 4;
    const career = careerTrends[careerName] || state.topCareers.find(c => c.career === careerName);
    state.currentCareer = career;
    
    // Find the index of this career in topCareers for navigation
    state.currentCareerIndex = state.topCareers.findIndex(c => c.career === careerName);
    
    showCareerDetailsInModal(careerName);
}

function showCareerDetailsInModal(careerName) {
    const career = careerTrends[careerName] || state.topCareers.find(c => c.career === careerName);
    const userSkills = state.userData.skills.split(',').map(skill => skill.trim().toLowerCase());
    const requiredSkills = career.skills ? career.skills.map(skill => skill.toLowerCase()) : [];
    
    // Check if user is interested in freelancing or job seeking
    const isFreelancer = state.userData.employmentStatus === 'Freelancer';
    const isJobSeeker = state.userData.employmentStatus === 'Job Seeker';
    
    modalTitle.textContent = careerName;
    
    modalContent.innerHTML = `
        <div class="space-y-6">
            <div class="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <h3 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">Why This Career Fits You</h3>
                <p class="text-blue-700 dark:text-blue-300">
                    Based on your skills in ${state.userData.skills.split(',').slice(0, 3).join(', ')} 
                    and interest in ${state.userData.interests.join(' and ')}, this career path aligns well with your profile. 
                    The ${careerName} role offers opportunities that match your salary expectations of ${state.userData.salaryRange}.
                </p>
            </div>
            
            <div>
                <h3 class="font-semibold text-lg mb-2 dark:text-white">Career Overview</h3>
                <p class="text-gray-700 dark:text-gray-300">${career.description || 'A promising career path with good growth potential.'}</p>
            </div>
            
            <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                    <h4 class="font-semibold text-blue-800 dark:text-blue-200 mb-2">Market Information</h4>
                    <p class="text-sm dark:text-blue-300"><span class="font-medium">Demand:</span> ${career.demand || 'High'}</p>
                    <p class="text-sm dark:text-blue-300"><span class="font-medium">Growth:</span> ${career.growth || '15% by 2029'}</p>
                    <p class="text-sm dark:text-blue-300"><span class="font-medium">Salary Range:</span> ${career.salary || '₹5-12 LPA'}</p>
                </div>
                
                <div class="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                    <h4 class="font-semibold text-green-800 dark:text-green-200 mb-2">Current Trend</h4>
                    <p class="text-sm dark:text-green-300">${career.trend || 'Growing demand in the industry'}</p>
                </div>
            </div>
            
            ${requiredSkills.length > 0 ? `
            <div>
                <h3 class="font-semibold text-lg mb-3 dark:text-white">Required Skills</h3>
                <div class="space-y-3">
                    ${requiredSkills.map(skill => {
                        const hasSkill = userSkills.some(userSkill => 
                            userSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(userSkill)
                        );
                        
                        return `
                            <div class="flex items-center justify-between p-3 ${hasSkill ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900'} rounded-lg">
                                <span class="font-medium dark:text-white">${skill}</span>
                                <span class="text-sm ${hasSkill ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'}">
                                    ${hasSkill ? '✓ You have this skill' : '✗ You need to learn this'}
                                </span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            ` : ''}
            
            ${career.resources && career.resources.length > 0 ? `
            <div>
                <h3 class="font-semibold text-lg mb-3 dark:text-white">Learning Resources</h3>
                <p class="text-gray-700 dark:text-gray-300 mb-3">Learn the skills you need for this career path:</p>
                <div class="space-y-3">
                    ${career.resources.map(resource => `
                        <a href="${resource.link}" target="_blank" class="resource-card bg-gray-50 dark:bg-gray-700 p-4 rounded-lg block hover:bg-gray-100 dark:hover:bg-gray-600">
                            <div class="flex justify-between items-start">
                                <div>
                                    <h4 class="font-semibold dark:text-white">${resource.name}</h4>
                                    <p class="text-sm text-gray-600 dark:text-gray-300">${resource.provider} • ${resource.type} • ${resource.duration}</p>
                                </div>
                                <span class="resource-badge ${resource.free ? 'free' : 'paid'}">${resource.free ? 'Free' : 'Paid'}</span>
                            </div>
                        </a>
                    `).join('')}
                </div>
            </div>
            ` : `
            <div>
                <h3 class="font-semibold text-lg mb-3 dark:text-white">Learning Resources</h3>
                <p class="text-gray-700 dark:text-gray-300">Check out these platforms for learning resources:</p>
                <div class="mt-3 space-y-2">
                    <a href="https://www.coursera.org" target="_blank" class="resource-card bg-gray-50 dark:bg-gray-700 p-4 rounded-lg block hover:bg-gray-100 dark:hover:bg-gray-600">
                        <div class="flex justify-between items-start">
                            <div>
                                <h4 class="font-semibold dark:text-white">Coursera</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-300">Online courses • Professional Certificates • Degrees</p>
                            </div>
                            <span class="resource-badge paid">Paid</span>
                        </div>
                    </a>
                    <a href="https://www.udemy.com" target="_blank" class="resource-card bg-gray-50 dark:bg-gray-700 p-4 rounded-lg block hover:bg-gray-100 dark:hover:bg-gray-600">
                        <div class="flex justify-between items-start">
                            <div>
                                <h4 class="font-semibold dark:text-white">Udemy</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-300">Video courses • Hands-on projects • Lifetime access</p>
                            </div>
                            <span class="resource-badge paid">Paid</span>
                        </div>
                    </a>
                    <a href="https://www.freecodecamp.org" target="_blank" class="resource-card bg-gray-50 dark:bg-gray-700 p-4 rounded-lg block hover:bg-gray-100 dark:hover:bg-gray-600">
                        <div class="flex justify-between items-start">
                            <div>
                                <h4 class="font-semibold dark:text-white">freeCodeCamp</h4>
                                <p class="text-sm text-gray-600 dark:text-gray-300">Coding challenges • Projects • Certifications</p>
                            </div>
                            <span class="resource-badge free">Free</span>
                        </div>
                    </a>
                </div>
            </div>
            `}
            
            ${(isFreelancer && career.freelancing) ? `
            <div>
                <h3 class="font-semibold text-lg mb-2 dark:text-white">Freelancing Opportunities</h3>
                <p class="text-gray-700 dark:text-gray-300 mb-2">This career has good freelancing potential. You can find work on these platforms:</p>
                <div class="flex flex-wrap gap-2">
                    ${career.freelancingPlatforms.map(platform => `
                        <a href="${getFreelancingPlatformLink(platform)}" target="_blank" class="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-medium px-2 py-1 rounded hover:underline">${platform}</a>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            ${isJobSeeker ? `
            <div>
                <h3 class="font-semibold text-lg mb-2 dark:text-white">Job Opportunities</h3>
                <p class="text-gray-700 dark:text-gray-300 mb-2">You can find job opportunities for ${careerName} roles on these platforms:</p>
                <div class="flex flex-wrap gap-2">
                    <a href="https://www.linkedin.com/jobs" target="_blank" class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded hover:underline">LinkedIn Jobs</a>
                    <a href="https://www.naukri.com" target="_blank" class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded hover:underline">Naukri.com</a>
                    <a href="https://www.indeed.com" target="_blank" class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded hover:underline">Indeed</a>
                    <a href="https://www.glassdoor.com" target="_blank" class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded hover:underline">Glassdoor</a>
                </div>
                
                ${career.companies && career.companies.length > 0 ? `
                <p class="text-gray-700 dark:text-gray-300 mt-3 mb-2">Companies currently hiring for this role:</p>
                <div class="flex flex-wrap gap-2">
                    ${career.companies.map(company => `
                        <span class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2 py-1 rounded">${company}</span>
                    `).join('')}
                </div>
                ` : ''}
            </div>
            ` : ''}
            
            ${career.learningPath ? `
            <div>
                <h3 class="font-semibold text-lg mb-2 dark:text-white">Learning Path</h3>
                <p class="text-gray-700 dark:text-gray-300">${career.learningPath}</p>
            </div>
            ` : ''}
        </div>
    `;
    
    careerModal.style.display = 'flex';
}

// Get freelancing platform links
function getFreelancingPlatformLink(platform) {
    const links = {
        'Upwork': 'https://www.upwork.com',
        'Freelancer': 'https://www.freelancer.com',
        'Fiverr': 'https://www.fiverr.com',
        'Toptal': 'https://www.toptal.com',
        'PeoplePerHour': 'https://www.peopleperhour.com',
        '99designs': 'https://99designs.com',
        'HackerOne': 'https://www.hackerone.com',
        'Bugcrowd': 'https://www.bugcrowd.com',
        'Kaggle': 'https://www.kaggle.com'
    };
    
    return links[platform] || '#';
}

// Close modal
function closeModal() {
    careerModal.style.display = 'none';
}

// Share modal functions
function openShareModal() {
    // Generate a shareable link
    document.getElementById('shareableLink').value = window.location.href;
    shareModal.style.display = 'flex';
}

function closeShareModal() {
    shareModal.style.display = 'none';
}

function shareOnWhatsApp() {
    const text = `Check out my career path recommendations from CareerPath AI!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.href)}`, '_blank');
}

function shareOnTelegram() {
    const text = `Check out my career path recommendations from CareerPath AI!`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`, '_blank');
}

function shareOnTwitter() {
    const text = `Check out my career path recommendations from CareerPath AI!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
}

function shareOnLinkedIn() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
}

function shareOnFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
}

function copyShareLink() {
    const linkInput = document.getElementById('shareableLink');
    linkInput.select();
    document.execCommand('copy');
    alert('Link copied to clipboard!');
}

// Update user data in state
function updateUserData(field, event) {
    state.userData[field] = event.target.value;
    // Clear error when user starts typing
    if (state.errors[field]) {
        delete state.errors[field];
        render();
    }
}

// Navigation functions
function nextStep() {
    if (state.currentStep < state.totalSteps) {
        state.currentStep++;
        render();
    }
}

function prevStep() {
    if (state.currentStep > 1) {
        state.currentStep--;
        state.errors = {};
        render();
    }
}

function goToStep(step) {
    if (step >= 1 && step <= state.totalSteps) {
        state.currentStep = step;
        state.errors = {};
        render();
    }
}

function validateAndProceed() {
    if (validateStep1()) {
        nextStep();
    } else {
        render();
    }
}

function validateInterestsAndProceed() {
    if (validateStep2()) {
        nextStep();
    } else {
        render();
    }
}

function validateGoalsAndGenerate() {
    if (validateStep3()) {
        generateResults();
    } else {
        render();
    }
}

// Call Gemini API for career recommendations (using serverless function)
async function callGeminiAPI(userData) {
    try {
        const response = await fetch('/api/getCareerAdvice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userData: userData })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        
        // Validate the API response for accuracy
        if (data.careers && Array.isArray(data.careers)) {
            data.careers.forEach(career => {
                // Ensure match percentage is realistic based on skills
                const realisticMatch = calculateSkillMatch(userData.skills, career.requiredSkills || []);
                career.match = Math.min(career.match, realisticMatch);
                
                // Ensure salary range is realistic
                if (career.salary) {
                    career.salary = validateSalaryRange(career.salary);
                }
            });
            
            // Sort by match percentage
            data.careers.sort((a, b) => b.match - a.match);
            
            // Show accuracy indicator
            addAccuracyIndicator();
        }
        
        return data;
    } catch (error) {
        console.error('Error calling API:', error);
        throw error;
    }
}

// Generate results using Gemini API
async function generateResults() {
    // Show loading state
    app.innerHTML = `
        <div class="p-8 text-center">
            <div class="flex justify-center mb-6">
                <div class="loading-spinner"></div>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Generating Your Career Plan</h2>
            <p class="text-gray-600 dark:text-gray-300">Analyzing your skills against current market trends using Gemini AI...</p>
        </div>
    `;
    
    try {
        // Call Gemini API
        const apiPayload = await callGeminiAPI(state.userData);
        const careers = apiPayload?.careers;

        if (!Array.isArray(careers)) {
            throw new Error('Invalid API response shape: "careers" not found');
        }

        // Enhanced combination of Gemini results with our career trends data
        const combinedResults = careers.map(result => {
            // Try to find a matching career in our trends data
            const careerKey = Object.keys(careerTrends).find(key => 
                key.toLowerCase().includes(result.career.toLowerCase()) || 
                result.career.toLowerCase().includes(key.toLowerCase())
            );
            
            const careerData = careerTrends[careerKey] || {};
            
            return {
                // Start with our known career data
                ...careerData,
                // Override with API results
                ...result,
                // Ensure we have all required fields with fallbacks
                career: result.career || careerData.career || "Tech Professional",
                salary: result.salary || careerData.salary || "₹5-12 LPA",
                demand: result.demand || careerData.demand || "High",
                growth: result.growth || careerData.growth || "15% by 2029",
                description: result.description || careerData.description || "A promising career path with good growth potential.",
                trend: result.trend || careerData.trend || "Growing field with opportunities",
                // Handle missing skills
                missingSkills: result.missingSkills || careerData.skills?.filter(s => {
                    const userSkills = state.userData.skills.toLowerCase();
                    return !userSkills.includes(String(s).toLowerCase());
                }) || [],
                // Preserve resources, companies, learningPath, freelancing data
                resources: careerData.resources || [],
                companies: careerData.companies || [],
                learningPath: careerData.learningPath || "",
                freelancing: careerData.freelancing || false,
                freelancingPlatforms: careerData.freelancingPlatforms || []
            };
        });

        state.topCareers = combinedResults;
        state.apiSource = 'gemini';
        state.currentStep = 4;
        render();
    } catch (error) {
        console.error("Error generating results with Gemini:", error);
        
        // Fallback to static analysis if API fails
        alert("API is not responding. Using our expert analysis instead.");
        generateFallbackResults();
    }
}

// Fallback results generation
function generateFallbackResults() {
    const userSkills = state.userData.skills.split(',').map(skill => skill.trim().toLowerCase());
    
    // Calculate match scores for each career
    const careerMatches = Object.keys(careerTrends).map(career => {
        const requiredSkills = careerTrends[career].skills.map(skill => skill.toLowerCase());
        
        // More accurate skill matching
        const matchedSkills = requiredSkills.filter(skill => 
            userSkills.some(userSkill => {
                // Check for exact match or significant overlap
                const userWords = userSkill.split(/\s+/);
                const skillWords = skill.split(/\s+/);
                
                // Check if any word from user skill matches any word from required skill
                return userWords.some(uWord => 
                    skillWords.some(sWord => 
                        uWord.length > 2 && sWord.length > 2 && 
                        (uWord.includes(sWord) || sWord.includes(uWord))
                    )
                );
            })
        );
        
        const matchPercentage = Math.round((matchedSkills.length / requiredSkills.length) * 100);
        
        return {
            ...careerTrends[career],
            career,
            match: matchPercentage,
            matchedSkills,
            missingSkills: requiredSkills.filter(skill => !matchedSkills.includes(skill)),
            trend: careerTrends[career].trend
        };
    });
    
    // Sort by best match
    careerMatches.sort((a, b) => b.match - a.match);
    
    // Get top 3 careers
    state.topCareers = careerMatches.slice(0, 3);
    state.apiSource = 'fallback';
    state.currentStep = 4;
    render();
}

// Enhanced skill matching algorithm
function calculateSkillMatch(userSkills, requiredSkills) {
    const userSkillList = userSkills.split(',').map(skill => skill.trim().toLowerCase());
    const requiredSkillList = requiredSkills.map(skill => skill.toLowerCase());
    
    let matchedCount = 0;
    
    for (const reqSkill of requiredSkillList) {
        for (const userSkill of userSkillList) {
            // More accurate matching with multiple techniques
            if (
                // Exact match
                userSkill === reqSkill ||
                // Contains match
                userSkill.includes(reqSkill) || 
                reqSkill.includes(userSkill) ||
                // Similar words match (for common variations)
                areSkillsSimilar(userSkill, reqSkill)
            ) {
                matchedCount++;
                break;
            }
        }
    }
    
    // Calculate match percentage with more weight on exact matches
    const exactMatchPercentage = (matchedCount / requiredSkillList.length) * 100;
    
    // Apply a slight penalty for partial matches to ensure accuracy
    return Math.min(95, Math.round(exactMatchPercentage * 0.95));
}

// Helper function to check if skills are similar
function areSkillsSimilar(skill1, skill2) {
    const commonVariations = {
        'js': 'javascript',
        'reactjs': 'react',
        'nodejs': 'node.js',
        'html5': 'html',
        'css3': 'css',
        'ml': 'machine learning',
        'ai': 'artificial intelligence',
        'dl': 'deep learning',
        'ux': 'user experience',
        'ui': 'user interface'
    };
    
    // Check if either skill is a common variation of the other
    if (commonVariations[skill1] === skill2 || commonVariations[skill2] === skill1) {
        return true;
    }
    
    // Check for other common patterns
    const words1 = skill1.split(/\s+|_/);
    const words2 = skill2.split(/\s+|_/);
    
    // Check if any words match between the two skills
    return words1.some(word1 => words2.some(word2 => word1 === word2));
}

// Validate salary range format
function validateSalaryRange(salary) {
    // Ensure salary follows the expected format
    if (typeof salary === 'string' && salary.includes('LPA')) {
        return salary;
    }
    
    // Default fallback
    return "₹5-12 LPA";
}

// Generate PDF function
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(22);
    doc.setTextColor(67, 97, 238);
    doc.text('CareerPath AI - Personalized Career Plan', 105, 20, { align: 'center' });
    
    // Add user information
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${state.userData.name}`, 20, 40);
    doc.text(`Email: ${state.userData.email}`, 20, 50);
    doc.text(`Skills: ${state.userData.skills}`, 20, 60);
    doc.text(`Interests: ${state.userData.interests.join(', ')}`, 20, 70);
    doc.text(`Career Goals: ${state.userData.goals}`, 20, 80);
    doc.text(`Salary Expectations: ${state.userData.salaryRange}`, 20, 90);
    
    // Add career recommendations
    doc.setFontSize(18);
    doc.setTextColor(67, 97, 238);
    doc.text('Career Recommendations', 20, 110);
    
    let yPosition = 120;
    state.topCareers.forEach((career, index) => {
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }
        
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`${index + 1}. ${career.career} (${career.match}% Match)`, 20, yPosition);
        
        doc.setFontSize(10);
        doc.text(`Salary: ${career.salary} | Demand: ${career.demand} | Growth: ${career.growth}`, 20, yPosition + 7);
        doc.text(career.description, 20, yPosition + 14, { maxWidth: 170 });
        
        yPosition += 30;
    });
    
    // Save the PDF
    doc.save('CareerPath_AI_Report.pdf');
}

function restartProcess() {
    state.currentStep = 1;
    state.userData = {
        name: '',
        email: '',
        skills: '',
        experience: '',
        employmentStatus: '',
        interests: [],
        goals: '',
        constraints: '',
        salaryRange: ''
    };
    state.results = null;
    state.topCareers = [];
    state.errors = {};
    state.apiSource = null;
    render();
}