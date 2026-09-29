import { useState } from "react";
import { FiCheck, FiLock, FiArrowUpRight } from "react-icons/fi";
import { Card } from "../../../../../components/Card.UserDashboard";
import type { AIModel, PlanTier } from "../account.types";

interface AIModelSelectorProps {
  models: AIModel[];
  activeModelId: string;
  currentTier: PlanTier;
  onSelect: (model: AIModel) => void;
  onUpgradeClick: () => void;
}

export default function AIModelSelector({
  models,
  activeModelId,
  currentTier,
  onSelect,
  onUpgradeClick,
}: AIModelSelectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const tierRank: Record<PlanTier, number> = { free: 0, pro: 1, enterprise: 2 };
  const tierLabel: Record<PlanTier, string> = { free: "Free", pro: "Pro", enterprise: "Enterprise" };

  const isLocked = (model: AIModel) => tierRank[model.tier] > tierRank[currentTier];

  // Empty state
  if (!models || models.length === 0) {
    return (
      <Card>
        <div className="p-6 text-center space-y-2">
          <p className="text-sm text-slate-400">No AI models available at this time.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-5 sm:p-6 space-y-5">
        {/* Section header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">AI Model</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose the model that powers your resume analysis
            </p>
          </div>

          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-wider">
            {tierLabel[currentTier]} plan
          </span>
        </div>

        {/* Model grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {models.map((model) => {
            const locked = isLocked(model);
            const isActive = model.id === activeModelId;

            return (
              <button
                key={model.id}
                type="button"
                onClick={() => {
                  if (locked) {
                    onUpgradeClick();
                  } else {
                    onSelect(model);
                  }
                }}
                onMouseEnter={() => setHoveredId(model.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`
                  relative text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer group
                  ${isActive
                    ? "border-indigo-500 bg-indigo-50/60 shadow-sm shadow-indigo-100"
                    : locked
                      ? "border-slate-200 bg-slate-50/50 opacity-70 hover:opacity-90"
                      : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm"
                  }
                `}
              >
                {/* Lock / Check badge */}
                <div className="absolute top-3 right-3">
                  {isActive ? (
                    <div className="p-1 bg-indigo-500 rounded-lg">
                      <FiCheck className="w-3 h-3 text-white" />
                    </div>
                  ) : locked ? (
                    <div className="p-1 bg-slate-200 rounded-lg">
                      <FiLock className="w-3 h-3 text-slate-400" />
                    </div>
                  ) : null}
                </div>

                {/* Content */}
                <div className="space-y-2 pr-8">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{model.icon}</span>
                    <h4 className="text-sm font-bold text-slate-800">{model.name}</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {model.description}
                  </p>
                </div>

                {/* Tier badge */}
                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide
                      ${model.tier === "free"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : model.tier === "pro"
                          ? "bg-violet-50 text-violet-600 border border-violet-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }
                    `}
                  >
                    {tierLabel[model.tier]}
                  </span>

                  {locked && hoveredId === model.id && (
                    <span className="text-[10px] font-semibold text-indigo-500 flex items-center gap-0.5 animate-fadeIn">
                      Upgrade <FiArrowUpRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
