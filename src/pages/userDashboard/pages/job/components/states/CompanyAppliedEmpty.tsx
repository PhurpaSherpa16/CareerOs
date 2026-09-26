import React from 'react';
import Icons from '../../../../../../utils/Icons';

interface CompanyAppliedEmptyProps {
  onAction?: () => void;
  message?: string;
}

export default function CompanyAppliedEmpty({ onAction, message = 'No company application records found yet.' }: CompanyAppliedEmptyProps) {
  return (
    <div className="w-full py-10 px-4 text-center space-y-3 flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-slate-200/80">
      <div className="w-10 h-10 rounded-full bg-slate-200/70 text-slate-500 flex items-center justify-center">
        <Icons name="office" size="md" />
      </div>
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-slate-800">No Data Available</h4>
        <p className="text-[11px] text-slate-500 max-w-xs">{message}</p>
      </div>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-(--primaryBlue) hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Icons name="job" size="xs" />
          Track New Application
        </button>
      )}
    </div>
  );
}
