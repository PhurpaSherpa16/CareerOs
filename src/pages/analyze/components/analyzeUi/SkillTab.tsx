import { FiAlertCircle, FiCheckCircle, FiTarget, FiXCircle } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';

export default function SkillTab({activeTab, data}:{activeTab:string, data: any}) {
  return (
    <div>
        {activeTab === "skills" && (
            <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900">Required &amp; Preferred Skill Alignment</h3>
                    <p className="text-xs text-slate-500">
                    Detailed side-by-side comparison of the job criteria against candidate qualifications.
                    </p>
                </div>
    
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Required Skills */}
                    <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <FiTarget className="text-(--primaryBlue)" /> Required Job Skills
                        </h4>
                        <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full">
                        {data.jobStructuredText?.requiredSkills?.length || 0} total
                        </span>
                    </div>
    
                    <div className="space-y-2">
                        {data.jobStructuredText?.requiredSkills?.map((skill:any, i:any) => {
                        const isMatched = data.matchedSkills?.includes(skill);
                        return (
                            <div
                            key={i}
                            className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all ${
                                isMatched
                                ? "bg-white border-emerald-200 text-slate-800"
                                : "bg-rose-50/50 border-rose-200 text-rose-800"
                            }`}
                            >
                            <span className="flex items-center gap-2">
                                {isMatched ? (
                                <FiCheckCircle className="text-emerald-500 text-sm shrink-0" />
                                ) : (
                                <FiXCircle className="text-rose-500 text-sm shrink-0" />
                                )}
                                {skill}
                            </span>
                            <span
                                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                                isMatched ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                                }`}
                            >
                                {isMatched ? "Matched" : "Missing"}
                            </span>
                            </div>
                        );
                        })}
                    </div>
                    </div>
    
                    {/* Preferred Skills */}
                    <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <HiOutlineSparkles className="text-purple-600" /> Preferred / Bonus Skills
                        </h4>
                        <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full">
                        {data.jobStructuredText?.preferredSkills?.length || 0} total
                        </span>
                    </div>
    
                    <div className="space-y-2">
                        {data.missingKeywords?.map((skill:any, i:any) => {
                        const isMatched = data.matchedSkills?.includes(skill);
                        return (
                            <div
                            key={i}
                            className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all ${
                                isMatched
                                ? "bg-white border-emerald-200 text-slate-800"
                                : "bg-amber-50/60 border-amber-200 text-amber-900"
                            }`}
                            >
                            <span className="flex items-center gap-2">
                                {isMatched ? (
                                <FiCheckCircle className="text-emerald-500 text-sm shrink-0" />
                                ) : (
                                <FiAlertCircle className="text-amber-500 text-sm shrink-0" />
                                )}
                                {skill}
                            </span>
                            <span
                                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                                isMatched ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
                                }`}
                            >
                                {isMatched ? "Matched" : "Recommended"}
                            </span>
                            </div>
                        );
                        })}
                    </div>
                    </div>
                </div>
                </div>
            </div>
            )}
    </div>
  )
}
