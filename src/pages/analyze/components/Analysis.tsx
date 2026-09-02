import { useState } from "react";
import Banner from "./analyzeUi/Banner";
import Tab from "./analyzeUi/Tab";
import SkillTab from "./analyzeUi/SkillTab";
import OverviewTab from "./analyzeUi/OverviewTab";
import AIinsightTab from "./analyzeUi/AIinsightTab";
import OptimizationTab from "./analyzeUi/OptimizationTab";
import AnalysisSkelation from "./analyzeUi/AnalysisSkelation";
import ErrorMessage from "../../../components/ErrorMessage";

export default function Analysis({onReset}: {onReset: () => void}) {
  const data = tempModelData
  const error = false
  const [activeTab, setActiveTab] = useState<"overview" | "skills" | "insights" | "checklist">("overview");
  const [copied, setCopied] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const score = data?.atsScore || data?.result?.score || 0;
  const fit = data?.result?.fit || "Good Fit";
  const candidateName = data?.resumeStructuredText?.contact?.name || "Candidate";
  const jobTitle = data?.jobStructuredText?.jobTitle || "Target Role";

  const handleCopySummary = () => {
    const summaryText = `ATS Score: ${score}% (${fit})\nCandidate: ${candidateName}\nJob: ${jobTitle}\nSummary: ${data?.result?.summary}`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const matchedCount = data?.matchedSkills?.length || 0;
  const missingCount = data?.missingSkills?.length || 0;
  const matchPercentage = Math.round((matchedCount / (matchedCount + missingCount || 1)) * 100);
  const totalSkillCount = data?.jobStructuredText?.requiredSkills?.length + data?.jobStructuredText?.preferredSkills?.length || 0;

  if (error) return <ErrorMessage onRetry={() => onReset()}/>

  if (!data) return <AnalysisSkelation/>

  return (
    <div className="w-full mainDiv max-w-7xl! mx-auto space-y-16 animate-fadeIn">
      {/* Header Verdict Banner */}
      <Banner data={data} candidateName={candidateName} jobTitle={jobTitle} fit={fit} handleCopySummary={handleCopySummary} copied={copied} onReset={onReset}/>

      <div className="space-y-8">
        {/* Navigation Tabs */}
        <Tab activeTab={activeTab} setActiveTab={setActiveTab} matchedCount={matchedCount} missingCount={missingCount} data={data} />

        {/* Tab 1: OVERVIEW */}
        <OverviewTab totalSkillCount={totalSkillCount} activeTab={activeTab} score={score} fit={fit} data={data} setActiveTab={setActiveTab} matchedCount={matchedCount} missingCount={missingCount} matchPercentage={matchPercentage} />

        {/* Tab 2: SKILLS MATRIX */}
        <SkillTab activeTab={activeTab} data={data} />

        {/* Tab 3: AI INSIGHTS */}
        <AIinsightTab activeTab={activeTab} data={data} />

        {/* Tab 4: OPTIMIZATION CHECKLIST */}
        <OptimizationTab activeTab={activeTab} checkedItems={checkedItems} toggleCheck={toggleCheck}/>
      </div>
    </div>
  );
}


const tempModelData = {
  id: "a7f3c921-4b62-4c1e-9f31-82d7a6e51420",
  guestId: "guest_8f21c4",

  // Resume
  resumeRawText: `
  Phurpa Sherpa
  Frontend Developer

  Frontend Developer experienced in React, TypeScript, Tailwind CSS,
  Framer Motion, REST APIs and responsive UI development.

  Experience:
  Frontend Developer Intern - YouBloom
  May 2026 - Present

  Education:
  BSc (Hons) Computing - Leeds Beckett University

  Skills:
  React, JavaScript, TypeScript, Tailwind CSS, Framer Motion,
  Git, REST API, Node.js, Supabase
`.trim(),

  resumeStructuredText: {
    contact: {
      name: "Phurpa Sherpa",
      email: "phurpa@example.com",
      phone: null,
      linkedin: "https://linkedin.com/in/phurpa",
      github: "https://github.com/phurpa"
    },

    summary:
      "Frontend Developer experienced in React, TypeScript, Tailwind CSS, Framer Motion, REST APIs and responsive UI development.",

    experience: [
      {
        jobTitle: "Frontend Developer Intern",
        company: "YouBloom",
        location: "Remote",
        startDate: "May 2026",
        endDate: null,
        description:
          "Worked on React frontend development, UI implementation, responsive layouts and bug fixes."
      }
    ],

    education: [
      {
        degree: "BSc (Hons) Computing",
        school: "Leeds Beckett University",
        location: "UK",
        startDate: null,
        endDate: null,
        gpa: null
      }
    ],

    skills: [
      "React",
      "JavaScript",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Git",
      "REST API",
      "Node.js",
      "Supabase"
    ],

    projects: [
      {
        name: "CareerOS",
        description:
          "AI-powered career intelligence platform that analyzes resumes against job descriptions.",
        link: null
      }
    ]
  },

  // Job Description
  jobRawText: `
We are looking for a Frontend Developer to build modern and responsive
web applications.

Requirements:
- Strong experience with React and JavaScript
- TypeScript experience
- Knowledge of HTML and CSS
- Experience with REST APIs
- Git and version control
- Understanding of responsive web design
- Experience with testing is a plus
- Next.js experience is preferred
`.trim(),

  jobStructuredText: {
    jobTitle: "Frontend Developer",

    requiredSkills: [
      "React",
      "JavaScript",
      "TypeScript",
      "HTML",
      "CSS",
      "REST APIs",
      "Git",
      "Responsive Web Design"
    ],

    preferredSkills: [
      "Testing",
      "Next.js"
    ],

    responsibilities: [
      "Build modern web applications",
      "Develop responsive user interfaces",
      "Integrate REST APIs",
      "Collaborate with development teams"
    ]
  },

  // AI Analysis
  atsScore: 82,

  matchedSkills: [
    "React",
    "JavaScript",
    "TypeScript",
    "REST APIs",
    "Git",
    "Responsive Web Design"
  ],

  missingSkills: [
    "HTML",
    "CSS",
    "Testing",
    "Next.js"
  ],

  matchedKeywords: [
    "React",
    "JavaScript",
    "TypeScript",
    "REST APIs",
    "Git",
    "Responsive"
  ],

  insights: [
    {
      type: "strength",
      title: "Strong frontend foundation",
      description:
        "Your experience with React, JavaScript and TypeScript aligns well with the core requirements."
    },
    {
      type: "gap",
      title: "Missing preferred technologies",
      description:
        "Next.js and testing experience are not clearly demonstrated in the resume."
    },
    {
      type: "recommendation",
      title: "Improve keyword coverage",
      description:
        "Consider explicitly mentioning HTML, CSS and responsive web development if you have practical experience with them."
    }
  ],

  result: {
    score: 82,

    summary:
      "The candidate has a strong match for the Frontend Developer position, particularly in React, JavaScript, TypeScript, REST APIs and Git.",

    fit: "Good Fit",

    strengths: [
      "React experience",
      "TypeScript experience",
      "REST API integration",
      "Frontend development experience"
    ],

    gaps: [
      "Testing",
      "Next.js",
      "HTML/CSS keywords"
    ]
  },

  resumeContentHash: "sha256_resume_hash_example",
  jobContentHash: "sha256_job_hash_example",
  createdAt: "2026-09-02T10:30:00.000Z",
  updatedAt: "2026-09-02T10:30:00.000Z"
};