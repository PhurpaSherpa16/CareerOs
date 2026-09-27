import React from 'react';
import Icons from '../../../../../utils/Icons';

interface AnalyzeButtonProps {
  isEnabled: boolean;
  onAnalyze: () => void;
  isAnalyzing?: boolean;
  resumeUploaded: boolean;
  jobDescriptionAdded: boolean;
}

export default function AnalyzeButton({
  isEnabled,
  onAnalyze,
  isAnalyzing = false,
  resumeUploaded,
  jobDescriptionAdded,
}: AnalyzeButtonProps) {
  const getDisabledReason = () => {
    if (!resumeUploaded && !jobDescriptionAdded) {
      return 'Please upload a resume and enter a job description to analyze.';
    }
    if (!resumeUploaded) {
      return 'Please upload a resume to proceed with analysis.';
    }
    if (!jobDescriptionAdded) {
      return 'Please enter a job description to proceed with analysis.';
    }
    return '';
  };

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="space-y-0.5 text-center sm:text-left">
        <h4 className="text-sm font-bold text-(--primaryBlack)">Ready for AI Resume & Job Matching?</h4>
        <p className="text-xs text-slate-500">
          {isEnabled
            ? 'Both inputs are complete. Click Analyze to generate your ATS match score & insights.'
            : getDisabledReason()}
        </p>
      </div>

      <button
        type="button"
        disabled={!isEnabled || isAnalyzing}
        onClick={onAnalyze}
        className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md ${
          isEnabled && !isAnalyzing
            ? 'bg-(--primaryBlue) hover:bg-blue-700 text-white shadow-(--primaryBlue)/25 hover:shadow-lg active:scale-[0.98]'
            : 'bg-slate-200 text-slate-400 border border-slate-300 shadow-none cursor-not-allowed'
        }`}
      >
        <Icons name="analyze" size="sm" className={isAnalyzing ? 'animate-spin' : ''} />
        <span>{isAnalyzing ? 'Analyzing Match...' : 'Analyze Resume & Job'}</span>
      </button>
    </div>
  );
}
