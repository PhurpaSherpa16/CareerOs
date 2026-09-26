import React from 'react';
import Icons from '../../../../../../utils/Icons';

interface CompanyAppliedErrorProps {
  onRetry?: () => void;
  message?: string;
}

export default function CompanyAppliedError({ onRetry, message = 'Failed to load applied company data.' }: CompanyAppliedErrorProps) {
  return (
    <div className="w-full py-10 px-4 text-center space-y-3 flex flex-col items-center justify-center bg-red-50/50 rounded-xl border border-red-100">
      <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
        <Icons name="alert" size="md" />
      </div>
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-slate-800">Data Fetch Error</h4>
        <p className="text-[11px] text-slate-500 max-w-xs">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Icons name="repeat" size="xs" />
          Retry Loading
        </button>
      )}
    </div>
  );
}
