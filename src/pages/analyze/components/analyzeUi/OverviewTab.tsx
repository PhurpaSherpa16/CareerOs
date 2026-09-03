import React from 'react';
import { FiCheck, FiCheckCircle, FiX } from 'react-icons/fi';
import MatchMetricsBarGraph from './MatchMetricsBarGraph';
import QuickInsightCards from './QuickInsightCards';
import { IoIosTime } from "react-icons/io";
import { GrAlert } from "react-icons/gr";

// Full circle outline pie chart with score in center
const FullOutlinePieChart = ({ value = 82 }: { value: number }) => {
  const radius = 20;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius; // ~125.66
  const safeValue = Math.min(100, Math.max(0, value));
  const strokeDashoffset = circumference - (safeValue / 100) * circumference;

  return (
    <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 56 56" className="transform -rotate-90">
        <defs>
          <linearGradient id="fullPieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="url(#fullPieGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-extrabold text-slate-800 tracking-tight">{value}</span>
      </div>
    </div>
  );
};

// Half circle outline pie chart with percentage inside/under arc
const HalfOutlinePieChart = ({ value = 75 }: { value: number }) => {
  const radius = 20;
  const strokeWidth = 4;
  const arcLength = Math.PI * radius; // ~62.83
  const safeValue = Math.min(100, Math.max(0, value));
  const strokeDashoffset = arcLength - (safeValue / 100) * arcLength;

  return (
    <div className="relative w-20 h-20 shrink-0 flex flex-col items-center justify-center">
      <svg width="120" height="60" viewBox="0 0 52 30" className="relative overflow-visible">
        <defs>
          <linearGradient id="halfPieGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <path
          d="M 6 26 A 20 20 0 0 1 46 26"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path
          d="M 6 26 A 20 20 0 0 1 46 26"
          fill="none"
          stroke="url(#halfPieGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute top-10 text-center">
        <span className="text-xl font-extrabold text-slate-800 tracking-tight">{value}%</span>
      </div>
    </div>
  );
};


export default function OverviewTab({
  activeTab,
  score,
  fit,
  data,
  setActiveTab,
  matchedCount,
  missingCount,
  matchPercentage=0,
  totalSkillCount
}: any) {
  return (
    <div>
      {activeTab === "overview" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Row: 4 Quick Scan Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-stretch">
            {/* Card 1: ATS Style Score (Full outline pie chart with 82 in center) */}
            <QuickCard>
              <div className="flex items-center gap-3 w-full">
                <FullOutlinePieChart value={score} />
                <div className="flex flex-col min-w-0 justify-center">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">
                    ATS Style Score
                  </span>
                  <div className="flex items-center gap-1.5 my-0.5">
                    <span className="font-bold">
                      Good Match
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 truncate">
                    Top 15% of candidates
                  </span>
                </div>
              </div>
            </QuickCard>

            {/* Card 2: Job Match (Half outline pie chart with matchPercentage) */}
            <QuickCard>
              <div className="flex items-center gap-8 w-full">
                <HalfOutlinePieChart value={matchPercentage} />
                <div className="flex flex-col min-w-0 justify-center">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">
                    Job Match
                  </span>
                  <div className="flex items-center gap-1.5 my-0.5">
                    <span className="font-bold">
                      {fit || 'Good Fit'}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 truncate">
                    Strong title match
                  </span>
                </div>
              </div>
            </QuickCard>

            {/* Card 3: Matched Skills */}
            <QuickCard>
              <div className="flex flex-col justify-between w-full h-full py-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Matched Skills
                  </span>
                </div>

                <div>
                    <span className="font-extrabold text-xl">
                        {matchedCount}/{totalSkillCount || (matchedCount + missingCount)}
                    </span>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 my-1.5 overflow-hidden">
                    <div
                        className="bg-linear-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(0, matchPercentage))}%` }}/>
                    </div>
                </div>

                <span className="text-[11px] font-medium text-slate-400">
                  {matchPercentage}% of critical keywords
                </span>
              </div>
            </QuickCard>

            {/* Card 4: Experience Match */}
            <QuickCard>
              <div className="flex flex-col justify-center space-y-2 w-full h-full py-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Experience Match
                  </span>
                </div>
                <div>
                    <span className="font-bold text-xl">
                        {data?.experienceMatch?.matchPercentage !== undefined && data?.experienceMatch?.matchPercentage !== null
                          ? `${data.experienceMatch.matchPercentage}%`
                          : (data?.experience?.score ? `${data.experience.score}%` : '75%')}
                    </span>
                    <div className="flex items-center gap-1.5 my-1">
                    <div className="p-1 rounded bg-emerald-100/70 text-emerald-700">
                        <IoIosTime className="text-xs" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                        {data?.experienceMatch?.experience?.value
                          ? `${data.experienceMatch.experience.value}+ ${data.experienceMatch.experience.timeType === 'month' ? 'Months' : 'Years'} Experience`
                          : '4+ Years Experience'}
                    </span>
                    </div>
                </div>

              </div>
            </QuickCard>
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
                  <span className="text-xs font-semibold text-emerald-600">
                    {matchedCount} Matched
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {data?.matchedSkills?.map((skill: any, idx: any) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60">
                      <FiCheck className="text-emerald-500 text-xs" /> {skill}
                    </span>
                  ))}
                  {data?.result?.gaps?.map((skill: any, idx: any) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 text-yellow-600 text-xs font-semibold border border-orange-200/60" >
                        <GrAlert className="text-yellow-600 text-xs" /> {skill}
                    </span>
                  ))}
                  {data?.missingKeywords?.map((skill: any, idx: any) => (
                    <span key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200/60">
                      <FiX className="text-red-500 text-xs" /> {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-4">
                <div>
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 text-base"> Recommendations </h4>
                    <div className='space-y-1'>
                        <div className="flex items-center gap-1">
                            <FiCheck className="text-emerald-500 bg-emerald-100 p-0.5 rounded-full border border-emerald-200"/> <span className='text-xs'>Strong technical skills alignment </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <GrAlert className="text-yellow-600 bg-yellow-100 p-0.5 rounded-full border border-yellow-200"/> <span className='text-xs'>Consider adding keywords</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FiX className="text-red-500 bg-red-100 p-0.5 rounded-full border border-red-200"/> <span className='text-xs'>Lacks experience in specific skills</span>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-slate-500">
                  {matchedCount} out of {matchedCount + missingCount} target skills verified in candidate resume.
                </p>
              </div>
            </div>

            {/* Horizontal Bar Graph Section */}
            <MatchMetricsBarGraph
              expMatch={data?.experience?.score ?? 85}
              skillsMatch={data?.skills?.score ?? matchPercentage}
              eduMatch={data?.education?.score ?? 90}
              projMatch={data?.projects?.score ?? 95}
              atsScore={score}
            />
          </div>

          {/* Bottom Row: 3 Flex Box AI Quick Insight Cards */}
          <QuickInsightCards
            insights={data?.insights}
            onViewDetails={() => setActiveTab("insights")}
          />
        </div>
      )}
    </div>
  );
}

const QuickCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center w-full min-h-22">
      {children}
    </div>
  );
};

