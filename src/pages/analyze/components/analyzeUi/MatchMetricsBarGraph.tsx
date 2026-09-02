import React from "react";
import { FiBriefcase, FiZap, FiBookOpen, FiTarget, FiBarChart2 } from "react-icons/fi";

interface MatchMetricsProps {
  expMatch?: number;
  skillsMatch?: number;
  eduMatch?: number;
  atsScore?: number;
}

export default function MatchMetricsBarGraph({
  expMatch = 85,
  skillsMatch = 75,
  eduMatch = 90,
  atsScore = 82
}: MatchMetricsProps) {
  const metrics = [
    {
      label: "Experience Match",
      value: expMatch,
      icon: FiBriefcase,
      color: "bg-emerald-500",
      bgLight: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
      label: "Skills Matched",
      value: skillsMatch,
      icon: FiZap,
      color: "bg-indigo-500",
      bgLight: "bg-indigo-50 text-indigo-700 border-indigo-200"
    },
    {
      label: "Education Match",
      value: eduMatch,
      icon: FiBookOpen,
      color: "bg-blue-500",
      bgLight: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      label: "ATS Score",
      value: atsScore,
      icon: FiTarget,
      color: "bg-purple-500",
      bgLight: "bg-purple-50 text-purple-700 border-purple-200"
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl shadow-slate-100/50 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-(--primaryBlue) rounded-xl">
            <FiBarChart2 className="text-lg" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Match Breakdown</h3>
            <p className="text-xs text-slate-400">Sectional Compatibility Frequencies</p>
          </div>
        </div>

        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
          Horizontal Metrics
        </span>
      </div>

      <div className="space-y-4">
        {metrics.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-slate-700">
                  <Icon className="text-slate-500 text-sm" />
                  {item.label}
                </span>
                <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] border ${item.bgLight}`}>
                  {item.value}%
                </span>
              </div>

              {/* Horizontal Bar Track */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
