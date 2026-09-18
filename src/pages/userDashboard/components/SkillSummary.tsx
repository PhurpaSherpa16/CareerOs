/**
 * METRIC & BACKEND DATA STRUCTURE NOTE:
 * =====================================
 * This component processes skills from `resumes[0].skills` (from mock data or API response)
 * and segregates them into 3 distinct individual domain categories:
 *   1. Frontend Skills
 *   2. Backend & Database Skills
 *   3. Tools & Soft Skills (Others)
 * 
 * Each category calculates an average score and renders an INDIVIDUAL Pie / Donut Chart (3 total).
 * Individual skill metrics are deterministically generated (> 50%) for demonstration,
 * ready to be replaced with real backend API metrics.
 * 
 * Expected Backend API Schema:
 * [
 *   {
 *     id: "cat-001",
 *     category: "Frontend",
 *     overallScore: 88,
 *     skills: [
 *       { name: "React", score: 94 },
 *       { name: "JavaScript", score: 96 },
 *       { name: "TypeScript", score: 88 },
 *       { name: "Next.js", score: 82 },
 *       { name: "Tailwind CSS", score: 86 }
 *     ]
 *   },
 *   ...
 * ]
 */

import { useState } from 'react';
import { Card } from '../../../components/Card.UserDashboard';
import Icons from '../../../utils/Icons';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FiChevronRight, FiSearch, FiX, FiLayers } from 'react-icons/fi';

interface SkillItem {
  id?: string;
  title: string;
  match: number;
}

interface ResumeData {
  id?: string;
  title?: string;
  skills?: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    tools?: string[];
    softSkills?: string[];
  };
}

interface SkillSummaryProps {
  skillData?: SkillItem[];
  resumeData?: ResumeData;
}

// Deterministic score generator (>50%) based on skill string name for stable display
const getSkillMetric = (skillName: string): number => {
  let hash = 0;
  for (let i = 0; i < skillName.length; i++) {
    hash = skillName.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Returns a score between 65% and 98% (always > 50%)
  return 65 + (Math.abs(hash) % 34);
};

// Sub-component for rendering an individual Pie / Donut Chart for a single category
function IndividualPieChart({ score, color }: { score: number; color: string }) {
  const chartData = [
    { name: 'Score', value: score, fill: color },
    { name: 'Remaining', value: Math.max(0, 100 - score), fill: '#E2E8F0' },
  ];

  return (
    <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={28}
            outerRadius={38}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <span className="absolute text-xs font-extrabold text-slate-800">{score}%</span>
    </div>
  );
}

export default function SkillSummary({ resumeData }: SkillSummaryProps) {
  const [isHelperOpen, setIsHelperOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'frontend' | 'backend' | 'tools'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract skills from resume[0] data
  const rawSkills = resumeData?.skills || {
    frontend: ['React', 'JavaScript', 'TypeScript', 'Next.js', 'Tailwind CSS', 'HTML', 'CSS'],
    backend: ['Node.js', 'Express.js', 'REST API', 'Supabase', 'Prisma'],
    database: ['PostgreSQL', 'Supabase'],
    tools: ['Git', 'GitHub', 'Figma', 'Vercel', 'Netlify'],
    softSkills: ['Communication', 'Problem Solving', 'Teamwork', 'Leadership'],
  };

  // Segregate into 3 distinct skill domain categories
  // Category 1: Frontend
  const frontendList = (rawSkills.frontend || []).map((name) => ({
    name,
    score: getSkillMetric(name),
    category: 'frontend',
  }));

  // Category 2: Backend & Database
  const backendList = [
    ...(rawSkills.backend || []),
    ...(rawSkills.database || []),
  ].map((name) => ({
    name,
    score: getSkillMetric(name),
    category: 'backend',
  }));

  // Category 3: Tools & Soft Skills (Others)
  const othersList = [
    ...(rawSkills.tools || []),
    ...(rawSkills.softSkills || []),
  ].map((name) => ({
    name,
    score: getSkillMetric(name),
    category: 'tools',
  }));

  // Calculate average category scores for the 3 pie charts
  const calcAvg = (items: { score: number }[]) =>
    items.length > 0 ? Math.round(items.reduce((acc, curr) => acc + curr.score, 0) / items.length) : 0;

  const frontendAvg = calcAvg(frontendList);
  const backendAvg = calcAvg(backendList);
  const othersAvg = calcAvg(othersList);

  const categoryCards = [
    {
      id: 'frontend',
      title: 'Frontend Skills',
      avg: frontendAvg,
      color: '#3A3AE7', // primaryBlue
      bgColor: 'bg-blue-50/60',
      borderColor: 'border-blue-100',
      iconLogo: 'react',
      skills: frontendList,
    },
    {
      id: 'backend',
      title: 'Backend & Database',
      avg: backendAvg,
      color: '#048734', // green
      bgColor: 'bg-emerald-50/60',
      borderColor: 'border-emerald-100',
      iconLogo: 'nodejs',
      skills: backendList,
    },
    {
      id: 'tools',
      title: 'Tools & Soft Skills',
      avg: othersAvg,
      color: '#6363F9', // purple
      bgColor: 'bg-purple-50/60',
      borderColor: 'border-purple-100',
      iconLogo: 'git',
      skills: othersList,
    },
  ];

  // Combined list for helper inspector
  const allSkillsList = [...frontendList, ...backendList, ...othersList];

  const filteredSkills = allSkillsList.filter((item) => {
    const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Card>
      <div className="px-6 py-6 min-h-80 max-h-80 2xl:min-h-100 2xl:max-h-100 flex flex-col justify-between overflow-hidden">
        {/* Card Header */}
        <div className="border-b border-slate-200 pb-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FiLayers className="w-4 h-4 text-(--primaryBlue)" />
            <h3 className="text-sm font-semibold text-slate-800">Skill Summary & Domain Analysis</h3>
          </div>

          <button
            type="button"
            onClick={() => setIsHelperOpen(true)}
            className="text-xs font-semibold text-(--primaryBlue) hover:underline flex items-center gap-1 cursor-pointer"
          >
            Explore All Items ({allSkillsList.length})
            <FiChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Individual Pie Chart Domain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-auto">
          {categoryCards.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setActiveFilter(cat.id as any);
                setIsHelperOpen(true);
              }}
              className={`p-3 rounded-xl border ${cat.borderColor} ${cat.bgColor} flex flex-col items-center justify-between text-center cursor-pointer hover:shadow-xs transition-all hover:scale-[1.01]`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Icons logo={cat.iconLogo} size="xs" />
                <h4 className="text-xs font-bold text-slate-800 truncate">{cat.title}</h4>
              </div>

              {/* Individual Pie Chart for this category */}
              <IndividualPieChart score={cat.avg} color={cat.color} />

              <span className="text-[11px] font-medium text-slate-500 mt-1">
                {cat.skills.length} skills analyzed
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Quick Helper Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 shrink-0">
          <span className="truncate">Top matched skills from Resume #1</span>
          <button type="button" onClick={() => setIsHelperOpen(true)}
            className="text-[11px] font-semibold text-(--primaryBlue) hover:underline">
            View Items Helper →
          </button>
        </div>
      </div>

      {/* Interactive Skill Items Helper Modal / Inspector */}
      {isHelperOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <FiLayers className="w-5 h-5 text-(--primaryBlue)" />
                  Skill Items & Proficiency Inspector
                </h3>
                <p className="text-xs text-slate-500">
                  Segregated metrics from candidate resume skills
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsHelperOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    activeFilter === 'all'
                      ? 'bg-white text-(--primaryBlue) shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({allSkillsList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('frontend')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    activeFilter === 'frontend'
                      ? 'bg-white text-(--primaryBlue) shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Frontend ({frontendList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('backend')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    activeFilter === 'backend'
                      ? 'bg-white text-(--primaryBlue) shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Backend ({backendList.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('tools')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    activeFilter === 'tools'
                      ? 'bg-white text-(--primaryBlue) shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tools & Others ({othersList.length})
                </button>
              </div>

              {/* Search input */}
              <div className="relative shrink-0">
                <FiSearch className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-(--primaryBlue) w-40 sm:w-48"
                />
              </div>
            </div>

            {/* Skill Items List */}
            <div className="p-6 overflow-y-auto flex-1 space-y-3">
              {filteredSkills.map((skill, index) => {
                const score = skill.score;
                let barColor = 'bg-(--primaryBlue)';
                let badgeBg = 'bg-blue-50 text-(--primaryBlue)';

                if (score >= 90) {
                  barColor = 'bg-(--green)';
                  badgeBg = 'bg-emerald-50 text-emerald-700';
                } else if (score >= 80) {
                  barColor = 'bg-(--primaryBlue)';
                  badgeBg = 'bg-blue-50 text-(--primaryBlue)';
                } else if (score >= 70) {
                  barColor = 'bg-(--yellow)';
                  badgeBg = 'bg-amber-50 text-amber-700';
                }

                return (
                  <div
                    key={skill.name + index}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        <Icons logo={skill.name} size="sm" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{skill.name}</h4>
                        <span className="text-[10px] text-slate-400 capitalize">
                          {skill.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-44">
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barColor}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${badgeBg}`}>
                        {score}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
