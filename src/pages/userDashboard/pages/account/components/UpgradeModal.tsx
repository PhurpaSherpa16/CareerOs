import { FiX, FiCheck, FiArrowUpRight } from "react-icons/fi";
import type { SubscriptionPlan } from "../account.types";

interface UpgradeModalProps {
  isOpen: boolean;
  plans: SubscriptionPlan[];
  onClose: () => void;
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

export default function UpgradeModal({
  isOpen,
  plans,
  onClose,
  onSelectPlan,
}: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal content */}
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 py-6 sm:px-8 bg-linear-to-r from-indigo-700 to-(--primaryBlue) text-white">
          <button type="button" onClick={onClose} className="absolute top-4 right-4 p-1.5 hover:bg-white/20 rounded-xl transition-colors cursor-pointer">
            <FiX className="w-5 h-5" />
          </button>

          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            Upgrade Your Plan
          </h2>
          <p className="text-sm text-white/70 mt-1">
            Unlock powerful AI models and advanced features
          </p>
        </div>

        {/* Plans grid */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`
                  relative flex flex-col p-5 rounded-2xl border-2 transition-all duration-200
                  ${plan.highlighted
                    ? "border-indigo-500 bg-indigo-50/40 shadow-md shadow-indigo-100 scale-[1.02]"
                    : "border-slate-200 bg-white hover:border-slate-300"
                  }
                `}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider whitespace-nowrap shadow-sm">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-4 flex-1">
                  {/* Plan name */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-2xl font-extrabold text-slate-900">
                        {plan.price}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <FiCheck
                          className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            plan.highlighted ? "text-indigo-500" : "text-emerald-500"
                          }`}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <button
                  type="button"
                  onClick={() => onSelectPlan(plan)}
                  className={`
                    mt-5 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-95
                    ${plan.highlighted
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                      : plan.tier === "free"
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-600"
                        : "bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                    }
                  `}
                >
                  {plan.tier === "free" ? "Current Plan" : (
                    <>
                      Upgrade <FiArrowUpRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <p className="text-center text-[11px] text-slate-400 mt-6">
            You can cancel or change your plan at any time. No hidden fees.
          </p>
        </div>
      </div>
    </div>
  );
}
