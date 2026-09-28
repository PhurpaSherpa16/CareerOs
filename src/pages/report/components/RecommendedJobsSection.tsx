import { useState, useRef, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight, FiBriefcase, FiAlertCircle } from 'react-icons/fi';
import RecommendedJobCard, { type RecommendedJobItem } from './RecommendedJobCard';
import { dashboardMockData } from '../../../data/userDashboard.mock';
import { Heading } from '../../../components/Heading.UserDashboard';

interface RecommendedJobsSectionProps {
  jobs?: RecommendedJobItem[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

// Card width + gap in px — must match the inline style below
const CARD_WIDTH = 360;
const CARD_GAP = 16;
const STEP = CARD_WIDTH + CARD_GAP;

export default function RecommendedJobsSection({
  jobs = dashboardMockData.latestJobs as RecommendedJobItem[],
  isLoading = false,
  isError = false,
  onRetry,
}: RecommendedJobsSectionProps) {
  // ── Loading ─────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-4 pt-4">
        <Heading label="Recommended Jobs" />
        <div className="flex gap-4 overflow-hidden pt-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-[320px] sm:w-90 shrink-0 bg-slate-100 border border-slate-200/80 rounded-2xl p-4 space-y-4 animate-pulse"
            >
              <div className="h-16 bg-slate-200 rounded-xl" />
              <div className="grid grid-cols-2 gap-2.5">
                <div className="h-12 bg-slate-200 rounded-lg" />
                <div className="h-12 bg-slate-200 rounded-lg" />
                <div className="h-12 bg-slate-200 rounded-lg" />
                <div className="h-12 bg-slate-200 rounded-lg" />
              </div>
              <div className="h-8 bg-slate-200 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="space-y-4 pt-4">
        <Heading label="Recommended Jobs" />
        <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
          <FiAlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-800">Failed to load recommended jobs</h4>
            <p className="text-xs text-slate-500">
              We encountered an error loading recommended jobs for your report.
            </p>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Empty ────────────────────────────────────────────────────────────────
  if (!jobs || jobs.length === 0) {
    return (
      <div className="space-y-4 pt-4">
        <Heading label="Recommended Jobs" />
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-2">
          <FiBriefcase className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">No Recommended Jobs</h4>
          <p className="text-xs text-slate-500">
            There are currently no recommended jobs matching this analysis.
          </p>
        </div>
      </div>
    );
  }

  return <CarouselBody jobs={jobs} />;
}

function CarouselBody({ jobs }: { jobs: RecommendedJobItem[] }) {
  const hasMultipleJobs = jobs.length >= 2;
  const count = jobs.length;
  const CLONES = 3;
  const extendedList: RecommendedJobItem[] = [
    ...jobs.slice(-CLONES),
    ...jobs,
    ...jobs.slice(0, CLONES),
  ];
  const [slot, setSlot] = useState(CLONES);
  const [isAnimating, setIsAnimating] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);

  // Real index for indicator dots (0-based within original jobs)
  const realIndex = ((slot - CLONES) % count + count) % count;

  const goToSlot = useCallback(
    (targetSlot: number, animated = true) => {
      setIsAnimating(animated);
      setSlot(targetSlot);
    },
    []
  );

  const handleNext = () => {
    if (!hasMultipleJobs) return;
    goToSlot(slot + 1, true);
  };

  const handlePrev = () => {
    if (!hasMultipleJobs) return;
    goToSlot(slot - 1, true);
  };

  const handleDotClick = (idx: number) => {
    goToSlot(idx + CLONES, true);
  };

  /** After the CSS transition ends, silently snap from clone → real card */
  const handleTransitionEnd = () => {
    // Real items occupy slots [CLONES .. CLONES + count - 1]
    const firstReal = CLONES;
    const lastReal = CLONES + count - 1;

    if (slot > lastReal) {
      // Landed on a trailing clone → snap to the matching real slot
      setIsAnimating(false);
      setSlot(firstReal + (slot - lastReal - 1));
    } else if (slot < firstReal) {
      // Landed on a leading clone → snap to the matching real slot
      setIsAnimating(false);
      setSlot(lastReal - (firstReal - slot - 1));
    }
  };

  const translateX = slot * STEP;

  return (
    <div className="relative space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-8">
        <div className='flex items-center gap-2 pt-4 w-full'>
          <span className='w-56 text-sm text-(--secondaryBlack) font-semibold'>Recommended Jobs</span>
          <hr className='w-full h-px border-slate-200'/>
        </div>


        {/* Header Controls — only when >= 2 jobs */}
        {hasMultipleJobs && (
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {realIndex + 1} of {count}
            </span>
          </div>
        )}
      </div>

      {/* Carousel Track */}
      <div className="relative flex items-center justify-center gap-4">
        {/* Left flanking arrow */}
        {hasMultipleJobs && (
          <button type="button" onClick={handlePrev} aria-label="Previous Job"
            className="hidden md:flex p-3 rounded-full bg-white border border-slate-200 text-slate-600 
            hover:bg-indigo-50 hover:text-(--primaryBlue) hover:border-indigo-200 shadow-md transition-all 
            cursor-pointer shrink-0 active:scale-95 z-10">
            <FiChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Viewport */}
        <div className="w-full overflow-hidden py-1">
          <div ref={trackRef} onTransitionEnd={handleTransitionEnd} className={isAnimating ? 'flex gap-4 transition-transform duration-500 ease-in-out' : 'flex gap-4'}
            style={{ transform: `translateX(-${translateX}px)` }}>
            {extendedList.map((job, idx) => (
              <div key={`${job.id}-${idx}`} className="shrink-0" style={{width: `${CARD_WIDTH}px`}}>
                <RecommendedJobCard job={job} />
              </div>
            ))}
          </div>
        </div>

        {/* Right flanking arrow */}
        {hasMultipleJobs && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Job"
            className="hidden md:flex p-3 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-(--primaryBlue) hover:border-indigo-200 shadow-md transition-all cursor-pointer shrink-0 active:scale-95 z-10"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Dots — only when >= 2 jobs */}
      {hasMultipleJobs && (
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {jobs.map((job, idx) => (
            <button
              key={job.id || idx}
              type="button"
              onClick={() => handleDotClick(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${realIndex === idx
                ? 'w-6 bg-(--primaryBlue)'
                : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
