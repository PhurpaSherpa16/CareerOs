import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    FiSearch,
    FiFilter,
    FiChevronLeft,
    FiChevronRight,
    FiSliders,
} from 'react-icons/fi';
import { dashboardMockData } from '../../../data/userDashboard.mock';
import { Card } from '../../../components/Card.UserDashboard';
import { Heading } from '../../../components/Heading.UserDashboard';
import AnalysisCard from '../../../components/ui/AnalysisCard';
import ReportPreviewTab from '../components/ReportPreviewTab';
import ResumePreviewTab from '../components/ResumePreviewTab';
import JobDescriptionTab from '../components/JobDescriptionTab';
import AICoverLetterTab from '../components/AICoverLetterTab';
import Icons from '../../../utils/Icons';
import { FaWandMagicSparkles } from 'react-icons/fa6';

export default function AllAnalysis() {
    const mockData = dashboardMockData;
    const initialAnalyses = mockData?.recentAnalyses || [];
    const resumesData = mockData?.resumes || [];
    const latestJobsData = mockData?.latestJobs || [];

    // Search, Filter, Sort & Pagination States
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highestAts' | 'topMatch'>('highestAts');
    const [filterScore, setFilterScore] = useState<'all' | 'high' | 'medium' | 'low'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Active Selected Analysis Item & Active Tab
    const [previewItem, setPreviewItem] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'report' | 'resume' | 'jd' | 'coverLetter'>('report');

    // Combine analysis items with job and resume data for easier filtering & searching
    const enrichedAnalyses = useMemo(() => {
        return initialAnalyses.map((analysis) => {
            const job = latestJobsData.find((j) => j.id === analysis.jobId) || latestJobsData[0];
            const resume = resumesData.find((r) => r.id === analysis.resumeId) || resumesData[0];
            return {
                ...analysis,
                job,
                resume,
            };
        });
    }, [initialAnalyses, latestJobsData, resumesData]);

    // Filtering & Sorting Logic
    const filteredAndSortedAnalyses = useMemo(() => {
        return enrichedAnalyses
            .filter((item) => {
                const query = searchQuery.toLowerCase().trim();
                const matchesSearch =
                    !query ||
                    item.job?.title?.toLowerCase().includes(query) ||
                    item.job?.company?.toLowerCase().includes(query) ||
                    item.resume?.title?.toLowerCase().includes(query);

                let matchesScore = true;
                if (filterScore === 'high') matchesScore = item.atsScore >= 85;
                if (filterScore === 'medium') matchesScore = item.atsScore >= 75 && item.atsScore < 85;
                if (filterScore === 'low') matchesScore = item.atsScore < 75;

                return matchesSearch && matchesScore;
            })
            .sort((a, b) => {
                if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                if (sortBy === 'highestAts') return (b.atsScore || 0) - (a.atsScore || 0);
                if (sortBy === 'topMatch') return (b.jobMatch || 0) - (a.jobMatch || 0);
                return 0;
            });
    }, [enrichedAnalyses, searchQuery, filterScore, sortBy]);

    // Pagination Calculations
    const totalItems = filteredAndSortedAnalyses.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAnalyses = filteredAndSortedAnalyses.slice(startIndex, startIndex + itemsPerPage);

    // Active Selection Fallback
    const activeAnalysis = previewItem || (filteredAndSortedAnalyses.length > 0 ? filteredAndSortedAnalyses[0] : null);
    const activeResume = activeAnalysis?.resume || (resumesData.length > 0 ? resumesData[0] : null);
    const activeJob = activeAnalysis?.job || (latestJobsData.length > 0 ? latestJobsData[0] : null);

    const handleSelectAnalysis = (item: any) => {
        setPreviewItem(item);
    };

    return (
        <div className="mainDiv space-y-8">
            {/* Header Section */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="h1">All Analysis Reports</h1>
                    <p className="text-(--secondaryBlack) text-xs sm:text-sm mt-1">
                        Search, filter, and evaluate all your ATS resume optimization reports
                    </p>
                </div>
            </header>

            <Heading label="Filter & Analysis History" />

            {/* Controls Bar: Search, Filters, Sorting & Pagination Controls */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input type="text"
                        placeholder="Search by job, company, or resume..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden 
                        focus:border-(--primaryBlue) focus:ring-1 focus:ring-(--primaryBlue)"
                    />
                </div>

                {/* Filter & Sort Controls */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Sort Selector */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                        <FiSliders className="w-3.5 h-3.5 text-slate-500" />
                        <span className="font-semibold text-slate-500">Sort:</span>
                        <select
                            value={sortBy}
                            onChange={(e: any) => {
                                setSortBy(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="bg-transparent border-none text-slate-800 font-semibold focus:outline-hidden cursor-pointer"
                        >
                            <option value="highestAts">Highest ATS Score</option>
                            <option value="topMatch">Top Job Match</option>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>

                    {/* Filter Selector */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                        <FiFilter className="w-3.5 h-3.5 text-slate-500" />
                        <span className="font-semibold text-slate-500">Score:</span>
                        <select
                            value={filterScore}
                            onChange={(e: any) => {
                                setFilterScore(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="bg-transparent border-none text-slate-800 font-semibold focus:outline-hidden cursor-pointer"
                        >
                            <option value="all">All Scores</option>
                            <option value="high">High ATS (85+)</option>
                            <option value="medium">Moderate ATS (75-84)</option>
                            <option value="low">Needs Work (&lt;75)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Split View Content Card */}
            <Card>
                <div className="flex flex-col lg:flex-row gap-4 w-full">
                    {/* Left Side: Paginated Analysis List */}
                    <div className="w-full lg:w-96 lg:min-w-85 pr-0 lg:pr-4 border-b lg:border-b-0 lg:border-r border-(--secondaryBlack)/20">
                        <div className="px-5 py-5 min-h-120 max-h-150 2xl:min-h-180 2xl:max-h-180 flex flex-col justify-between space-y-4">
                            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                                <div className="border-b border-(--secondaryBlack)/20 pb-2 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-slate-800">Analysis Results</h3>
                                    <span className="text-xs font-medium text-slate-500">
                                        {totalItems} {totalItems === 1 ? 'item' : 'items'}
                                    </span>
                                </div>

                                {paginatedAnalyses.length === 0 ? (
                                    <div className="py-12 text-center text-slate-400 space-y-2">
                                        <p className="text-xs">No analysis reports match your filter criteria.</p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearchQuery('');
                                                setFilterScore('all');
                                            }}
                                            className="text-xs font-semibold text-(--primaryBlue) underline cursor-pointer"
                                        >
                                            Reset filters
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {paginatedAnalyses.map((analysis) => {
                                            const isSelected = activeAnalysis?.id === analysis.id;
                                            return (
                                                <div key={analysis.id} className={`rounded-lg transition-all ${isSelected ? 'border-2 border-(--primaryBlue) ring-offset-1 bg-(--lightBlue)'
                                                        : 'hover:bg-(--lightBlue) border border-(--primaryBlue)/10'
                                                    }`}>
                                                    <AnalysisCard
                                                        jobTitle={analysis.job?.title || 'Unknown Position'}
                                                        ats={analysis.atsScore}
                                                        company={analysis.job?.company || 'Company'}
                                                        date={analysis?.createdAt}
                                                        onPreview={() => handleSelectAnalysis(analysis)} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Left Side Pagination Footer Controls */}
                            {totalPages > 1 && (
                                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between shrink-0 text-xs">
                                    <span className="text-slate-500 font-medium">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button type="button" disabled={currentPage === 1}
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                                            <FiChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button type="button" disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                                            <FiChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Tabbed Preview Panel */}
                    <div className="w-full flex-1">
                        <div className="px-5 py-5 space-y-6 min-h-150 max-h-150 2xl:min-h-180 2xl:max-h-180 flex flex-col overflow-hidden">
                            {/* Tab Header Navigation & Action Button */}
                            <div className="flex flex-wrap items-center justify-between border-b border-slate-200 gap-3 shrink-0 pb-4">
                                {/* Tab buttons */}
                                <div className="flex flex-wrap w-full items-center justify-between bg-slate-100 p-1 rounded-xl">
                                    <div className='flex flex-wrap gap-1 items-center'>
                                        <button type="button" onClick={() => setActiveTab('report')}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === 'report'
                                                    ? 'bg-white text-(--primaryBlue) shadow-xs'
                                                    : 'text-slate-600 hover:text-slate-900'
                                                }`}>
                                            <Icons name="report" />
                                            Report Preview
                                        </button>
                                        <button type="button" onClick={() => setActiveTab('resume')}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === 'resume'
                                                    ? 'bg-white text-(--primaryBlue) shadow-xs'
                                                    : 'text-slate-600 hover:text-slate-900'
                                                }`}>
                                            <Icons name="resume" />
                                            Resume
                                        </button>
                                        <button type="button" onClick={() => setActiveTab('jd')}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === 'jd'
                                                    ? 'bg-white text-(--primaryBlue) shadow-xs'
                                                    : 'text-slate-600 hover:text-slate-900'}`}>
                                            <Icons name="jobIcon" />
                                            Job Description (JD)
                                        </button>
                                        <button type="button" onClick={() => setActiveTab('coverLetter')}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === 'coverLetter'
                                                    ? 'bg-white text-(--primaryBlue) shadow-xs'
                                                    : 'text-slate-600 hover:text-slate-900'
                                                }`}>
                                            <FaWandMagicSparkles className="w-3.5 h-3.5 text-indigo-500" />
                                            AI Cover Letter
                                        </button>
                                    </div>

                                    {/* Action button to re-analyze resume with another JD */}
                                    <Link to="/" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold 
                                        transition-all cursor-pointer border border-(--primaryBlue) text-(--primaryBlue) hover:border-indigo-700 
                                        hover:text-indigo-700
                                        shadow-xs`}
                                        title="Analyze this resume with a new job description">
                                        <Icons name='repeat'/>
                                        Analyze Resume
                                    </Link>

                                </div>

                                {/* Right Side Actions: "Analyze this resume again with other JD" button & Job badge */}
                                <div className="flex justify-between w-full ">
                                    {/* Active Job indicator */}
                                    {activeJob && (
                                        <div className="text-right hidden xl:block">
                                            <span className="text-xs font-bold text-slate-800 block truncate max-w-40">
                                                {activeJob.title}
                                            </span>
                                            <span className="text-[11px] text-slate-500 flex items-center gap-1 justify-start">
                                                <Icons company={activeJob.company} size="xs" />
                                                {activeJob.company}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tab Content Display */}
                            <div className="flex-1 overflow-y-auto pr-1">
                                {activeTab === 'report' && (
                                    <ReportPreviewTab
                                        analysis={activeAnalysis}
                                        resume={activeResume}
                                        job={activeJob}
                                    />
                                )}

                                {activeTab === 'resume' && <ResumePreviewTab resume={activeResume} />}

                                {activeTab === 'jd' && (
                                    <JobDescriptionTab
                                        job={activeJob}
                                        matchedSkills={activeAnalysis?.matchedSkills}
                                        resumeSkills={activeResume?.skills}
                                        experience={activeAnalysis?.experience}
                                    />
                                )}

                                {activeTab === 'coverLetter' && (
                                    <AICoverLetterTab
                                        analysis={activeAnalysis}
                                        resume={activeResume}
                                        job={activeJob}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
