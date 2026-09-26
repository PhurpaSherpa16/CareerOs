import React from 'react';

export default function CompanyAppliedSkeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse p-1 h-[280px] flex flex-col justify-between">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="h-4 bg-slate-200 rounded w-40"></div>
        <div className="h-3 bg-slate-200 rounded w-20"></div>
      </div>
      
      {/* Vertical Columns Skeleton */}
      <div className="flex items-end justify-between gap-3 h-[200px] pt-4 px-2">
        {[85, 65, 90, 45, 75, 55, 40, 25].map((height, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
            <div className="w-4 h-3 bg-slate-200 rounded"></div>
            <div className="w-full max-w-[32px] bg-slate-100 rounded-t-lg flex items-end overflow-hidden" style={{ height: `${height}%` }}>
              <div className="w-full h-full bg-slate-200 rounded-t-lg"></div>
            </div>
            <div className="w-6 h-6 rounded-lg bg-slate-200 mt-1"></div>
            <div className="w-8 h-2 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
