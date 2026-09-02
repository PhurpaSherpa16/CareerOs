import { FaInfoCircle } from 'react-icons/fa';
import { FiAlertCircle, FiCheckCircle, FiZap } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';

export default function AIinsightTab({activeTab, data}: any) {
  return (
    <div>
        {activeTab === "insights" && (
            <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <HiOutlineSparkles className="text-(--primaryBlue)" /> AI-Generated Intelligence
                    </h3>
                    <p className="text-xs text-slate-500">
                        Targeted analysis based on resume and job description text parsing.
                    </p>
                    </div>
                </div>
    
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.insights?.map((item:any, idx:any) => {
                    const isStrength = item.type === "strength";
                    const isGap = item.type === "gap";
    
                    return (
                        <div
                        key={idx}
                        className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 transition-all hover:shadow-md ${
                            isStrength
                            ? "bg-emerald-50/40 border-emerald-200"
                            : isGap
                            ? "bg-rose-50/40 border-rose-200"
                            : "bg-blue-50/40 border-blue-200"
                        }`}
                        >
                        <div className="space-y-2">
                            <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase ${
                                isStrength
                                ? "bg-emerald-100 text-emerald-700"
                                : isGap
                                ? "bg-rose-100 text-rose-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                            >
                            {isStrength && <FiCheckCircle />}
                            {isGap && <FiAlertCircle />}
                            {!isStrength && !isGap && <FiZap />}
                            {item.type}
                            </span>
    
                            <h4 className="font-bold text-slate-900 text-base">{item.title}</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                        </div>
    
                        <div className="pt-2 border-t border-slate-200/50">
                            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                            <FaInfoCircle/> Action item available in Checklist
                            </span>
                        </div>
                        </div>
                    );
                    })}
                </div>
                </div>
            </div>
            )}
    </div>
  )
}
