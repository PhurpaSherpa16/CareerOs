import { useState } from "react";
import { FaGraduationCap } from "react-icons/fa";
import { FiBriefcase, FiZap, FiTarget, FiBarChart2 } from "react-icons/fi";
import { GoProjectRoadmap } from "react-icons/go";

interface MatchMetricsProps {
  expMatch?: number;
  skillsMatch?: number;
  eduMatch?: number;
  atsScore?: number;
  projMatch?: number;
  selectedMetric?: string | null;
  onSelectMetric?: (metric: string | null) => void;
}

export default function MatchMetricsBarGraph({
  expMatch = 85,
  skillsMatch = 75,
  eduMatch = 90,
  atsScore = 82,
  projMatch = 95,
  selectedMetric: controlledSelected,
  onSelectMetric,
}: MatchMetricsProps) {
  const [internalSelected, setInternalSelected] = useState<string | null>(null);

  const selectedMetric = controlledSelected !== undefined ? controlledSelected : internalSelected;

  const handleSelect = (label: string) => {
    const next = selectedMetric === label ? null : label;
    if (onSelectMetric) {
      onSelectMetric(next);
    } else {
      setInternalSelected(next);
    }
  };

  const handleReset = () => {
    if (onSelectMetric) {
      onSelectMetric(null);
    } else {
      setInternalSelected(null);
    }
  };

  const metrics = [
    {
      label: "ATS Score",
      value: atsScore,
      icon: FiTarget,
      gradient: "from-blue-600 to-indigo-500",
    },
    {
      label: "Experience",
      value: expMatch,
      icon: FiBriefcase,
      gradient: "from-emerald-600 to-teal-500",
    },
    {
      label: "Skills",
      value: skillsMatch,
      icon: FiZap,
      gradient: "from-purple-600 to-indigo-500",
    },
    {
      label: "Projects",
      value: projMatch,
      icon: GoProjectRoadmap,
      gradient: "from-amber-600 to-orange-500",
    },
    {
      label: "Education",
      value: eduMatch,
      icon: FaGraduationCap,
      gradient: "from-cyan-600 to-blue-500",
    },
  ];

  // Identify highest metric for summary footer
  const highestMetric = [...metrics].sort((a, b) => b.value - a.value)[0];
  const isAnySelected = Boolean(selectedMetric);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl shadow-slate-100/50 h-full min-h-[380px] flex flex-col justify-between space-y-4">
      {/* Header Section */}
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

        {selectedMetric && (
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] font-bold text-(--primaryBlue) bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer border border-blue-200"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Vertical Bar Chart Container */}
      <div className="flex-1 flex flex-col justify-end py-2 min-h-56">
        <div className="w-full overflow-x-auto overflow-y-hidden pb-1">
          <div className="flex items-end justify-between sm:justify-around gap-2 sm:gap-4 h-52 px-1 pt-6 pb-1 min-w-70">
            {metrics.map((item) => {
              const heightPercent = Math.max(Math.min(item.value, 100), 12);
              const isSelected = selectedMetric?.toLowerCase() === item.label.toLowerCase();

              return (
                <div key={item.label} onClick={() => handleSelect(item.label)}
                  className={`flex-1 flex flex-col items-center h-full justify-end group cursor-pointer transition-all duration-300 ${
                    isAnySelected && !isSelected ? "opacity-45 hover:opacity-80" : "opacity-100"
                  }`} title={`${item.label}: ${item.value}% match`}>
                  {/* Score Percentage Badge above Bar */}
                  <div
                    className={`text-[10px] sm:text-[11px] font-extrabold mb-1.5 px-1.5 py-0.5 rounded transition-transform group-hover:-translate-y-0.5 ${
                      isSelected
                        ? "bg-slate-900 text-white shadow-2xs scale-105"
                        : "bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-(--primaryBlue)"
                    }`}
                  >
                    {item.value}%
                  </div>

                  {/* Vertical Bar Track & Animated Fill */}
                  <div className="w-full max-w-9 sm:max-w-10 bg-slate-100/90 rounded-t-xl overflow-hidden flex items-end h-full border border-slate-200/50">
                    <div
                      className={`w-full rounded-t-xl bg-linear-to-t ${item.gradient} transition-all duration-500 ease-out group-hover:brightness-110 ${
                        isSelected
                          ? "ring-2 ring-(--primaryBlue) ring-offset-1 font-bold brightness-105"
                          : "opacity-90 group-hover:opacity-100"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  {/* Icon & Label Below Bar */}
                  <div className="flex flex-col items-center gap-1 mt-2.5 shrink-0">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-(--primaryBlue) shadow-xs ring-2 ring-(--primaryBlue)/30 text-(--primaryBlue) bg-blue-50/50"
                          : "border-slate-200 text-slate-500 group-hover:border-slate-300 group-hover:text-(--primaryBlue)"
                      }`}
                    >
                      <item.icon className="text-xs sm:text-sm" />
                    </div>
                    <span
                      className={`text-[10px] sm:text-[11px] font-semibold text-center truncate max-w-14 sm:max-w-16 transition-colors ${
                        isSelected
                          ? "text-(--primaryBlue) font-bold"
                          : "text-slate-600 group-hover:text-slate-900"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Summary Info */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-500 font-medium">
        <span>
          Highest: <strong className="text-slate-800 font-bold">{highestMetric.label}</strong> ({highestMetric.value}%)
        </span>
        <span className="text-slate-400">Click bar to highlight</span>
      </div>
    </div>
  );
}

