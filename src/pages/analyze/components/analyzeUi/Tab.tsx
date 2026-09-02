import { FiCheckSquare, FiTarget, FiZap } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';

export default function Tab({
    activeTab,
    setActiveTab,
    matchedCount,
    missingCount,
    data
}: {
    activeTab: string,
    setActiveTab: (tab: "overview" | "skills" | "insights" | "checklist") => void,
    matchedCount: number,
    missingCount: number,
    data: any
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
            { id: "overview", label: "Overview", icon: FiTarget },
            { id: "skills", label: "Skills Matrix", icon: FiZap, badge: `${matchedCount}/${matchedCount + missingCount}` },
            { id: "insights", label: "AI Insights", icon: HiOutlineSparkles, badge: data.insights?.length },
            { id: "checklist", label: "Optimization Checklist", icon: FiCheckSquare }
        ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl font-semibold text-sm transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                isActive
                    ? "border-(--primaryBlue) text-(--primaryBlue) bg-indigo-50/50"
                    : "border-transparent text-(--secondaryBlack) hover:text-(--primaryBlack) hover:bg-slate-50"
                }`}>
                <Icon className={isActive ? "text-(--primaryBlue)" : "text-slate-400"} />
                <span>{tab.label}</span>
                {tab.badge && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${isActive ? "bg-(--primaryBlue) text-white" : "bg-slate-200 text-slate-600"}`}>
                    {tab.badge}
                </span>
                )}
            </button>
            );
        })}
    </div>
  )
}

