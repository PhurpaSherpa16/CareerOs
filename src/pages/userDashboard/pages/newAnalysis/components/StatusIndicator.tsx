import { useState } from 'react';
import Icons, { type IconName } from '../../../../../utils/Icons';

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

  const renderStatus = (
    statusType: 'resume' | 'jobDescription'
  ) => {
    const isResume = statusType === 'resume';
    const isComplete = isResume
      ? resumeUploaded
      : jobDescriptionAdded;

    const config :{
      key:string,
      label:string,
      tooltipTitle:string,
      icon:IconName,
      successMessage:string,
      errorMessage:string
    } = isResume
      ? {
          key: 'resume',
          label: isComplete ? 'Resume Added' : 'Add Resume',
          tooltipTitle: 'Resume Input Status',
          icon: 'resume',
          successMessage:
            'Your resume file has been selected and validated. You can preview or replace it at any time.',
          errorMessage:
            'Upload a PDF, DOCX, or TXT resume to enable ATS keyword extraction and match comparison.',
        }
      : {
          key: 'jd',
          label: isComplete
            ? 'Job Description Added'
            : 'Add Job Description',
          tooltipTitle: 'Job Description Status',
          icon: 'jobIcon',
          successMessage:
            'Job description details entered. Ready for skill benchmarking and gap analysis.',
          errorMessage:
            'Paste target job requirements and responsibilities to compare against your resume.',
        };

    return (
      <div className="relative inline-flex items-center">
        <div
          onMouseEnter={() => setActiveTooltip(config.key)}
          onMouseLeave={() => setActiveTooltip(null)}
          className={`flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            isComplete
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xs'
              : 'bg-rose-50 border-rose-200 text-rose-700 shadow-xs'
          }`}
        >
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
              isComplete
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            <Icons name={isComplete ? 'check' : 'cross'} size="xs"/>
          </span>

          <span>{config.label}</span>
        </div>

        {activeTooltip === config.key && (
          <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-slate-900 text-white text-[11px] rounded-xl shadow-xl z-30 pointer-events-none space-y-1">
            <div
              className={`font-bold flex items-center gap-1 ${
                isComplete
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }`}
            >
              <Icons name={config?.icon} size="xs" />
              {config.tooltipTitle}
            </div>

            <p className="text-slate-300 leading-relaxed">
              {isComplete
                ? config?.successMessage
                : config?.errorMessage}
            </p>
          </div>
        )}
      </div>
    );
  };

  if (type === 'resume') {
    return (
      <div className={`inline-block ${className}`}>
        {renderStatus('resume')}
      </div>
    );
  }

  if (type === 'jobDescription') {
    return (
      <div className={`inline-block ${className}`}>
        {renderStatus('jobDescription')}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {renderStatus('resume')}
      {renderStatus('jobDescription')}
    </div>
  );
}
