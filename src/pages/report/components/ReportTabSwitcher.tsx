import { FiCheckSquare, FiTarget, FiZap } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { FaWandMagicSparkles } from 'react-icons/fa6';

export type ReportTabType = 'overview' | 'skills' | 'insights' | 'checklist' | 'coverLetter';

interface ReportTabSwitcherProps {
  activeTab: ReportTabType;
  setActiveTab: (tab: ReportTabType) => void;
  matchedCount: number;
  missingCount: number;
  insightsCount: number;
}

export default function ReportTabSwitcher({
  activeTab,
  setActiveTab,
  matchedCount,
  missingCount,
  insightsCount,
}: ReportTabSwitcherProps) {
  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: FiTarget },
    {
      id: 'skills' as const,
      label: 'Skills Matrix',
      icon: FiZap,
      badge: `${matchedCount}/${matchedCount + missingCount}`,
    },
    {
      id: 'insights' as const,
      label: 'AI Insights',
      icon: HiOutlineSparkles,
      badge: insightsCount ? String(insightsCount) : undefined,
    },
    { id: 'checklist' as const, label: 'Optimization Checklist', icon: FiCheckSquare },
    {
      id: 'coverLetter' as const,
      label: 'AI Cover Letter',
      icon: FaWandMagicSparkles,
      badge: 'AI',
    },
  ];

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-t-xl sm:rounded-t-2xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap 
              cursor-pointer border-b-3 -mb-px ${
              isActive
                ? 'border-(--primaryBlue) text-(--primaryBlue) bg-indigo-100/60 shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Icon className={isActive ? 'text-(--primaryBlue)' : 'text-slate-400'} />
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={`px-2 py-0.5 text-[10px] sm:text-xs rounded-full font-bold ${
                  isActive
                    ? 'bg-(--primaryBlue) text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
