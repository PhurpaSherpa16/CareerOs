import { useState } from 'react';
import { FiCopy, FiCheck, FiRefreshCw, FiFileText, FiDownload } from 'react-icons/fi';
import Icons from '../../../utils/Icons';
import { FaWandMagicSparkles } from 'react-icons/fa6';

interface AICoverLetterTabProps {
    analysis: any;
    resume: any;
    job: any;
}

export default function AICoverLetterTab({ analysis, resume, job }: AICoverLetterTabProps) {
    const [generating, setGenerating] = useState(false);
    const [copied, setCopied] = useState(false);
    // Store generated cover letters keyed by analysis ID so they persist during session
    const [generatedLetters, setGeneratedLetters] = useState<Record<string, string>>({});

    if (!analysis) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <FiFileText className="w-10 h-10 mb-2 stroke-1" />
                <p className="text-sm">Select an analysis to view or generate an AI Cover Letter</p>
            </div>
        );
    }

    const analysisId = analysis.id || 'default-analysis';
    const jobTitle = job?.title || 'Target Position';
    const companyName = job?.company || 'Target Company';
    const candidateName = resume?.title ? resume.title.replace(' Resume', '') : 'Phurpa Sherpa';
    const matchedSkills = (analysis.matchedSkills || ['React', 'TypeScript', 'Tailwind CSS']).slice(0, 5).join(', ');

    const existingLetter = generatedLetters[analysisId];

    const generateCoverLetterText = () => {
        return `Dear Hiring Team at ${companyName},

I am writing to express my enthusiastic interest in the ${jobTitle} position. Having reviewed the role requirements alongside my background in software development and frontend engineering, I am confident that my experience aligns strongly with ${companyName}'s current technical goals.

Throughout my experience working on modern web applications, I have focused heavily on building scalable, performant user interfaces using ${matchedSkills}. My hands-on work with modern component architectures, state management, and responsive styling enables me to translate complex requirements into clean, user-centric software.

What excites me most about ${companyName} is your commitment to technical excellence and user impact. In my recent projects, I have demonstrated a proven track record of reducing bundle sizes, improving core web vitals, and collaborating effectively across cross-functional teams to deliver high-quality code on deadline.

I would welcome the opportunity to discuss how my technical skills, problem-solving mindset, and dedication to continuous improvement can add value to your engineering team. Thank you for your time and consideration.

Sincerely,

${candidateName}
Frontend Developer
Email: phurpasherpa@example.com | Phone: +1 (555) 019-2831`;
    };

    const handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => {
            const letter = generateCoverLetterText();
            setGeneratedLetters((prev) => ({
                ...prev,
                [analysisId]: letter,
            }));
            setGenerating(false);
        }, 1200);
    };

    const handleCopy = () => {
        if (!existingLetter) return;
        navigator.clipboard.writeText(existingLetter);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!existingLetter) return;
        const element = document.createElement('a');
        const file = new Blob([existingLetter], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${companyName}_${jobTitle}_Cover_Letter.txt`.replace(/\s+/g, '_');
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="space-y-4 pb-6">
            {!existingLetter && !generating ? (
                /* Empty / Create State */
                <div className="bg-linear-to-br from-indigo-50/60 via-slate-50 to-blue-50/40 border border-slate-200/80 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-xs">
                    <div className="w-12 h-12 rounded-2xl bg-(--primaryBlue)/10 text-(--primaryBlue) flex items-center justify-center shadow-xs">
                        <FaWandMagicSparkles className="w-6 h-6" />
                    </div>

                    <div className="max-w-md space-y-1.5">
                        <h3 className="text-base font-bold text-slate-800">Generate AI Cover Letter</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Create a personalized cover letter tailored specifically to <span className="font-semibold text-slate-700">{jobTitle}</span> at <span className="font-semibold text-slate-700">{companyName}</span> using your matched resume skills.
                        </p>
                    </div>

                    {/* Context tags */}
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px]">
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 font-medium flex items-center gap-1">
                            <Icons name="resumeIcon" size="xs" />
                            {resume?.title || 'Selected Resume'}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 font-medium flex items-center gap-1">
                            <Icons name="jobIcon" size="xs" />
                            {jobTitle}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleGenerate}
                        className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-(--primaryBlue) hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-98"
                    >
                        <FaWandMagicSparkles className="w-4 h-4" />
                        Generate AI Cover Letter
                    </button>
                </div>
            ) : generating ? (
                /* Generating Loader State */
                <div className="bg-white border border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full border-3 border-indigo-100 border-t-(--primaryBlue) animate-spin"></div>
                        <FaWandMagicSparkles className="w-5 h-5 text-(--primaryBlue) absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">Drafting your cover letter...</h4>
                        <p className="text-xs text-slate-500 mt-1">Analyzing job keywords & tailoring experiences for {companyName}</p>
                    </div>
                </div>
            ) : (
                /* Generated Cover Letter Result State */
                <div className="space-y-4">
                    {/* Action Header Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-bold text-slate-700">AI Cover Letter Ready</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleCopy}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                    copied
                                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                {copied ? <FiCheck className="w-3.5 h-3.5" /> : <FiCopy className="w-3.5 h-3.5" />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>

                            <button
                                type="button"
                                onClick={handleDownload}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                            >
                                <FiDownload className="w-3.5 h-3.5" />
                                Download
                            </button>

                            <button
                                type="button"
                                onClick={handleGenerate}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-(--primaryBlue) hover:bg-indigo-100 transition-all cursor-pointer"
                            >
                                <FiRefreshCw className="w-3.5 h-3.5" />
                                Regenerate
                            </button>
                        </div>
                    </div>

                    {/* Paper Document Preview */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs font-sans text-xs text-slate-700 leading-relaxed whitespace-pre-line space-y-3">
                        {existingLetter}
                    </div>
                </div>
            )}
        </div>
    );
}
