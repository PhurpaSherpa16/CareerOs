import { FiCheckCircle, FiAlertTriangle, FiZap, FiArrowRight } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

interface Insight {
  type: string;
  title: string;
  description: string;
}

interface QuickInsightCardsProps {
  insights?: Insight[];
  onViewDetails?: () => void;
}

export default function QuickInsightCards({ insights, onViewDetails }: QuickInsightCardsProps) {
  // Fallback default insights if none passed
  const displayInsights = insights && insights.length > 0 ? insights : [
    {
      type: "strength",
      title: "Strong Frontend Core",
      description: "React, TypeScript and REST API experience directly match the key responsibilities."
    },
    {
      type: "gap",
      title: "Missing Preferred Tech",
      description: "Next.js and automated testing (Jest/RTL) are not explicitly demonstrated in your resume."
    },
    {
      type: "recommendation",
      title: "Keyword Optimization",
      description: "Add HTML, CSS, and Next.js project bullet points to push your score above 90%."
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HiOutlineSparkles className="text-(--primaryBlue) text-xl" />
          <h3 className="font-bold text-slate-900 text-lg">AI Quick Insights</h3>
        </div>

        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="text-xs font-semibold text-(--primaryBlue) hover:underline flex items-center gap-1 cursor-pointer"
          >
            Full Analysis <FiArrowRight />
          </button>
        )}
      </div>

      {/* 3 Flex Box Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {displayInsights.map((item, idx) => {
          const isStrength = item.type === "strength";
          const isGap = item.type === "gap";

          return (
            <div key={idx} className={`p-5 rounded-3xl border shadow-sm flex flex-col justify-between space-y-3 transition-all hover:shadow-md ${
                isStrength
                  ? "bg-emerald-50/50 border-emerald-200"
                  : isGap
                  ? "bg-rose-50/50 border-rose-200"
                  : "bg-indigo-50/50 border-indigo-200"
              }`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isStrength
                        ? "bg-emerald-100 text-emerald-800"
                        : isGap
                        ? "bg-rose-100 text-rose-800"
                        : "bg-indigo-100 text-indigo-800"
                    }`}>
                    {isStrength && <FiCheckCircle className="text-emerald-600" />}
                    {isGap && <FiAlertTriangle className="text-rose-600" />}
                    {!isStrength && !isGap && <FiZap className="text-indigo-600" />}
                    {item.type}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                      {isStrength ? "Top Advantage" : isGap ? "Required Fix" : "Action Tip"}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm leading-snug">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
