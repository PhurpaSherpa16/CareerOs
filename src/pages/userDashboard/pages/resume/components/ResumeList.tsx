import { Card } from '../../../../../components/Card.UserDashboard';
import Icons from '../../../../../utils/Icons';
import { FiAward} from 'react-icons/fi';
import ResumePreview from './ResumePreview';
import { useNavigate } from 'react-router-dom';
import { dashboardMockData } from '../../../../../data/userDashboard.mock';
import { useMemo, useState } from 'react';
import AnalysisCard from '../../../../../components/ui/AnalysisCard';
import { formatDistanceToNow } from 'date-fns';
import JobSortDropdown from '../../job/components/JobSortDropdown';

export default function ResumeList() {
    const navigate = useNavigate();
    const resumesList: any[] = dashboardMockData.resumes || [];
    const [searchQuery, setSearchQuery] = useState('');
    const [activeResumeId, setActiveResumeId] = useState<string>(resumesList.length > 0 ? resumesList[0].id : []);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 1
    const [copied, setCopied] = useState(false);

    const [sortBy, setSortBy] = useState<any>('newest');
    
    

    const displayedResumes = useMemo(() => {
        let result = [...resumesList];

        // Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();

            result = result.filter((resume) => {
                const titleMatch = (resume.title || '').toLowerCase().includes(query);
                const nameMatch = (resume.name || '').toLowerCase().includes(query);
                const summaryMatch = (resume.summary || '').toLowerCase().includes(query);

                return titleMatch || nameMatch || summaryMatch;
            });
        }

        // Sort
        if (sortBy === 'newest') {
            result.sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
            );
        } else if (sortBy === 'oldest') {
            result.sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
            );
        } else if (sortBy === 'highestAts') {
            result.sort(
                (a, b) =>
                    Number(b.atsScore ?? 0) - Number(a.atsScore ?? 0)
            );
        } else if (sortBy === 'lowestAts') {
            result.sort(
                (a, b) =>
                    Number(a.atsScore ?? 0) - Number(b.atsScore ?? 0)
            );
        }

        return result.length > 0 ? result : [] ;
    }, [resumesList, searchQuery, sortBy]);
    
    const activeResumedata = dashboardMockData?.resumes.find((item: any) => item.id === activeResumeId)

    const handleSelectResume = (resumeId: string) => {
    setActiveResumeId(resumeId);
    };

    // Copy raw text handler
    const handleCopyRawText = () => {
    if (!activeResumedata) return;
        const rawText = activeResumedata;
        navigator.clipboard.writeText(JSON.stringify(rawText));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };


    const activeResumeDate = activeResumedata?.date ? formatDistanceToNow(new Date(activeResumedata.date), { addSuffix: true }) : 'N/A';
    

  return (
    <section className="w-full">
        <Card>
            <div className="flex flex-col lg:flex-row gap-0 w-full min-h-160">
            <div className="w-full lg:w-96 lg:min-w-85 p-5 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between space-y-4">
                <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                <div className="space-y-3 border-b border-slate-200 pb-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                            <Icons name="resume" size="sm" />
                            All Uploaded Resumes
                        </h3>
                        <div className='flex items-center gap-2'>
                            <span className="text-xs font-medium text-slate-500">
                                {displayedResumes.length} {displayedResumes.length === 1 ? 'item' : 'items'}
                            </span>
                            <JobSortDropdown sortBy={sortBy} onSortChange={setSortBy} from={'resume'}/>
                        </div>
                    </div>

                    <div className="relative">
                        <Icons name='search' className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                        <input type="text" placeholder="Search resumes..." value={searchQuery} 
                        onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
                            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border-2 border-slate-200 focus:outline-none focus:border-(--primaryBlue) bg-slate-50"
                        />
                    </div>
                </div>

                {displayedResumes.length === 0 || !displayedResumes ? (
                    <div className="py-12 text-center text-slate-400 space-y-2">
                        <p className="text-xs">No resumes found matching your search.</p>
                        <button type="button" onClick={() => setSearchQuery('')} className="text-xs font-semibold text-(--primaryBlue) underline cursor-pointer">
                            Reset search
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                    {displayedResumes.map((resume) => {
                        const isSelected = activeResumeId === resume.id;
                        return (
                        <div key={resume.id} className={`rounded-lg transition-all ${isSelected
                            ? 'border-2 border-(--primaryBlue) bg-(--lightBlue) '
                            : 'hover:bg-(--lightBlue) border border-(--primaryBlue)/10'
                            }`}>
                            <AnalysisCard 
                            jobTitle={resume.title || resume.name}
                            ats={resume.atsScore}
                            company={resume.name || 'Resume PDF'}
                            date={resume.date}
                            iconName="resume"
                            onPreview={() => handleSelectResume(resume.id)}
                            />
                        </div>
                        );
                    })}
                    </div>
                )}
                </div>

                {totalPages > 1 && (
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs">
                    <span className="text-slate-500 font-medium">
                    Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex items-center gap-1">
                        <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                            <Icons name='left'/>
                        </button>
                        <button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                            <Icons name='right'/>
                        </button>
                    </div>
                </div>
                )}
            </div>

            <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                {activeResumedata ? (
                <>
                    <div className="space-y-4">
                        <div className="flex flex-col flex-wrap gap-3 pb-4">
                            <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-(--primaryBlue)/10 text-(--primaryBlue) flex items-center justify-center shrink-0 border border-(--primaryBlue)/20">
                                <Icons name="resume" size="md" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">{activeResumedata.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                <span className="font-mono text-slate-600">{activeResumedata.name}</span>
                                </div>
                            </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className='flex items-center gap-3'>
                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                        <FiAward className="w-3.5 h-3.5" />
                                        {activeResumedata.atsScore} ATS Score
                                    </span>

                                    <button type="button" onClick={handleCopyRawText} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-slate-200">
                                        {copied ? (
                                        <>
                                            <Icons name='check' className=" text-emerald-600" />
                                            <span className="text-emerald-700 font-bold">Copied!</span>
                                        </>
                                        ) : (
                                        <>
                                            <Icons name='copy'/>
                                            <span>Copy Raw Text</span>
                                        </>
                                        )}
                                    </button>
                                </div>

                                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                                    Posted: {activeResumeDate}
                                </span>
                            </div>
                        </div>

                        <div className="w-full max-h-125 min-h-96 overflow-y-auto bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-inner">
                            <ResumePreview tempData={activeResumedata}/>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-slate-500 font-medium">
                        Selected: <span className="font-semibold text-slate-800">{activeResumedata.title}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => navigate('/user-dashboard/all-analysis')} 
                        className="inline-flex items-center gap-2 text-xs font-bold text-white bg-(--primaryBlue) hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors shadow-xs cursor-pointer">
                        <Icons name='analyze'/>
                        Analyze This
                        </button>

                        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-4 py-2 rounded-lg transition-colors cursor-pointer">
                        <Icons name='analysis'/>
                        View Report
                        </a>

                        <a href="/resume.pdf" download={activeResumedata.name || 'Resume.pdf'} className="inline-flex items-center gap-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-xs">
                        <Icons name='download'/>
                        Download
                        </a>
                    </div>
                    </div>
                </>
                ) : (
                <div className="py-20 text-center text-slate-400 space-y-2">
                    <p className="text-sm">Select a resume from the left list to view raw text content.</p>
                </div>
                )}
            </div>
            </div>
        </Card>
    </section>
  )
}
