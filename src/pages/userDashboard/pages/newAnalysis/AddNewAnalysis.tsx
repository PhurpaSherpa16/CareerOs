import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icons from '../../../../utils/Icons';
import StatusIndicator from './components/StatusIndicator';
import ResumeUpload from './components/ResumeUpload';
import ResumePreview from './components/ResumePreview';
import JobDescriptionForm from './components/JobDescriptionForm';
import AnalyzeButton from './components/AnalyzeButton';
import AnalysisProgressModal from './components/AnalysisProgressModal';
import HeaderUserDashboard from '../../../../components/Header.UserDashboard';
import usePost from '../../../../hooks/Post';
import { useQueryClient } from '@tanstack/react-query';

interface ResumeUploadResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        title: string;
        fileUrl?: string;
        [key: string]: unknown;
    };
}

interface JobUploadResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        title: string;
        resumeId: string;
        [key: string]: unknown;
    };
}

interface AnalysisPayload {
    resumeId: string;
    jobId: string;
}

interface AnalysisResponse {
    success: boolean;
    message: string;
    result?: {
        id: string;
        [key: string]: unknown;
    };
    data?: {
        id: string;
        [key: string]: unknown;
    };
}

export default function AddNewAnalysis() {
    const token = localStorage.getItem('careerOsUserToken')
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    // State Resume
    const [activeTab, setActiveTab] = useState<'resume' | 'jobDescription'>('resume');
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [analysisErrorMsg, setAnalysisErrorMsg] = useState<string | null>(null);
    
    // State JD
    const [jobDescription, setJobDescription] = useState<string>(JD);
    const [jobTitle, setJobTitle] = useState<string>('Junior Software Engineer');
    const [companyName, setCompanyName] = useState<string>('Apple co ltd');
    const [jobUrl, setJobUrl] = useState<string>('https://jobs.apple.com/en/job/200234936/Software-Engineer-Swift-UI');
    
    const [isProgressModalOpen, setIsProgressModalOpen] = useState<boolean>(false);
    const [completedReportId, setCompletedReportId] = useState<string | null>(null);

    const postResumeURL = 'resume/create'
    const postJobDescrip = 'job/create'
    const postAnalysisURL = 'analysis/create'

    const {
        mutateAsync: resumeMutateAsync,
        reset: resetResumeMutation,
        isPending: resumeIsPending,
        isSuccess: resumeIsSuccess,
        isError: resumeIsError,
        error: resumeError,
        data: resumeData,
    } = usePost<FormData, ResumeUploadResponse>({ url: postResumeURL, token: token || '' })

    const {
        mutateAsync: jobMutateAsync,
        reset: resetJobMutation,
        isPending: jobIsPending,
        isSuccess: jobIsSuccess,
        isError: jobIsError,
        error: jobError,
        data: jobData,
    } = usePost<FormData, JobUploadResponse>({ url: postJobDescrip, token: token || '' })

    const {
        mutateAsync: analysisMutateAsync,
        reset: resetAnalysisMutation,
        isPending: analysisIsPending,
        isSuccess: analysisIsSuccess,
        isError: analysisIsError,
        error: analysisError,
        data: analysisData,
    } = usePost<AnalysisPayload, AnalysisResponse>({ url: postAnalysisURL, token: token || '' })

    const resetAllMutations = () => {
        resetResumeMutation();
        resetJobMutation();
        resetAnalysisMutation();
        setCompletedReportId(null);
        setAnalysisErrorMsg(null);
    };

    const isAnalyzing = resumeIsPending || jobIsPending || analysisIsPending;

    if(resumeData) console.log('resumeData', resumeData)
    if(jobData) console.log('job', jobData)
    if(analysisData) console.log('analysis', analysisData)

    const getLoadingText = () => {
        if (resumeIsPending) return 'Uploading & Parsing Resume...';
        if (jobIsPending) return 'Saving Job Description...';
        if (analysisIsPending) return 'Generating AI Analysis Report...';
        return 'Analyzing Match...';
    };

    // Validation: JD requires min 100 words, Job Title required, Resume required
    const jdWordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;
    const isResumeUploaded = resumeFile !== null;
    const isJobTitleAdded = jobTitle.trim().length > 0;
    const isJobDescriptionAdded = jdWordCount >= 100;
    const isReadyToAnalyze = isResumeUploaded && isJobDescriptionAdded && isJobTitleAdded;

    const handleFileSelect = (file: File | null) => {
        setFileError(null);
        setAnalysisErrorMsg(null);
        if (!file) {
            setResumeFile(null);
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setFileError('File size exceeds 10MB limit. Please upload a smaller file.');
            return;
        }
        setResumeFile(file);
    };

    const handleAnalyze = async () => {
        setAnalysisErrorMsg(null);

        // 1. Validation checks
        if (!resumeFile) {
            setFileError('Please upload a resume file (PDF).');
            setAnalysisErrorMsg('Resume is required. Please upload your resume.');
            setActiveTab('resume');
            return;
        }

        if (!jobTitle.trim()) {
            setAnalysisErrorMsg('Job Title is required. Please enter a job title.');
            setActiveTab('jobDescription');
            return;
        }

        if (!jobDescription.trim()) {
            setAnalysisErrorMsg('Job description is required.');
            setActiveTab('jobDescription');
            return;
        }

        if (jdWordCount < 100) {
            setAnalysisErrorMsg(`Job description must contain at least 100 words (currently ${jdWordCount} words).`);
            setActiveTab('jobDescription');
            return;
        }

        // Reset mutation states and open analysis progress modal
        resetAllMutations();
        setIsProgressModalOpen(true);

        try {
            // Step 1: Upload resume -> get resumeId
            const resumeFormData = new FormData();
            resumeFormData.append('resume', resumeFile);
            const resumeRes = await resumeMutateAsync(resumeFormData);
            const uploadedResumeId = resumeRes?.data?.data?.id;

            if (!uploadedResumeId) {
                throw new Error('Failed to retrieve resume ID from upload response.');
            }

            // Step 2: Upload Job Description -> pass resumeId -> get jobId
            const jobFormData = new FormData();
            jobFormData.append('title', jobTitle.trim());
            jobFormData.append('description', jobDescription.trim());
            jobFormData.append('company', companyName.trim());
            jobFormData.append('jobUrl', jobUrl.trim());
            jobFormData.append('resumeId', uploadedResumeId);

            const jobRes = await jobMutateAsync(jobFormData);
            const uploadedJobId = jobRes?.data?.data?.id;

            if (!uploadedJobId) {
                throw new Error('Failed to retrieve job ID from job upload response.');
            }

            // Step 3: Call /analysis/create with resumeId and jobId
            const analysisRes = await analysisMutateAsync({
                resumeId: uploadedResumeId,
                jobId: uploadedJobId,
            });

            const analysisId = analysisRes?.data?.result?.id || analysisRes?.data?.data?.id;

            if (analysisId) {
                setCompletedReportId(analysisId);
                queryClient.invalidateQueries({queryKey: ['resumes'],});
            } else {
                throw new Error('Failed to retrieve analysis ID from response.');
            }
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                'Something went wrong during analysis. Please try again.';
            setAnalysisErrorMsg(message);
            console.error('Error during analysis generation:', err);
        }
    };

    const handleViewReport = () => {
        if (completedReportId) {
            navigate(`/user-dashboard/report/${completedReportId}`);
        }
    };

    const handleCloseProgressModal = () => {
        setIsProgressModalOpen(false);
        resetAllMutations();
    };

    if (resumeError) {
        console.log('resume error: ', resumeError);
    }
    if (jobError) {
        console.log('job error: ', jobError);
    }
    if (analysisError) {
        console.log('analysis error: ', analysisError);
    }

    const scrollToAnalyzeButton = () => {
        const target = document.getElementById('analyze-button-section');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    };



    return (
        <div className="mainDiv space-y-8">
            {/* Header */}
            <header className="border-b border-slate-200/80 pb-5 space-y-2">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                    <HeaderUserDashboard  title="New Analysis" subTitle="Upload your resume and provide a target job description to get instant ATS optimization and matching feedback." />

                    {/* Step Badges + Ready For Analysis Quick Scroll Button */}
                    <div className="lg:flex hidden items-center w-fit gap-2 self-start sm:self-auto bg-white p-1.5 rounded-xl border border-slate-200 flex-wrap">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${isResumeUploaded ? 'bg-green-200 text-green-900' : 'bg-slate-200 text-slate-400 shadow-xs'}`}>
                            <span className={`w-4 h-4 rounded-full ${isResumeUploaded ? 'bg-green-600' : 'bg-slate-400'} text-white text-[9px] flex items-center justify-center font-bold`}> 1 </span>
                            Resume
                        </span>
                        <span className={`${isJobDescriptionAdded ? 'text-green-600' : 'text-slate-300'} font-bold`}>→</span>
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${isJobDescriptionAdded ? 'bg-green-200 text-green-900' : 'bg-slate-200 text-slate-400 shadow-xs'  }`}>
                            <span className={`w-4 h-4 rounded-full ${isJobDescriptionAdded ? 'bg-green-600' : 'bg-slate-400'} text-white text-[9px] flex items-center justify-center font-bold`}>2</span>
                            Job Description
                        </span>
                        <span className={`${isJobDescriptionAdded ? 'text-green-600' : 'text-slate-300'} font-bold`}>→</span>
                        {/* Ready for Analysis Button */}
                        <button type="button" disabled={!isReadyToAnalyze || isAnalyzing} onClick={scrollToAnalyzeButton}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${isReadyToAnalyze && !isAnalyzing
                                    ? 'bg-(--primaryBlue) hover:bg-blue-700 text-white shadow-sm cursor-pointer active:scale-95'
                                    : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                                }`}>
                            <Icons name="analyze" size="xs" className={isAnalyzing ? 'animate-spin' : ''} />
                            <span>{isAnalyzing ? 'Analyzing...' : 'Ready for Analysis'}</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="space-y-6">
                {/* Error Banner */}
                {analysisErrorMsg && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start justify-between gap-3 text-sm animate-fadeIn">
                        <div className="flex items-center gap-2">
                            <span className="font-bold">Error:</span>
                            <span>{analysisErrorMsg}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setAnalysisErrorMsg(null)}
                            className="text-rose-500 hover:text-rose-800 text-xs font-bold underline cursor-pointer"
                        >
                            Dismiss
                        </button>
                    </div>
                )}
                {/* Navigation Tabs Switcher */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-1 flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setActiveTab('resume')}
                            className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${activeTab === 'resume'
                                    ? 'border-(--primaryBlue) text-(--primaryBlue) bg-(--primaryBlue)/5'
                                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                }`}>
                            <Icons name="resume" size="sm" />
                            <span>Resume</span>
                            <span className={`w-2 h-2 rounded-full ${isResumeUploaded ? 'bg-emerald-500' : 'bg-rose-400'}`} />
                        </button>

                        <button type="button" onClick={() => setActiveTab('jobDescription')} className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${activeTab === 'jobDescription'
                                    ? 'border-(--primaryBlue) text-(--primaryBlue) bg-(--primaryBlue)/5'
                                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                }`}>
                            <Icons name="jobIcon" size="sm" />
                            <span>Job Description</span>
                            <span className={`w-2 h-2 rounded-full ${isJobDescriptionAdded ? 'bg-emerald-500' : 'bg-rose-400'}`}/>
                        </button>
                    </div>
                </div>

                {/* Tab 1: Resume */}
                {activeTab === 'resume' && (
                    <div className="space-y-4">
                        <p className="text-[11px] text-slate-500">
                            Upload your resume on the left. The live preview updates on the right.
                        </p>
                        {/* Status Indicator placed inside Resume Tab with Next button */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 gap-2">
                            <div className="flex items-center gap-2.5">
                                <span className="text-xs font-bold text-slate-700">Resume Status:</span>
                                <StatusIndicator  type="resume" resumeUploaded={isResumeUploaded} jobDescriptionAdded={isJobDescriptionAdded}/>
                            </div>

                            {/* Next / Scroll to Analyze Button */}
                            <button type="button" disabled={!isResumeUploaded}
                                onClick={() => {
                                    if (!isResumeUploaded) return;
                                    if (isReadyToAnalyze) {
                                        scrollToAnalyzeButton();
                                    } else {
                                        setActiveTab('jobDescription');
                                    }
                                }}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                                    !isResumeUploaded  ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                                        : 'bg-(--primaryBlue) hover:bg-blue-700 text-white shadow-xs cursor-pointer active:scale-95'}`}>
                                <span>{isReadyToAnalyze ? 'Scroll to Analyze ↓' : 'Next: Job Description →'}</span>
                            </button>
                        </div>

                        {/* Resume Upload & Preview Side-by-Side (flex gap-16) */}
                        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16">
                            {/* Left: Upload Section */}
                            <div className="w-full lg:w-1/2">
                                <ResumeUpload selectedFile={resumeFile} onFileSelect={handleFileSelect} fileError={fileError}/>
                            </div>

                            {/* Right: Fixed-Height Scrollable Preview Section */}
                            <div className="w-full lg:w-1/2">
                                <ResumePreview selectedFile={resumeFile} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 2: Job Description */}
                {activeTab === 'jobDescription' && (
                    <div className="space-y-4">
                        {/* Status Indicator placed inside Job Description Tab with Action button */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 gap-2">
                            <div className="flex items-center gap-2.5">
                                <span className="text-xs font-bold text-slate-700">Job Description Status:</span>
                                <StatusIndicator type="jobDescription" resumeUploaded={isResumeUploaded} jobDescriptionAdded={isJobDescriptionAdded} />
                            </div>

                            {/* Action / Scroll to Analyze Button */}
                            <button
                                type="button"
                                disabled={!isJobDescriptionAdded}
                                onClick={() => {
                                    if (!isJobDescriptionAdded) return;
                                    if (!isResumeUploaded) {
                                        setActiveTab('resume');
                                    } else {
                                        scrollToAnalyzeButton();
                                    }
                                }}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                                    !isJobDescriptionAdded ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                                        : 'bg-(--primaryBlue) hover:bg-blue-700 text-white shadow-xs cursor-pointer active:scale-95'}`}>
                                <span>{!isResumeUploaded ? '← Back: Add Resume' : 'Scroll to Analyze ↓'}</span>
                            </button>
                        </div>

                        <JobDescriptionForm jobDescription={jobDescription} setJobDescription={setJobDescription} companyName={companyName} 
                        setCompanyName={setCompanyName} jobUrl={jobUrl} setJobUrl={setJobUrl} 
                        jobTitle={jobTitle} setJobTitle={setJobTitle}/>
                    </div>
                )}

                {/* Bottom Action Bar */}
                <div id="analyze-button-section" className="pt-2">
                    <AnalyzeButton 
                        isEnabled={isReadyToAnalyze} 
                        onAnalyze={handleAnalyze} 
                        isAnalyzing={isAnalyzing} 
                        loadingText={getLoadingText()}
                        resumeUploaded={isResumeUploaded}
                        jobDescriptionAdded={isJobDescriptionAdded}
                    />
                </div>

                {/* Analysis Progress & Loading Modal */}
                <AnalysisProgressModal
                    isOpen={isProgressModalOpen}
                    resumeStatus={{
                        isPending: resumeIsPending,
                        isSuccess: resumeIsSuccess,
                        isError: resumeIsError,
                    }}
                    jobStatus={{
                        isPending: jobIsPending,
                        isSuccess: jobIsSuccess,
                        isError: jobIsError,
                    }}
                    analysisStatus={{
                        isPending: analysisIsPending,
                        isSuccess: analysisIsSuccess,
                        isError: analysisIsError,
                    }}
                    reportId={completedReportId}
                    errorMessage={analysisErrorMsg}
                    onViewReport={handleViewReport}
                    onRetry={handleAnalyze}
                    onClose={handleCloseProgressModal}
                />
            </div>
        </div>
    );
}


const JD = `About the job
Responsibilities

Ship responsive UI features and landing pages with a performance-first mindset.
Collaborate with designers to translate product ideas into accessible interfaces.
Improve code quality with reusable components, tests, and clean architecture.
Tune rendering and loading strategies for excellent Core Web Vitals.

Requirements

2+ years of frontend experience with React or Next.js.
Comfort with TypeScript, CSS systems, and modern component patterns.
Strong eye for detail and thoughtful collaboration skills.
Experience working with APIs and building production UI workflows.

Perks

Flexible hybrid work setup
High-impact product work
Learning budget for tools and courses
Monthly design and engineering reviews`