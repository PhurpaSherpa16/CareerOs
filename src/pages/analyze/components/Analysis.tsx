import { useState } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiZap,
  FiBriefcase,
  FiTarget,
  FiCheck,
  FiRefreshCw,
  FiCopy,
  FiCheckSquare,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { IoShieldCheckmark } from "react-icons/io5";

import JobMatchCard from "./analyzeUi/JobMatchCard";
import ExperienceMatchCard from "./analyzeUi/ExperienceMatchCard";
import MatchMetricsBarGraph from "./analyzeUi/MatchMetricsBarGraph";
import QuickInsightCards from "./analyzeUi/QuickInsightCards";

interface AnalysisProps {
  data?: typeof tempModelData;
  onReset?: () => void;
}

export default function Analysis({ data = tempModelData, onReset }: AnalysisProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "skills" | "insights" | "checklist">("overview");
  const [copied, setCopied] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const score = data.atsScore || data.result?.score || 0;
  const fit = data.result?.fit || "Good Fit";
  const candidateName = data.resumeStructuredText?.contact?.name || "Candidate";
  const jobTitle = data.jobStructuredText?.jobTitle || "Target Role";

  const handleCopySummary = () => {
    const summaryText = `ATS Score: ${score}% (${fit})\nCandidate: ${candidateName}\nJob: ${jobTitle}\nSummary: ${data.result?.summary}`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const matchedCount = data.matchedSkills?.length || 0;
  const missingCount = data.missingSkills?.length || 0;
  const matchPercentage = Math.round((matchedCount / (matchedCount + missingCount || 1)) * 100);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Verdict Banner */}
      <div className="relative overflow-hidden bg-linear-to-br from-(--primaryBlack) to-[#0F172A] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-slate-700/50">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-(--primaryBlue)/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-slate-200 border border-white/15">
                <FiBriefcase className="text-(--purple)" />
                {jobTitle}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <IoShieldCheckmark className="text-emerald-400" />
                {fit}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Resume Analysis Results for <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-300 to-indigo-200">{candidateName}</span>
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {data.result?.summary}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/15 cursor-pointer active:scale-95"
            >
              {copied ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
              {copied ? "Copied!" : "Copy Summary"}
            </button>
            {onReset && (
              <button
                onClick={onReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-(--primaryBlue) hover:bg-indigo-600 text-white text-xs font-semibold transition-all shadow-lg shadow-indigo-500/25 cursor-pointer active:scale-95"
              >
                <FiRefreshCw />
                New Analysis
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: "overview", label: "Overview", icon: FiTarget },
          { id: "skills", label: "Skills Matrix", icon: FiZap, badge: `${matchedCount}/${matchedCount + missingCount}` },
          { id: "insights", label: "AI Insights", icon: HiOutlineSparkles, badge: data.insights?.length },
          { id: "checklist", label: "Optimization Checklist", icon: FiCheckSquare }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl font-semibold text-sm transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                isActive
                  ? "border-(--primaryBlue) text-(--primaryBlue) bg-indigo-50/50"
                  : "border-transparent text-(--secondaryBlack) hover:text-(--primaryBlack) hover:bg-slate-50"
              }`}
            >
              <Icon className={isActive ? "text-(--primaryBlue)" : "text-slate-400"} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${isActive ? "bg-(--primaryBlue) text-white" : "bg-slate-200 text-slate-600"}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Row: Card 1 (Job Match Semi-Circle Gauge) & Card 2 (Experience Match 4+ Years Verified) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <JobMatchCard score={score} fit={fit} />
            <ExperienceMatchCard
              years="4+ Years"
              verified={true}
              role={data.resumeStructuredText?.experience?.[0]?.jobTitle || "Frontend Developer"}
              company={data.resumeStructuredText?.experience?.[0]?.company || "YouBloom"}
            />
          </div>

          {/* Middle Row: Matched Skills Highlights & Horizontal Bar Graph Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Matched Skills & Strengths */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl shadow-slate-100/50 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                    <FiCheckCircle className="text-emerald-500" /> Matched Skills &amp; Strengths
                  </h4>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {matchedCount} Matched
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {data.matchedSkills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60"
                    >
                      <FiCheck className="text-emerald-500 text-xs" /> {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  {matchedCount} out of {matchedCount + missingCount} target skills verified in candidate resume.
                </p>
              </div>
            </div>

            {/* Horizontal Bar Graph Section */}
            <MatchMetricsBarGraph
              expMatch={85}
              skillsMatch={matchPercentage}
              eduMatch={90}
              atsScore={score}
            />
          </div>

          {/* Bottom Row: 3 Flex Box AI Quick Insight Cards */}
          <QuickInsightCards
            insights={data.insights}
            onViewDetails={() => setActiveTab("insights")}
          />
        </div>
      )}

      {/* Tab 2: SKILLS MATRIX */}
      {activeTab === "skills" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Required &amp; Preferred Skill Alignment</h3>
              <p className="text-xs text-slate-500">
                Detailed side-by-side comparison of the job criteria against candidate qualifications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Required Skills */}
              <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <FiTarget className="text-(--primaryBlue)" /> Required Job Skills
                  </h4>
                  <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full">
                    {data.jobStructuredText?.requiredSkills?.length || 0} total
                  </span>
                </div>

                <div className="space-y-2">
                  {data.jobStructuredText?.requiredSkills?.map((skill, i) => {
                    const isMatched = data.matchedSkills?.includes(skill);
                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all ${
                          isMatched
                            ? "bg-white border-emerald-200 text-slate-800"
                            : "bg-rose-50/50 border-rose-200 text-rose-800"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isMatched ? (
                            <FiCheckCircle className="text-emerald-500 text-sm shrink-0" />
                          ) : (
                            <FiXCircle className="text-rose-500 text-sm shrink-0" />
                          )}
                          {skill}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                            isMatched ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {isMatched ? "Matched" : "Missing"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Skills */}
              <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <HiOutlineSparkles className="text-purple-600" /> Preferred / Bonus Skills
                  </h4>
                  <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full">
                    {data.jobStructuredText?.preferredSkills?.length || 0} total
                  </span>
                </div>

                <div className="space-y-2">
                  {data.jobStructuredText?.preferredSkills?.map((skill, i) => {
                    const isMatched = data.matchedSkills?.includes(skill);
                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all ${
                          isMatched
                            ? "bg-white border-emerald-200 text-slate-800"
                            : "bg-amber-50/60 border-amber-200 text-amber-900"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isMatched ? (
                            <FiCheckCircle className="text-emerald-500 text-sm shrink-0" />
                          ) : (
                            <FiAlertCircle className="text-amber-500 text-sm shrink-0" />
                          )}
                          {skill}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                            isMatched ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isMatched ? "Matched" : "Recommended"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: AI INSIGHTS */}
      {activeTab === "insights" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <HiOutlineSparkles className="text-(--primaryBlue)" /> AI-Generated Intelligence
                </h3>
                <p className="text-xs text-slate-500">
                  Targeted analysis based on resume and job description text parsing.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.insights?.map((item, idx) => {
                const isStrength = item.type === "strength";
                const isGap = item.type === "gap";

                return (
                  <div
                    key={idx}
                    className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 transition-all hover:shadow-md ${
                      isStrength
                        ? "bg-emerald-50/40 border-emerald-200"
                        : isGap
                        ? "bg-rose-50/40 border-rose-200"
                        : "bg-blue-50/40 border-blue-200"
                    }`}
                  >
                    <div className="space-y-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase ${
                          isStrength
                            ? "bg-emerald-100 text-emerald-700"
                            : isGap
                            ? "bg-rose-100 text-rose-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {isStrength && <FiCheckCircle />}
                        {isGap && <FiAlertCircle />}
                        {!isStrength && !isGap && <FiZap />}
                        {item.type}
                      </span>

                      <h4 className="font-bold text-slate-900 text-base">{item.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/50">
                      <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                        <FiInfo /> Action item available in Checklist
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: OPTIMIZATION CHECKLIST */}
      {activeTab === "checklist" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FiCheckSquare className="text-emerald-600" /> Resume Optimization Checklist
              </h3>
              <p className="text-xs text-slate-500">
                Check off items as you revise your resume to guarantee maximum ATS match score.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "item-1",
                  title: "Add Next.js Experience Bullet",
                  desc: "Mention any Next.js projects or Server Side Rendering experience under your skills/projects section.",
                  category: "Preferred Skill"
                },
                {
                  id: "item-2",
                  title: "Include Testing Framework Keywords",
                  desc: "Add Jest, React Testing Library, or Cypress keywords if you have practical testing experience.",
                  category: "Missing Skill"
                },
                {
                  id: "item-3",
                  title: "Explicitly List HTML & CSS",
                  desc: "Ensure foundational web keywords (HTML5, CSS3, Flexbox/Grid) are listed explicitly alongside Tailwind CSS.",
                  category: "Keyword Density"
                },
                {
                  id: "item-4",
                  title: "Quantify Experience Accomplishments",
                  desc: "Include metrics like 'improved performance by 25%' or 'built 10+ reusable components'.",
                  category: "Formatting & Impact"
                }
              ].map((task) => {
                const isChecked = !!checkedItems[task.id];
                return (
                  <div
                    key={task.id}
                    onClick={() => toggleCheck(task.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                      isChecked
                        ? "bg-emerald-50/50 border-emerald-200 opacity-75"
                        : "bg-slate-50/60 hover:bg-slate-50 border-slate-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-1 h-5 w-5 rounded border-slate-300 text-(--primaryBlue) focus:ring-(--primaryBlue) cursor-pointer"
                    />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-bold ${isChecked ? "line-through text-slate-500" : "text-slate-900"}`}>
                          {task.title}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                          {task.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{task.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export const tempModelData = {
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