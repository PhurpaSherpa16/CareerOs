import { FaGraduationCap } from "react-icons/fa";
import { FiBriefcase, FiZap, FiTarget, FiBarChart2 } from "react-icons/fi";
import { GoProjectRoadmap } from "react-icons/go";

interface MatchMetricsProps {
  expMatch?: number;
  skillsMatch?: number;
  eduMatch?: number;
  atsScore?: number;
  projMatch?: number;
}

export default function MatchMetricsBarGraph({
  expMatch = 85,
  skillsMatch = 75,
  eduMatch = 90,
  atsScore = 82,
  projMatch = 95,
}: MatchMetricsProps) {
  const metrics = [
    {
      label: "ATS Score",
      value: atsScore,
      icon: FiTarget,
      color: "bg-(--primaryBlue)",
      bgLight: "text-(--primaryBlue)"
    },
    {
      label: "Experience",
      value: expMatch,
      icon: FiBriefcase,
      color: "bg-(--primaryBlue)",
      bgLight: "text-(--primaryBlue) "
    },
    {
      label: "Skills",
      value: skillsMatch,
      icon: FiZap,
      color: "bg-(--primaryBlue)",
      bgLight: "text-(--primaryBlue)"
    },
    {
      label: "Projects",
      value: projMatch,
      icon: GoProjectRoadmap,
      color: "bg-(--primaryBlue)",
      bgLight: "text-(--primaryBlue)"
    },
    {
      label: "Education",
      value: eduMatch,
      icon: FaGraduationCap,
      color: "bg-(--primaryBlue)",
      bgLight: "text-(--primaryBlue)"
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
              </div>

              {/* Horizontal Bar Track */}
              <div className="flex items-center justify-center gap-2">
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${item.value}%` }}/>
                </div>
                <span className={`font-bold text-sm ${item.bgLight}`}>
                  {item.value}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
