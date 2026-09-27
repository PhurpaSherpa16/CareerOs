import React, { useState } from 'react';
import Icons from '../../../../../utils/Icons';

interface StatusIndicatorProps {
  type?: 'resume' | 'jobDescription' | 'all';
  resumeUploaded: boolean;
  jobDescriptionAdded: boolean;
  className?: string;
}

export default function StatusIndicator({
  type = 'all',
  resumeUploaded,
  jobDescriptionAdded,
  className = '',
}: StatusIndicatorProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const renderResumeStatus = () => (
    <div className="relative inline-flex items-center">
      <div
        onMouseEnter={() => setActiveTooltip('resume')}
        onMouseLeave={() => setActiveTooltip(null)}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
          resumeUploaded
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xs'
            : 'bg-rose-50 border-rose-200 text-rose-700 shadow-xs'
        }`}
      >
        <span
          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
            resumeUploaded ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}
        >
          <Icons name={resumeUploaded ? 'check' : 'cross'} size="xs" />
        </span>
        <span>{resumeUploaded ? 'Resume Added' : 'Add Resume'}</span>

        {/* Info Icon */}
        <span className="text-slate-400 hover:text-slate-600 cursor-pointer ml-0.5">
          <Icons name="alert" size="xs" />
        </span>
      </div>

      {/* Tooltip Popup */}
      {activeTooltip === 'resume' && (
        <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-slate-900 text-white text-[11px] rounded-xl shadow-xl z-30 pointer-events-none space-y-1">
          <div className="font-bold flex items-center gap-1 text-emerald-400">
            <Icons name="resume" size="xs" /> Resume Input Status
          </div>
          <p className="text-slate-300 leading-relaxed">
            {resumeUploaded
              ? 'Your resume file has been selected and validated. You can preview or replace it at any time.'
              : 'Upload a PDF, DOCX, or TXT resume to enable ATS keyword extraction and match comparison.'}
          </p>
        </div>
      )}
    </div>
  );

  const renderJobDescriptionStatus = () => (
    <div className="relative inline-flex items-center">
      <div
        onMouseEnter={() => setActiveTooltip('jd')}
        onMouseLeave={() => setActiveTooltip(null)}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
          jobDescriptionAdded
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xs'
            : 'bg-rose-50 border-rose-200 text-rose-700 shadow-xs'
        }`}
      >
        <span
          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
            jobDescriptionAdded ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}
        >
          <Icons name={jobDescriptionAdded ? 'check' : 'cross'} size="xs" />
        </span>
        <span>{jobDescriptionAdded ? 'Job Description Added' : 'Add Job Description'}</span>

        {/* Info Icon */}
        <span className="text-slate-400 hover:text-slate-600 cursor-pointer ml-0.5">
          <Icons name="alert" size="xs" />
        </span>
      </div>

      {/* Tooltip Popup */}
      {activeTooltip === 'jd' && (
        <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-slate-900 text-white text-[11px] rounded-xl shadow-xl z-30 pointer-events-none space-y-1">
          <div className="font-bold flex items-center gap-1 text-emerald-400">
            <Icons name="jobIcon" size="xs" /> Job Description Status
          </div>
          <p className="text-slate-300 leading-relaxed">
            {jobDescriptionAdded
              ? 'Job description details entered. Ready for skill benchmarking and gap analysis.'
              : 'Paste target job requirements and responsibilities to compare against your resume.'}
          </p>
        </div>
      )}
    </div>
  );

  if (type === 'resume') {
    return <div className={`inline-block ${className}`}>{renderResumeStatus()}</div>;
  }

  if (type === 'jobDescription') {
    return <div className={`inline-block ${className}`}>{renderJobDescriptionStatus()}</div>;
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {renderResumeStatus()}
      {renderJobDescriptionStatus()}
    </div>
  );
}
