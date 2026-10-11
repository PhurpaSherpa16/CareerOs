import { Card } from '../../../../../components/Card.UserDashboard';
import Skeleton from '../../../../../components/ui/Skeleton';

export default function JobListSkeleton() {
  return (
    <Card>
      <div className="flex flex-col lg:flex-row gap-0 w-full min-h-160">
        {/* Left Column Skeleton */}
        <div className="w-full lg:w-96 lg:min-w-85 p-5 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between space-y-4">
          <div className="space-y-4 flex-1 pr-1">
            {/* Header */}
            <div className="space-y-3 border-b border-slate-200 pb-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-20" />
              </div>
              {/* Search Bar Skeleton */}
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>

            {/* List Item Cards Skeleton */}
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/50 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-3.5 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <Skeleton className="h-2.5 w-20" />
                    <Skeleton className="h-2.5 w-14" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Skeleton */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-7 w-7 rounded-lg" />
              <Skeleton className="h-7 w-7 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Right Column Skeleton: Detailed Job View */}
        <div className="flex-1 p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Top Bar Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-52" />
                  <Skeleton className="h-3.5 w-36" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-28 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-lg" />
              </div>
            </div>

            {/* Metrics Chips Row */}
            <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 pb-4">
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-8 w-28 rounded-md" />
              <Skeleton className="h-8 w-32 rounded-md" />
              <Skeleton className="h-6 w-24 rounded-md ml-auto" />
            </div>

            {/* Summary Section Skeleton */}
            <div className="space-y-2.5 border-b border-slate-200 pb-5">
              <Skeleton className="h-3.5 w-44" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-11/12" />
              <Skeleton className="h-3 w-4/5" />
            </div>

            {/* Required Skills Skeleton */}
            <div className="space-y-3 border-b border-slate-200 pb-5">
              <Skeleton className="h-3.5 w-36" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-6 w-20 rounded-md" />
                ))}
              </div>
            </div>

            {/* Preferred Skills Skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-3.5 w-36" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-6 w-24 rounded-md" />
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer Skeleton */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <Skeleton className="h-3 w-36" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-32 rounded-lg" />
              <Skeleton className="h-8 w-28 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
