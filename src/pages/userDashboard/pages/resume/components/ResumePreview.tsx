

export default function ResumePreview({tempData}: any) {
  return (
    <>
        {!tempData ? (
            <div className='h-full w-full flex items-center justify-center'>
                <p className="font-semibold text-slate-900 text-xs tracking-wider uppercase">Select Template to generate Resume</p>
            </div>
        ) :
        (
            <div className="space-y-5 font-sans text-slate-900 bg-white p-6 rounded-xl border border-slate-200">
                {/* Contact Header */}
                {tempData && (
                    <div className="border-b border-slate-200 pb-4">
                    <h4 className="font-bold text-slate-900 text-sm tracking-wide uppercase">
                        {tempData.name || 'Candidate Contact Details'}
                    </h4>
                    <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-slate-700 mt-1.5 font-medium">
                        {tempData.email && <span><strong className="font-semibold text-slate-900">Email:</strong> {tempData.email}</span>}
                        {tempData.phone && <span><strong className="font-semibold text-slate-900">Phone:</strong> {tempData.phone}</span>}
                        {tempData.github && <span><strong className="font-semibold text-slate-900">GitHub:</strong> {tempData.github}</span>}
                        {tempData.linkedin && <span><strong className="font-semibold text-slate-900">LinkedIn:</strong> {tempData.linkedin}</span>}
                    </div>
                    </div>
                )}

                {/* Summary Section */}
                {tempData.summary && (
                    <div className="space-y-1.5">
                    <h4 className="font-bold text-slate-900 text-xs tracking-wider uppercase border-b border-slate-100 pb-1">
                        Professional Summary
                    </h4>
                    <p className="text-xs text-slate-800 leading-relaxed font-normal">
                        {tempData.summary}
                    </p>
                    </div>
                )}

                {/* Skills Section */}
                {tempData.skills && (
                    <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-xs tracking-wider uppercase border-b border-slate-100 pb-1">
                        Skills & Technical Competencies
                    </h4>
                    <div className="flex flex-col space-y-4">
                        {Object.entries(tempData?.skills || {}).map(
                        ([category, skills]) => {
                            if (!Array.isArray(skills) || skills.length === 0) return null

                            return (
                            <div key={category} className='space-y-2'>
                                <h5 className="font-semibold text-slate-900 text-xs tracking-wider uppercase">
                                {category.replace(/([A-Z])/g, ' $1')}
                                </h5>

                                <div className="flex flex-wrap gap-2">
                                {skills.map((skill: string, idx: number) => (
                                    <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-900 border border-slate-200 rounded text-xs font-light">
                                    {skill}
                                    </span>
                                ))}
                                </div>
                            </div>
                            )
                        })}
                    </div>
                    </div>
                )}

                {/* Projects Section */}
                {tempData.projects && Array.isArray(tempData.projects) && tempData.projects.length > 0 && (
                    <div className="space-y-2.5">
                    <h4 className="font-semibold text-slate-900 text-xs tracking-wider uppercase border-b border-slate-100 pb-1">
                        Featured Projects
                    </h4>
                    <div className="space-y-2">
                        {tempData.projects.map((proj: any, idx: number) => (
                        <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
                            <div className="flex justify-between items-center">
                            <h5 className="font-semibold text-slate-900 text-xs">{proj.name}</h5>
                            {proj.link && (
                                <span className="text-[11px] font-mono font-semibold text-(--primaryBlue)">
                                {proj.link}
                                </span>
                            )}
                            </div>
                            {proj.description && (
                            <p className="text-xs text-slate-800 leading-normal">{proj.description}</p>
                            )}
                        </div>
                        ))}
                    </div>
                    </div>
                )}
            </div>
        )}
    </>
  )
}
