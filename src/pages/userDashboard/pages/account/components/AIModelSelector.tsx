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
  isUpdating?: boolean;
  updatingModelId?: string | null;
}

export default function AIModelSelector({
  models,
  activeModelId,
  currentTier,
  onSelect,
  onUpgradeClick,
  isUpdating = false,
  updatingModelId = null,
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
      <div className="relative p-5 sm:p-6 space-y-5">
        {/* Blocker overlay when updating */}
        {isUpdating && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px] rounded-2xl flex flex-col items-center justify-center z-20 transition-all duration-200">
            <div className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200/90 rounded-xl shadow-lg shadow-slate-200/50 animate-fadeIn">
              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-semibold text-slate-700">
                Updating AI model preference...
              </span>
            </div>
          </div>
        )}

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
            const isCurrentlySelecting = isUpdating && model.id === updatingModelId;

            return (
              <button
                key={model.id}
                type="button"
                disabled={isUpdating || locked}
                onClick={() => {
                  if (locked) {
                    onUpgradeClick();
                  } else if (!isUpdating) {
                    onSelect(model);
                  }
                }}
                onMouseEnter={() => setHoveredId(model.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`
                  relative text-left p-4 rounded-xl border-2 transition-all duration-200 group
                  ${isUpdating ? "cursor-not-allowed" : "cursor-pointer"}
                  ${isActive
                    ? "border-indigo-500 bg-indigo-50/60 shadow-sm shadow-indigo-100"
                    : locked
                      ? "border-slate-200 bg-slate-50/50 opacity-70 hover:opacity-90"
                      : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm"
                  }
                `}
              >
                {/* Lock / Check / Loading badge */}
                <div className="absolute top-3 right-3">
                  {isCurrentlySelecting ? (
                    <div className="p-1 bg-indigo-100 rounded-lg">
                      <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : isActive ? (
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
