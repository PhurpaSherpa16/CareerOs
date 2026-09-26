import { useState } from 'react';
import { Card } from '../../../components/Card.UserDashboard';
import AnalysisCard from '../../../components/ui/AnalysisCard';
import ReportPreviewTab from './ReportPreviewTab';
import ResumePreviewTab from './ResumePreviewTab';
import JobDescriptionTab from './JobDescriptionTab';
import Icons from '../../../utils/Icons';
import { Link } from 'react-router-dom';

interface RecentAnalysisProps {
    recentAnalysisData: any[];
    resumesData: any[];
    latestJobsData: any[];
}

export default function RecentAnalysis({
    recentAnalysisData,
    resumesData,
    latestJobsData,
}: RecentAnalysisProps) {
    const recentAnalysis = recentAnalysisData || [];
    const [previewItem, setPreviewItem] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'report' | 'resume' | 'jd'>('report');

    const handlePreviewItem = (item: any) => {
        setPreviewItem(item);
    };

    // Default active analysis item is either the user selected one or the first available
    const activeAnalysis = previewItem || (recentAnalysis.length > 0 ? recentAnalysis[0] : null);

    // Find linked resume and job for the active analysis item
    const activeResume = activeAnalysis
        ? resumesData.find((resume) => resume.id === activeAnalysis.resumeId) || resumesData[0]
        : null;

    const activeJob = activeAnalysis
        ? latestJobsData.find((job) => job.id === activeAnalysis.jobId) || latestJobsData[0]
        : null;

    return (
        <Card>
            <div className="flex flex-col lg:flex-row gap-4 w-full">
                {/* Left Side: Analysis List */}
                <div className="w-full lg:w-96 lg:min-w-85 pr-0 lg:pr-4 border-b lg:border-b-0 lg:border-r border-(--secondaryBlack)/20">
                    <div className="px-5 py-5 min-h-120 max-h-150 2xl:min-h-180 2xl:max-h-180 space-y-6 overflow-y-auto">
                        <div className="border-b border-(--secondaryBlack)/20 pb-2 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-800">Analysis Results</h3>
                            <span className="text-xs font-medium text-slate-500">{recentAnalysis.length} items</span>
                        </div>

                        <div className="space-y-4">
                            {recentAnalysis.map((analysis, index) => {
                                const specificJob = latestJobsData.find((job) => analysis.jobId === job.id);
                                const isSelected = activeAnalysis?.id === analysis.id;
                                return (
                                    <div key={analysis.id || index} className={`rounded-xl transition-all ${isSelected ? 'ring-2 ring-(--primaryBlue) ring-offset-1 bg-(--lightBlue)' : 'hover:bg-(--lightBlue) ring-1 ring-(--primaryBlue)/10'}`}>
                                        <AnalysisCard
                                            jobTitle={specificJob?.title || 'Unknown Position'}
                                            ats={analysis.atsScore}
                                            company={specificJob?.company || 'Company'}
                                            date={analysis?.createdAt}
                                            onPreview={() => handlePreviewItem(analysis)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Side: Tabbed Preview Panel */}
                <div className="w-full flex-1 ">
                    <div className="px-5 py-5 space-y-6 min-h-150 max-h-150 2xl:min-h-180 2xl:max-h-180 flex flex-col overflow-hidden">
                        {/* Tab Header Navigation */}
                        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 gap-2 shrink-0 pb-4">
                            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                                <button type="button" onClick={() => setActiveTab('report')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'report'
                                            ? 'bg-white text-(--primaryBlue) shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                        }`}>
                                    <Icons name='report'/>
                                    Report Preview
                                </button>
                                {/* <button type="button" onClick={() => setActiveTab('resume')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'resume'
                                            ? 'bg-white text-(--primaryBlue) shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                        }`}>
                                    <Icons name='resumeIcon'/>
                                    Resume
                                </button>
                                <button type="button" onClick={() => setActiveTab('jd')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'jd'
                                            ? 'bg-white text-(--primaryBlue) shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                        }`}>
                                    <Icons name='jobIcon'/>
                                    Job Description (JD)
                                </button> */}
                                {/* Analyze again button */}
                                <Link to="/" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'resume'
                                            ? 'bg-white text-(--primaryBlue) shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                        }`}>
                                    <Icons name='repeat'/>
                                    Analyze Again
                                </Link>
                            </div>

                            {/* Active Selection Title Indicator */}
                            {activeJob && (
                                <div className="text-right hidden sm:block">
                                    <span className="text-xs font-bold text-slate-800 block truncate max-w-44">
                                        {activeJob.title}
                                    </span>
                                    <span className="text-[11px] text-slate-500 flex items-center gap-1 justify-end">
                                        <Icons company={activeJob.company} size='xs'/>{activeJob.company}
                                    </span>
                                </div>
                            )}
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
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
