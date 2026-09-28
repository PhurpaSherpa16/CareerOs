import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icons from '../../../../utils/Icons';
import StatusIndicator from './components/StatusIndicator';
import ResumeUpload from './components/ResumeUpload';
import ResumePreview from './components/ResumePreview';
import JobDescriptionForm from './components/JobDescriptionForm';
import AnalyzeButton from './components/AnalyzeButton';

export default function AddNewAnalysis() {
    const navigate = useNavigate();

    // State
    const [activeTab, setActiveTab] = useState<'resume' | 'jobDescription'>('resume');
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    const [jobDescription, setJobDescription] = useState<string>('');
    const [companyName, setCompanyName] = useState<string>('');
    const [jobUrl, setJobUrl] = useState<string>('');

    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

    // Validation: JD requires min 100 words
    const jdWordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;
    const isResumeUploaded = resumeFile !== null;
    const isJobDescriptionAdded = jdWordCount >= 100;
    const isReadyToAnalyze = isResumeUploaded && isJobDescriptionAdded;

    const handleFileSelect = (file: File | null) => {
        setFileError(null);
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

    const handleAnalyze = () => {
        if (!isReadyToAnalyze) return;
        setIsAnalyzing(true);

        setTimeout(() => {
            setIsAnalyzing(false);
            navigate('/user-dashboard/report/1', {
                state: {
                    file: resumeFile,
                    jobDescription,
                    companyName,
                    jobUrl,
                },
            });
        }, 1000);
    };

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
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="h1 flex items-center gap-2">
                            <span>New Analysis</span>
                            
                        </h1>
                        <p className="text-(--secondaryBlack) w-xl text-xs sm:text-sm mt-1">
                            Upload your resume and provide a target job description to get instant ATS optimization and matching feedback.
                        </p>
                    </div>

                    {/* Step Badges + Ready For Analysis Quick Scroll Button */}
                    <div className="flex items-center gap-2 self-start sm:self-auto bg-white p-1.5 rounded-xl border border-slate-200 flex-wrap">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${isResumeUploaded ? 'bg-green-200 text-green-900' : 'bg-slate-200 text-slate-400 shadow-xs'}`}>
                            <span className={`w-4 h-4 rounded-full ${isResumeUploaded ? 'bg-green-600' : 'bg-slate-400'} text-white text-[9px] flex items-center justify-center font-bold`}>
                                1
                            </span>
                            Resume
                        </span>

                        <span className={`${isJobDescriptionAdded ? 'text-green-600' : 'text-slate-300'} font-bold`}>→</span>

                        <span
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${isJobDescriptionAdded ? 'bg-green-200 text-green-900' : 'bg-slate-200 text-slate-400 shadow-xs'
                                }`}
                        >
                            <span className={`w-4 h-4 rounded-full ${isJobDescriptionAdded ? 'bg-green-600' : 'bg-slate-400'} text-white text-[9px] flex items-center justify-center font-bold`}>
                                2
                            </span>
                            Job Description
                        </span>

                        <span className={`${isJobDescriptionAdded ? 'text-green-600' : 'text-slate-300'} font-bold`}>→</span>

                        {/* Ready for Analysis Button */}
                        <button type="button" disabled={!isReadyToAnalyze} onClick={scrollToAnalyzeButton}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${isReadyToAnalyze
                                    ? 'bg-(--primaryBlue) hover:bg-blue-700 text-white shadow-sm cursor-pointer active:scale-95'
                                    : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                                }`}>
                            <Icons name="analyze" size="xs" />
                            <span>Ready for Analysis</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="space-y-6">
                {/* Navigation Tabs Switcher */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-1 flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveTab('resume')}
                            className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${activeTab === 'resume'
                                    ? 'border-(--primaryBlue) text-(--primaryBlue) bg-(--primaryBlue)/5'
                                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                }`}
                        >
                            <Icons name="resume" size="sm" />
                            <span>Resume</span>
                            <span
                                className={`w-2 h-2 rounded-full ${isResumeUploaded ? 'bg-emerald-500' : 'bg-rose-400'
                                    }`}
                            />
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('jobDescription')}
                            className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all border-b-2 cursor-pointer ${activeTab === 'jobDescription'
                                    ? 'border-(--primaryBlue) text-(--primaryBlue) bg-(--primaryBlue)/5'
                                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                }`}
                        >
                            <Icons name="jobIcon" size="sm" />
                            <span>Job Description</span>
                            <span
                                className={`w-2 h-2 rounded-full ${isJobDescriptionAdded ? 'bg-emerald-500' : 'bg-rose-400'
                                    }`}
                            />
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
                                <StatusIndicator
                                    type="resume"
                                    resumeUploaded={isResumeUploaded}
                                    jobDescriptionAdded={isJobDescriptionAdded}
                                />
                            </div>

                            {/* Next / Scroll to Analyze Button */}
                            <button
                                type="button"
                                disabled={!isResumeUploaded}
                                onClick={() => {
                                    if (!isResumeUploaded) return;
                                    if (isReadyToAnalyze) {
                                        scrollToAnalyzeButton();
                                    } else {
                                        setActiveTab('jobDescription');
                                    }
                                }}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                                    !isResumeUploaded
                                        ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                                        : 'bg-(--primaryBlue) hover:bg-blue-700 text-white shadow-xs cursor-pointer active:scale-95'
                                }`}
                            >
                                <span>{isReadyToAnalyze ? 'Scroll to Analyze ↓' : 'Next: Job Description →'}</span>
                            </button>
                        </div>

                        {/* Resume Upload & Preview Side-by-Side (flex gap-16) */}
                        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16">
                            {/* Left: Upload Section */}
                            <div className="w-full lg:w-1/2">
                                <ResumeUpload
                                    selectedFile={resumeFile}
                                    onFileSelect={handleFileSelect}
                                    fileError={fileError}
                                />
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
                                <StatusIndicator
                                    type="jobDescription"
                                    resumeUploaded={isResumeUploaded}
                                    jobDescriptionAdded={isJobDescriptionAdded}
                                />
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
                                    !isJobDescriptionAdded
                                        ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                                        : 'bg-(--primaryBlue) hover:bg-blue-700 text-white shadow-xs cursor-pointer active:scale-95'
                                }`}
                            >
                                <span>{!isResumeUploaded ? '← Back: Add Resume' : 'Scroll to Analyze ↓'}</span>
                            </button>
                        </div>

                        <JobDescriptionForm
                            jobDescription={jobDescription}
                            setJobDescription={setJobDescription}
                            companyName={companyName}
                            setCompanyName={setCompanyName}
                            jobUrl={jobUrl}
                            setJobUrl={setJobUrl}
                        />
                    </div>
                )}

                {/* Bottom Action Bar */}
                <div id="analyze-button-section" className="pt-2">
                    <AnalyzeButton
                        isEnabled={isReadyToAnalyze}
                        onAnalyze={handleAnalyze}
                        isAnalyzing={isAnalyzing}
                        resumeUploaded={isResumeUploaded}
                        jobDescriptionAdded={isJobDescriptionAdded}
                    />
                </div>
            </div>
        </div>
    );
}
