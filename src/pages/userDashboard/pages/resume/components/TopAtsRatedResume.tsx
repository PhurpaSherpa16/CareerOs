import { Card } from "../../../../../components/Card.UserDashboard";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FullOutlinePieChart } from "../../../../../components/ui/FillOutlinePieChart";
import Icons from "../../../../../utils/Icons";

type SkillCategories = Record<string, string[]>;

export default function TopAtsRatedResume({ data }: { data: any }) {
    const navigate = useNavigate();
    const [isTopMenuOpen, setIsTopMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [isSkillsCollapsed, setIsSkillsCollapsed] = useState(true);

    const categoryStyles = [
        {badgeColor: 'bg-blue-50 text-(--primaryBlue) border-blue-200',},
        {badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',},
        {badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',},
        {badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',},
        {badgeColor: 'bg-pink-50 text-pink-700 border-pink-200',},
    ];
    
    // Segregate top rated resume skills into domain categories matching SkillSummary
    const segregatedSkills = useMemo(() => {
        const skills: SkillCategories = data?.skills || {}
        return Object.entries(skills)
        .filter(([,values]) => Array.isArray(values) && values.length > 0)
        .map(([key, values], index) =>({
            id: key,
            title: key.replace(/([A-Z])/g, ' $1')
            .replace(/^./, (char) => char.toUpperCase()),
            skills: values,
            badgeColor:
                categoryStyles[index % categoryStyles.length].badgeColor,
        }))

    }, [data]);

    // Close 3-dot menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setIsTopMenuOpen(false);
        }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
  return (
    <section className="w-full">
        <Card>
            <div className="p-6 space-y-6">
                {/* Top Rated Badge Header & Three Dot Menu */}
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 border border-amber-500/20 font-bold text-xs px-3 py-1 rounded-full">
                        <Icons name="star" className="fill-amber-500 text-amber-500"/>
                        Top Rated Resume
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                        Highest ATS score resume in your portfolio
                        </span>
                    </div>

                    <div className="flex items-center gap-3 relative" ref={menuRef}>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mr-2">
                            <Icons name="calender"/>
                            <span>Added {data.date}</span>
                        </div>

                        {/* Three Dot Dropdown Button */}
                        <div className="relative" onMouseEnter={() => setIsTopMenuOpen(true)}>
                        <button type="button" onClick={() => setIsTopMenuOpen((prev) => !prev)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200/60"
                            title="Actions Menu">
                            <Icons name='menuVerticalDot'/>
                        </button>

                        {/* Dropdown Menu (Opens on click or hover) */}
                        {isTopMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-30 py-1.5 space-y-0.5 animate-in fade-in zoom-in-95">
                            <button type="button" onClick={() => {setIsTopMenuOpen(false)}}
                                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-(--primaryBlue) flex items-center gap-2 cursor-pointer">
                                <Icons name='view'/>
                                Quick Preview
                            </button>
                            <button type="button" onClick={() => { navigate('/user-dashboard/all-analysis'); setIsTopMenuOpen(false); }}
                                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-amber-600 flex items-center gap-2 cursor-pointer">
                                <Icons name='analyze' />
                                Analyze Resume
                            </button>
                            <a href="/resume.pdf" download={data.name || 'Resume.pdf'} onClick={() => setIsTopMenuOpen(false)}
                                className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 flex items-center gap-2 cursor-pointer">
                                <Icons name='download' />
                                Download Resume
                            </a>
                            </div>
                        )}
                        </div>
                    </div>
                </div>

                {/* Top Row: Left Content (Title, File, Summary with no bg) & Right Content (Standalone ATS Circle, no bg) */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    {/* Left Content */}
                    <div className="flex-1 space-y-2">
                        <div>
                        <h2 className="text-lg font-bold text-(--primaryBlue) flex items-center gap-2
                        ">
                            <Icons name="jobFill" className="size-5 text-(--primaryBlue)" />
                            {data.title}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                            <span>{data.name}</span>
                        </p>
                        </div>

                        {/* Summary directly below Title & File (No background) */}
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {data.summary}
                        </p>
                    </div>

                    {/* Right Content: Standalone Circle ATS Chart (No background container) */}
                    <div className="shrink-0 flex items-center justify-center self-center">
                        <FullOutlinePieChart value={data.atsScore || 91} total={100} label="ATS" />
                    </div>
                </div>

                {/* Full Width Domain Skills Breakdown (Collapsible) */}
                <div className="w-full space-y-2.5 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                            <Icons name='layers' className="text-(--primaryBlue)"/>
                            <span>Domain Skills Breakdown</span>
                        </div>

                        {/* Collapse / Expand Toggle Button */}
                        <button type="button" onClick={() => setIsSkillsCollapsed((prev) => !prev)} 
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-(--primaryBlue) transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-slate-100 border border-slate-200/60">
                            <span>
                                {isSkillsCollapsed ? 'Expand Details' : 'Collapse'}
                            </span>
                            {isSkillsCollapsed ? (
                                <Icons name='downn' />
                            ) : (
                                <Icons name='up' />
                            )}
                        </button>
                    </div>

                    {/* Collapsed View: Total skills per domain category */}
                    {isSkillsCollapsed ? (
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            {segregatedSkills.map((domain) => (
                                <div key={domain.id} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${domain.badgeColor}`}>
                                    <span>{domain.title}:</span>
                                    <span className="font-extrabold text-slate-900">{domain?.skills?.length} skills</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Open / Expanded View: Current 3-column grid layout with skill icons */
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                            {segregatedSkills.map((domain, idx) => (
                                <div key={idx} className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${domain.badgeColor}`}>
                                    {domain?.title}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-semibold">
                                    {domain?.skills?.length} skills
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-1.5 pt-0.5">
                                    {domain?.skills?.map((skill: string, idx: number) => (
                                    <span key={idx} className="inline-flex items-center gap-1.5 px-2 py-1 bg-white text-slate-800 text-[11px] font-semibold rounded-md border border-slate-200 shadow-2xs">
                                        <Icons logo={skill} size="xs" />
                                        <span>{skill}</span>
                                    </span>
                                    ))}
                                </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    </section>
  )
}
