import { Card } from '../../../../../components/Card.UserDashboard';
import Icons from '../../../../../utils/Icons';
import { FiAward } from 'react-icons/fi';
import ResumePreview from './ResumePreview';
import { Link } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import AnalysisCard from '../../../../../components/ui/AnalysisCard';
import { formatDistanceToNow } from 'date-fns';
import JobSortDropdown from '../../job/components/JobSortDropdown';
import useGetAllResume from '../../../../../hooks/getAllResume.hook';

interface ResumeListProps {
    onOpenUploadModal?: () => void;
}

export default function ResumeList({ onOpenUploadModal }: ResumeListProps) {
    const { resumes, loading: getAllResumeLoading } = useGetAllResume('resume/all');
    const resumesList: any[] = resumes || [];
    const [searchQuery, setSearchQuery] = useState('');
    const [activeResumeId, setActiveResumeId] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 1;
    const [copied, setCopied] = useState(false);

    const [sortBy, setSortBy] = useState<any>('newest');

    useEffect(() => {
        if (resumesList.length > 0) {
            if (!activeResumeId || !resumesList.some((r) => r.id === activeResumeId)) {
                setActiveResumeId(resumesList[0].id);
            }
        }
    }, [resumesList, activeResumeId]);

    const displayedResumes = useMemo(() => {
        let result = [...resumesList];

        // Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();

            result = result.filter((resume) => {
                const titleMatch = (resume.title || resume.fileName || '').toLowerCase().includes(query);
                const nameMatch = (resume.name || resume.fileName || '').toLowerCase().includes(query);
                const summaryMatch = (resume.summary || '').toLowerCase().includes(query);

                return titleMatch || nameMatch || summaryMatch;
            });
        }

        // Sort
        if (sortBy === 'newest') {
            result.sort(
                (a, b) =>
                    new Date(b.date || b.createdAt || 0).getTime() - new Date(a.date || a.createdAt || 0).getTime()
            );
        } else if (sortBy === 'oldest') {
            result.sort(
                (a, b) =>
                    new Date(a.date || a.createdAt || 0).getTime() - new Date(b.date || b.createdAt || 0).getTime()
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

        return result;
    }, [resumesList, searchQuery, sortBy]);

    const activeResumedata = resumesList.find((item: any) => item.id === activeResumeId) || (resumesList.length > 0 ? resumesList[0] : null);

    const formattedActiveResume = useMemo(() => {
        if (!activeResumedata) return null;
        let structured = activeResumedata.structuredText;
        if (typeof structured === 'string') {
            try {
                structured = JSON.parse(structured);
            } catch {
                structured = null;
            }
        }
        if (structured) {
            return {
                ...activeResumedata,
                name: structured.contact?.name || activeResumedata.name || activeResumedata.fileName || 'Candidate',
                email: structured.contact?.email || activeResumedata.email,
                phone: structured.contact?.phone || activeResumedata.phone,
                github: structured.contact?.github || activeResumedata.github,
                linkedin: structured.contact?.linkedin || activeResumedata.linkedin,
                summary: structured.summary || activeResumedata.summary,
                skills: structured.skills || activeResumedata.skills,
                projects: structured.projects || activeResumedata.projects,
                rawText: activeResumedata.rawText,
                date: activeResumedata.date || activeResumedata.createdAt,
            };
        }
        return activeResumedata;
    }, [activeResumedata]);

    const handleSelectResume = (resumeId: string) => {
        setActiveResumeId(resumeId);
    };

    // Copy raw text handler
    const handleCopyRawText = () => {
        if (!activeResumedata) return;
        const textToCopy = activeResumedata.rawText
            ? activeResumedata.rawText
            : JSON.stringify(formattedActiveResume || activeResumedata, null, 2);
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const activeResumeDate = (activeResumedata?.date || activeResumedata?.createdAt)
        ? formatDistanceToNow(new Date(activeResumedata.date || activeResumedata.createdAt), { addSuffix: true })
        : 'N/A';
    

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

                {getAllResumeLoading ? (
                    <div className="py-12 text-center text-slate-400 space-y-3">
                        <Icons name="analyze" size="md" className="animate-spin text-(--primaryBlue) mx-auto" />
                        <p className="text-xs">Loading resumes...</p>
                    </div>
                ) : displayedResumes.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 space-y-2">
                        <p className="text-xs">
                            {searchQuery ? 'No resumes found matching your search.' : 'No uploaded resumes yet.'}
                        </p>
                        {searchQuery ? (
                            <button type="button" onClick={() => setSearchQuery('')} className="text-xs font-semibold text-(--primaryBlue) underline cursor-pointer">
                                Reset search
                            </button>
                        ) : onOpenUploadModal ? (
                            <button
                                type="button"
                                onClick={onOpenUploadModal}
                                className="text-xs font-semibold text-(--primaryBlue) hover:underline cursor-pointer inline-flex items-center gap-1"
                            >
                                <Icons name="upload" size="xs" />
                                Upload your first resume
                            </button>
                        ) : null}
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
                            jobTitle={resume.title || resume.fileName || 'Resume'}
                            ats={resume.atsScore ?? 0}
                            company={resume.name || resume.fileName || 'Resume PDF'}
                            date={resume.date || resume.createdAt}
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
                                <h3 className="text-base font-bold text-slate-900">{activeResumedata.title || activeResumedata.fileName || 'Resume'}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                <span className="font-mono text-slate-600">{activeResumedata.name || activeResumedata.fileName || 'Resume.pdf'}</span>
                                </div>
                            </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className='flex items-center gap-3'>
                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                        <FiAward className="w-3.5 h-3.5" />
                                        {activeResumedata.atsScore ?? 0} ATS Score
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
                            <ResumePreview tempData={formattedActiveResume}/>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-slate-500 font-medium">
                        Selected: <span className="font-semibold text-slate-800">{activeResumedata.title || activeResumedata.fileName || 'Resume'}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link to="/user-dashboard/new-analysis" 
                        className="inline-flex items-center gap-2 text-xs font-bold text-white bg-(--primaryBlue) hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors shadow-xs cursor-pointer">
                        <Icons name='analyze'/>
                        Analyze This
                        </Link>

                        <Link to="/user-dashboard/report/123" className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-4 py-2 rounded-lg transition-colors cursor-pointer">
                        <Icons name='analysis'/>
                        View Report
                        </Link>

                        <a 
                            href={activeResumedata.fileUrl || "/resume.pdf"} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            download={activeResumedata.fileName || activeResumedata.name || 'Resume.pdf'} 
                            className="inline-flex items-center gap-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
                        >
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
