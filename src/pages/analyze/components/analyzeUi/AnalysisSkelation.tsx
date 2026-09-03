export default function AnalysisSkelation() {
  return (
    <div className="w-full mainDiv max-w-7xl! mx-auto space-y-8 animate-pulse">
        {/* Analyzing Status Message Alert */}
        <div className="w-full bg-linear-to-r from-blue-500/10 via-indigo-500/10 to-emerald-500/10 border border-blue-200/80 rounded-2xl p-4 flex items-center justify-center gap-3 shadow-xs">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0" />
          <p className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
            Analyzing resume &amp; job description... Please wait a moment.
          </p>
        </div>

        {/* Header Verdict Banner Skeleton */}
        <div className="h-48 sm:h-56 w-full bg-slate-200 rounded-3xl" />

        {/* Content Skeleton matching tab & overview structure */}
        <div className="space-y-8">
            {/* Navigation Tabs Skeleton */}
            <div className="flex items-center gap-3">
            <div className="h-10 w-28 bg-slate-200 rounded-2xl" />
            <div className="h-10 w-32 bg-slate-200/70 rounded-2xl" />
            <div className="h-10 w-28 bg-slate-200/70 rounded-2xl" />
            <div className="h-10 w-36 bg-slate-200/70 rounded-2xl" />
            </div>

            {/* Top Row: 4 Quick Scan Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-22 bg-slate-200 rounded-2xl" />
            <div className="h-22 bg-slate-200 rounded-2xl" />
            <div className="h-22 bg-slate-200 rounded-2xl" />
            <div className="h-22 bg-slate-200 rounded-2xl" />
            </div>

            {/* Middle Row: 2 Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-slate-200/90 rounded-3xl" />
            <div className="h-64 bg-slate-200/90 rounded-3xl" />
            </div>

            {/* Bottom Row: 3 Insight Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-40 bg-slate-200/80 rounded-3xl" />
            <div className="h-40 bg-slate-200/80 rounded-3xl" />
            <div className="h-40 bg-slate-200/80 rounded-3xl" />
            </div>
        </div>
    </div>
  )
}
