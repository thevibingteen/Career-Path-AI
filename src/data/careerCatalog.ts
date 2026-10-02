import { Career } from '../types';
import { verifiedResources } from './curatedResources';

export const careerCatalog: Career[] = [
  {
    id: 'full-stack-engineer',
    title: 'Full Stack Engineer',
    category: 'Software Engineering',
    description: 'Builds end-to-end web applications covering user interfaces, server-side APIs, database architectures, and cloud deployments.',
    responsibilities: [
      'Design, build, and maintain scalable web applications and client-facing interfaces',
      'Architect robust RESTful and GraphQL APIs with server-side validation and authentication',
      'Optimize database schemas, queries, and caching mechanisms for responsiveness',
      'Implement automated unit, integration, and end-to-end tests across the stack'
    ],
    essentialSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'Git', 'REST APIs', 'HTML', 'CSS'],
    secondarySkills: ['Docker', 'PostgreSQL', 'MongoDB', 'Tailwind CSS', 'Next.js', 'Redis', 'CI/CD'],
    prerequisites: ['Basic programming logic', 'Understanding of the client-server HTTP lifecycle'],
    transferableSkills: ['Problem decomposition', 'System troubleshooting', 'Cross-functional collaboration'],
    sampleJobTitles: ['Full Stack Developer', 'Software Engineer (Full Stack)', 'Web Application Engineer'],
    industries: ['SaaS', 'FinTech', 'E-Commerce', 'HealthTech', 'Agencies & Consultancies'],
    workEnvironments: ['Remote', 'Hybrid', 'On-site'],
    learningPriorities: [
      'Deepen modern JavaScript/TypeScript fundamentals',
      'Master component-driven frontend architecture with React',
      'Build secure Node.js backend services and relational databases',
      'Deploy end-to-end applications to cloud platforms with automated CI/CD'
    ],
    portfolioProjectIdeas: [
      'Collaborative Kanban workspace with real-time WebSocket updates and role-based access control',
      'E-commerce order fulfillment platform with payment gateway integration and SQL transaction handling',
      'Developer portfolio & technical blog with static site generation and headless CMS'
    ],
    interviewTopics: [
      'Frontend state management, Virtual DOM, and rendering performance',
      'REST API design principles, authentication strategies (JWT, OAuth), and error handling',
      'Database normalization, indexing, ACID transactions, and query optimization',
      'System design basics for high-availability web services'
    ],
    recommendedResources: [
      ...(verifiedResources.javascript || []),
      ...(verifiedResources.react || [])
    ],
    indicativeCompensationNotice: 'Indicative compensation varies significantly by location, company stage, and experience. Reference public surveys (e.g. Stack Overflow Developer Survey, Bureau of Labor Statistics) for current regional benchmarks.'
  },
  {
    id: 'frontend-engineer',
    title: 'Frontend Engineer',
    category: 'Software Engineering',
    description: 'Specializes in crafting responsive, high-performance, accessible, and intuitive user experiences across web and mobile platforms.',
    responsibilities: [
      'Translate design systems and wireframes into clean, accessible, and performant UI components',
      'Ensure web accessibility compliance (WCAG 2.1 AA) and cross-browser reliability',
      'Optimize Core Web Vitals (LCP, INP, CLS) and client-side performance',
      'Integrate backend REST/GraphQL endpoints with client-side state caching'
    ],
    essentialSkills: ['JavaScript', 'TypeScript', 'React', 'HTML', 'CSS', 'Tailwind CSS', 'Git', 'Responsive Design'],
    secondarySkills: ['Next.js', 'Vue.js', 'Web Performance', 'Accessibility (a11y)', 'Testing (Jest/Vitest)', 'Figma'],
    prerequisites: ['HTML5 semantic structure', 'CSS flexbox/grid layout systems'],
    transferableSkills: ['Visual empathy', 'Attention to UX detail', 'Interaction design intuition'],
    sampleJobTitles: ['Frontend Developer', 'UI Engineer', 'Client-Side Web Developer'],
    industries: ['Media & Streaming', 'Consumer Web Apps', 'B2B SaaS', 'Creative Agencies'],
    workEnvironments: ['Remote', 'Hybrid', 'On-site'],
    learningPriorities: [
      'Semantic HTML, WCAG accessibility, and responsive CSS architectures',
      'Modern TypeScript with strict typing for component props and state',
      'State management, client caching (TanStack Query), and routing',
      'Web performance profiling using browser DevTools'
    ],
    portfolioProjectIdeas: [
      'Interactive design system component library with Storybook documentation and keyboard a11y',
      'Personal finance tracking dashboard with interactive visual charts and dark/light themes',
      'Accessible multimedia streaming player with keyboard navigation and custom controls'
    ],
    interviewTopics: [
      'CSS layout mechanics (Grid, Flexbox, stacking context, CSS variables)',
      'React hooks lifecycle, re-render triggers, and memoization patterns',
      'Web performance metrics and Core Web Vitals optimization techniques',
      'DOM event delegation, bubbling, and debouncing/throttling'
    ],
    recommendedResources: [
      ...(verifiedResources.javascript || []),
      ...(verifiedResources.react || [])
    ],
    indicativeCompensationNotice: 'Indicative compensation varies by geography, level, and industry. Consult verified platforms such as Levels.fyi and regional salary surveys.'
  },
  {
    id: 'backend-engineer',
    title: 'Backend Engineer',
    category: 'Software Engineering',
    description: 'Architects the engines powering modern applications: high-throughput APIs, asynchronous messaging queues, data persistence, and security.',
    responsibilities: [
      'Design, build, and deploy high-throughput microservices and APIs',
      'Implement scalable data models and optimize relational and document databases',
      'Configure distributed caching, background worker queues, and event streams',
      'Ensure secure authentication, encryption, and defense against OWASP vulnerabilities'
    ],
    essentialSkills: ['Node.js', 'Python', 'SQL', 'PostgreSQL', 'Git', 'REST APIs', 'Docker'],
    secondarySkills: ['Redis', 'Go', 'GraphQL', 'Kafka', 'Microservices', 'Kubernetes', 'Linux'],
    prerequisites: ['Object-oriented or functional programming fundamentals', 'Basic SQL queries'],
    transferableSkills: ['Logical structuring', 'Root-cause debugging', 'Algorithmic efficiency'],
    sampleJobTitles: ['Backend Developer', 'Server Engineer', 'API Platform Engineer'],
    industries: ['FinTech', 'Cloud Infrastructure', 'Logistics', 'Enterprise Software'],
    workEnvironments: ['Remote', 'Hybrid', 'On-site'],
    learningPriorities: [
      'Master server-side runtime environments (Node.js or Python/FastAPI)',
      'Relational database architecture, migrations, and index tuning',
      'Caching layers with Redis and message queue workflows',
      'Containerization with Docker and cloud microservice deployment'
    ],
    portfolioProjectIdeas: [
      'High-concurrency URL shortener & analytics platform with Redis caching and rate limiting',
      'Event-driven notification dispatch engine with RabbitMQ/Redis Bull queues and worker pools',
      'Secure multi-tenant REST API with JWT auth, role permissions, and Swagger/OpenAPI docs'
    ],
    interviewTopics: [
      'Concurrency models, asynchronous event loops, and thread pools',
      'Database indexing (B-Trees, composite indexes) and transaction isolation levels',
      'Distributed systems basics (CAP theorem, idempotent endpoints, circuit breakers)',
      'API security best practices (rate limiting, parameterized queries, token validation)'
    ],
    recommendedResources: [
      ...(verifiedResources.javascript || []),
      ...(verifiedResources.python || [])
    ],
    indicativeCompensationNotice: 'Compensation depends heavily on technical specialty and distributed systems experience. Review industry benchmark datasets.'
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    category: 'Data & AI',
    description: 'Transforms complex raw datasets into predictive statistical models, actionable business intelligence, and automated data pipelines.',
    responsibilities: [
      'Perform exploratory data analysis, hypothesis testing, and statistical validation',
      'Build, evaluate, and tune supervised and unsupervised machine learning models',
      'Develop interactive visual dashboards and present findings to cross-functional stakeholders',
      'Collaborate with engineering teams to deploy models into production environments'
    ],
    essentialSkills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Pandas', 'Data Visualization'],
    secondarySkills: ['Scikit-Learn', 'R', 'TensorFlow', 'PyTorch', 'Tableau', 'BigQuery', 'Feature Engineering'],
    prerequisites: ['Linear algebra & multivariable calculus basics', 'Introductory Python scripting'],
    transferableSkills: ['Analytical reasoning', 'Data storytelling', 'Critical metric evaluation'],
    sampleJobTitles: ['Data Scientist', 'Applied Scientist', 'Analytics Specialist'],
    industries: ['Healthcare', 'Finance', 'E-Commerce', 'Marketing Technology', 'Scientific Research'],
    workEnvironments: ['Remote', 'Hybrid', 'On-site'],
    learningPriorities: [
      'Statistical foundations (probability distributions, hypothesis testing, regression)',
      'Data manipulation and cleaning using Pandas and NumPy',
      'Applied machine learning algorithms (classification, clustering, ensemble methods)',
      'Model validation, cross-validation, and performance metrics (ROC-AUC, F1, RMSE)'
    ],
    portfolioProjectIdeas: [
      'Customer churn predictive modeling pipeline with exploratory visualization and feature importance analysis',
      'Real estate pricing regression engine with hyperparameter tuning and model interpretation',
      'Automated sentiment classification system for customer reviews using NLP techniques'
    ],
    interviewTopics: [
      'Bias-variance tradeoff, overfitting prevention, and regularization (L1/L2)',
      'Evaluation metrics for imbalanced datasets (precision, recall, PR-AUC vs ROC-AUC)',
      'Feature engineering and handling missing data or high-cardinality categorical features',
      'A/B testing methodology, sample sizing, and statistical significance'
    ],
    recommendedResources: [
      ...(verifiedResources.python || []),
      ...(verifiedResources.machineLearning || [])
    ],
    indicativeCompensationNotice: 'Salaries reflect statistical modeling rigor and domain expertise. Check current published reports from organizations like Kaggle and BLS.'
  },
  {
    id: 'ai-ml-engineer',
    title: 'Machine Learning / AI Engineer',
    category: 'Data & AI',
    description: 'Designs, trains, fine-tunes, and deploys production machine learning models and Generative AI applications at scale.',
    responsibilities: [
      'Develop, train, and optimize deep learning and machine learning architectures',
      'Build end-to-end MLOps pipelines for data versioning, model tracking, and continuous training',
      'Deploy scalable model inference endpoints with low latency and batching strategies',
      'Integrate Foundation Models (LLMs) via prompt engineering, retrieval-augmented generation (RAG), and fine-tuning'
    ],
    essentialSkills: ['Python', 'Machine Learning', 'PyTorch', 'Docker', 'Git', 'Deep Learning', 'SQL'],
    secondarySkills: ['TensorFlow', 'MLOps', 'Vector Databases', 'Hugging Face', 'FastAPI', 'LangChain / LlamaIndex', 'Kubernetes'],
    prerequisites: ['Python proficiency', 'Linear algebra and calculus', 'Data structures fundamentals'],
    transferableSkills: ['Systems thinking', 'Experimental mindset', 'Performance benchmarking'],
    sampleJobTitles: ['ML Engineer', 'AI Engineer', 'Deep Learning Specialist', 'MLOps Engineer'],
    industries: ['Autonomous Tech', 'Enterprise AI', 'Computer Vision', 'Search & Recommendation', 'BioTech'],
    workEnvironments: ['Remote', 'Hybrid', 'On-site'],
    learningPriorities: [
      'Deep learning frameworks (PyTorch) and neural network architectures',
      'Model serving architectures (FastAPI, ONNX, TorchServe)',
      'Modern LLM integration patterns, embeddings, and vector similarity search',
      'MLOps automation (experiment tracking with MLflow/Weights & Biases, CI/CD for models)'
    ],
    portfolioProjectIdeas: [
      'Production RAG document question-answering assistant with hybrid vector search and evaluation pipeline',
      'End-to-end computer vision inference pipeline with Dockerized FastAPI service and batch processing',
      'Automated model training and drift detection system using open-source MLOps tools'
    ],
    interviewTopics: [
      'Neural network optimization (optimizers, learning rate schedules, gradient vanishing)',
      'Model latency reduction techniques (quantization, pruning, distillation)',
      'Vector search indexing algorithms (HNSW, IVF) and embedding tradeoffs',
      'ML system design for high-throughput, low-latency prediction serving'
    ],
    recommendedResources: [
      ...(verifiedResources.python || []),
      ...(verifiedResources.machineLearning || [])
    ],
    indicativeCompensationNotice: 'AI engineering compensation reflects high demand for production deployment skills. Review verified compensation databases.'
  },
  {
    id: 'cloud-devops-engineer',
    title: 'Cloud & DevOps Engineer',
    category: 'Cloud & DevOps',
    description: 'Automates deployment pipelines, ensures cloud infrastructure reliability, manages container clusters, and drives infrastructure-as-code.',
    responsibilities: [
      'Automate cloud infrastructure provisioning using Infrastructure as Code (Terraform, CloudFormation)',
      'Architect, configure, and monitor CI/CD pipelines for zero-downtime releases',
      'Manage container orchestration platforms (Kubernetes) and microservice networking',
      'Implement observability, logging, alerting, and incident response runbooks'
    ],
    essentialSkills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux', 'AWS', 'Git', 'Bash / Scripting'],
    secondarySkills: ['Terraform', 'Prometheus / Grafana', 'Python', 'GCP / Azure', 'Ansible', 'Networking', 'Security Hardening'],
    prerequisites: ['Linux command line proficiency', 'Basic networking concepts (DNS, TCP/IP, VPC)'],
    transferableSkills: ['Automation mindset', 'High-pressure troubleshooting', 'Operational resilience'],
    sampleJobTitles: ['DevOps Engineer', 'Site Reliability Engineer (SRE)', 'Platform Engineer', 'Cloud Infrastructure Engineer'],
    industries: ['Cloud Providers', 'High-Growth Tech', 'Financial Services', 'E-Commerce Platforms'],
    workEnvironments: ['Remote', 'Hybrid', 'On-site'],
    learningPriorities: [
      'Linux system administration and shell scripting automation',
      'Containerization with Docker and multi-stage container optimization',
      'Container orchestration and service discovery with Kubernetes',
      'Infrastructure as Code (IaC) with Terraform and automated CI/CD pipelines'
    ],
    portfolioProjectIdeas: [
      'Production Kubernetes cluster deployment with ingress controller, TLS cert-manager, and auto-scaling',
      'Complete GitOps CI/CD delivery pipeline deploying microservices to cloud infrastructure via GitHub Actions',
      'Automated cloud infrastructure blueprint with Terraform, Prometheus monitoring, and Grafana dashboards'
    ],
    interviewTopics: [
      'Container networking, storage volumes, and Pod lifecycle in Kubernetes',
      'Zero-downtime deployment strategies (Blue/Green, Canary, Rolling updates)',
      'Disaster recovery, high availability, and infrastructure state management in Terraform',
      'Monitoring vs observability (metrics, logs, distributed traces)'
    ],
    recommendedResources: [
      ...(verifiedResources.cloudDevOps || [])
    ],
    indicativeCompensationNotice: 'Compensation scales with cloud scale and reliability experience. Benchmark against publicly available salary surveys.'
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    category: 'Cybersecurity',
    description: 'Safeguards organizational networks, systems, and data by identifying vulnerabilities, analyzing threats, and responding to security incidents.',
    responsibilities: [
      'Monitor security information and event management (SIEM) systems for anomalies and intrusions',
      'Conduct vulnerability scans, threat modeling, and risk assessments',
      'Coordinate incident triage, forensic analysis, and containment procedures',
      'Enforce security best practices, compliance controls, and employee awareness programs'
    ],
    essentialSkills: ['Network Security', 'Linux', 'SIEM', 'Incident Response', 'Risk Assessment', 'Vulnerability Assessment'],
    secondarySkills: ['Python', 'Wireshark', 'Cryptography', 'Ethical Hacking', 'OWASP Top 10', 'Cloud Security', 'Firewalls'],
    prerequisites: ['Computer networking fundamentals (OSI model, protocols)', 'Linux basic commands'],
    transferableSkills: ['Investigative curiosity', 'Methodical documentation', 'Risk communication'],
    sampleJobTitles: ['Information Security Analyst', 'SOC Analyst', 'Security Specialist'],
    industries: ['Banking & Finance', 'Defense & Government', 'Healthcare Systems', 'Enterprise IT'],
    workEnvironments: ['Hybrid', 'On-site', 'Remote'],
    learningPriorities: [
      'Networking protocols, packet analysis with Wireshark, and firewall configurations',
      'Security Operations Center (SOC) workflows and SIEM log investigation',
      'Vulnerability scanning, CVE analysis, and remediation planning',
      'Incident handling frameworks (NIST SP 800-61, SANS PICERL)'
    ],
    portfolioProjectIdeas: [
      'Home SOC lab with Elastic Stack or Splunk analyzing simulated attack logs and alerts',
      'Vulnerability assessment audit report of an isolated test environment with prioritized remediation',
      'Automated Python incident-triage script scanning firewall logs for suspicious IP patterns'
    ],
    interviewTopics: [
      'Investigating suspicious network traffic or phishing payloads step-by-step',
      'Common attack vectors (SQL injection, XSS, Ransomware, Man-in-the-Middle) and defenses',
      'Authentication protocols (Kerberos, OAuth, SAML, Multi-Factor Authentication)',
      'The CIA triad (Confidentiality, Integrity, Availability) applied to real enterprise scenarios'
    ],
    recommendedResources: [
      ...(verifiedResources.cybersecurity || [])
    ],
    indicativeCompensationNotice: 'Cybersecurity salaries vary based on certifications (Security+, CISSP) and security clearance. Review verified market datasets.'
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Product Designer',
    category: 'Design & UX',
    description: 'Conducts user research, designs wireframes and interactive prototypes, and crafts accessible design systems that delight users.',
    responsibilities: [
      'Lead user research interviews, usability testing, and persona development',
      'Create low-fidelity wireframes, user flow diagrams, and information architectures',
      'Design high-fidelity UI mockups, interactive prototypes, and micro-interactions in Figma',
      'Maintain unified design tokens and collaborate closely with frontend engineers'
    ],
    essentialSkills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'UI Design', 'Design Systems'],
    secondarySkills: ['User Testing', 'Interaction Design', 'HTML/CSS Basics', 'Information Architecture', 'Accessibility Design'],
    prerequisites: ['Visual hierarchy and typography fundamentals', 'Curiosity about user behavior'],
    transferableSkills: ['Empathy', 'Visual storytelling', 'Translating business goals into user journeys'],
    sampleJobTitles: ['Product Designer', 'UX/UI Designer', 'User Experience Architect'],
    industries: ['Digital Products', 'FinTech', 'Consumer Apps', 'E-Commerce', 'SaaS'],
    workEnvironments: ['Remote', 'Hybrid', 'On-site'],
    learningPriorities: [
      'Design thinking methodology (Empathize, Define, Ideate, Prototype, Test)',
      'Advanced Figma workflows (Auto Layout, Components, Variants, Interactive Components)',
      'Accessible UI design (color contrast, touch targets, screen-reader flow)',
      'Case study documentation demonstrating problem-solving and validated outcomes'
    ],
    portfolioProjectIdeas: [
      'End-to-end mobile app redesign case study with user research synthesis and interactive prototype',
      'Comprehensive web application design system with accessible color palettes and component variants',
      'B2B SaaS dashboard workflow optimization backed by user journey mapping and A/B test mockups'
    ],
    interviewTopics: [
      'Walking through a portfolio case study: explaining decisions, tradeoffs, and measurable results',
      'Handling conflicting feedback from product managers and engineering constraints',
      'Accessibility standards in UI design (WCAG guidelines, cognitive load, responsive design)',
      'Design systems governance and component versioning'
    ],
    recommendedResources: [
      ...(verifiedResources.design || [])
    ],
    indicativeCompensationNotice: 'Product design compensation depends on verified portfolio depth and product metrics impact. Refer to design salary reports.'
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    category: 'Data & AI',
    description: 'Builds scalable data ingestion pipelines, warehouse architectures, and transformation workflows that feed business analytics and AI models.',
    responsibilities: [
      'Design, build, and optimize batch and streaming ETL/ELT data pipelines',
      'Architect data warehouses and data lakes with partitioning, clustering, and data modeling',
      'Ensure data quality, schema evolution, and pipeline observability',
      'Manage pipeline orchestration tools (Airflow, Dagster, dbt)'
    ],
    essentialSkills: ['SQL', 'Python', 'Data Warehousing', 'ETL / ELT', 'Git', 'Docker'],
    secondarySkills: ['Spark / PySpark', 'Airflow', 'dbt', 'BigQuery / Snowflake', 'Kafka', 'PostgreSQL', 'Data Modeling'],
    prerequisites: ['Intermediate SQL proficiency', 'Python programming skills'],
    transferableSkills: ['Pipeline hygiene', 'Data integrity focus', 'Architecture optimization'],
    sampleJobTitles: ['Data Engineer', 'Big Data Developer', 'Analytics Engineer'],
    industries: ['Big Data Platforms', 'E-Commerce', 'Streaming Services', 'Telecommunications'],
    workEnvironments: ['Remote', 'Hybrid', 'On-site'],
    learningPriorities: [
      'Advanced SQL (window functions, analytical queries, query plans)',
      'Data modeling paradigms (dimensional modeling, Star schema, Data Vault)',
      'Workflow orchestration and pipeline automation with Airflow and dbt',
      'Distributed computing concepts with Apache Spark or cloud warehouses'
    ],
    portfolioProjectIdeas: [
      'End-to-end data pipeline extracting public API data, transforming with dbt, and loading into Snowflake/BigQuery',
      'Streaming analytics pipeline using Kafka, Python consumers, and real-time dashboard aggregation',
      'Automated data quality validation framework with Great Expectations and pipeline alerting'
    ],
    interviewTopics: [
      'Star schema vs Snowflake schema design and normalization tradeoffs',
      'Batch processing vs stream processing latency and fault-tolerance mechanics',
      'Idempotency and backfilling strategies in pipeline failures',
      'SQL query optimization (partition pruning, join algorithms, index strategies)'
    ],
    recommendedResources: [
      ...(verifiedResources.python || [])
    ],
    indicativeCompensationNotice: 'Data engineering compensation reflects pipeline reliability and warehouse scale. Check public engineering compensation indices.'
  },
  {
    id: 'mobile-app-developer',
    title: 'Mobile App Developer',
    category: 'Software Engineering',
    description: 'Builds native or cross-platform mobile applications for iOS and Android, focusing on fluid performance, offline support, and device integration.',
    responsibilities: [
      'Develop high-performance mobile user interfaces for iOS and Android devices',
      'Integrate device hardware capabilities (camera, GPS, biometrics, offline storage)',
      'Manage application lifecycle, state management, and network synchronization',
      'Prepare builds for App Store and Google Play distribution and compliance'
    ],
    essentialSkills: ['React Native / Flutter', 'JavaScript / TypeScript / Dart', 'Mobile UI Design', 'Git', 'REST APIs'],
    secondarySkills: ['iOS (Swift)', 'Android (Kotlin)', 'State Management', 'Push Notifications', 'Offline Storage (SQLite/MMKV)', 'App Store Deployment'],
    prerequisites: ['JavaScript or object-oriented programming foundation', 'Basic UI styling'],
    transferableSkills: ['Touch interaction sensitivity', 'Offline-first mindset', 'Memory efficiency'],
    sampleJobTitles: ['Mobile Developer', 'React Native Engineer', 'Flutter Developer', 'iOS/Android Engineer'],
    industries: ['Consumer Technology', 'FinTech Mobile Apps', 'Health & Fitness', 'Logistics & Delivery'],
    workEnvironments: ['Remote', 'Hybrid', 'On-site'],
    learningPriorities: [
      'Cross-platform framework mastery (React Native with Expo or Flutter)',
      'Mobile navigation patterns, animations, and touch gestures',
      'Offline data caching, background syncing, and push notification services',
      'App store publishing guidelines and release management'
    ],
    portfolioProjectIdeas: [
      'Offline-first habit tracker mobile app with local SQLite storage, reminders, and dark mode',
      'Location-based community discovery app with interactive maps and device GPS integration',
      'Personal expense tracker with camera receipt scanning and biometric authentication'
    ],
    interviewTopics: [
      'Mobile app lifecycle states (background, active, terminated) and state restoration',
      'Memory management and rendering performance (flatlist virtualization, image caching)',
      'Cross-platform bridge architecture vs native rendering engine tradeoffs',
      'Secure local storage practices for mobile credentials and tokens'
    ],
    recommendedResources: [
      ...(verifiedResources.javascript || []),
      ...(verifiedResources.react || [])
    ],
    indicativeCompensationNotice: 'Mobile developer compensation varies with iOS/Android platform depth and release track record. Review published salary reports.'
  }
];
