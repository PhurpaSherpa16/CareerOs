import { useState, useEffect, useRef, useCallback } from 'react';
import Icons from '../../../../../utils/Icons';
import { tipsCardData } from '../../../../../data/userDashboard.mock';

export interface StepStatus {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
}

interface AnalysisProgressModalProps {
    isOpen: boolean;
    resumeStatus: StepStatus;
    jobStatus: StepStatus;
    analysisStatus: StepStatus;
    reportId: string | null;
    errorMessage: string | null;
    onViewReport: () => void;
    onRetry?: () => void;
    onClose: () => void;
}

interface StepItemConfig {
    id: string;
    stepNumber: number;
    pendingLabel: string;
    completedLabel: string;
    isPending: boolean;
    isCompleted: boolean;
    isError?: boolean;
}

export default function AnalysisProgressModal({
    isOpen,
    resumeStatus,
    jobStatus,
    analysisStatus,
    reportId,
    errorMessage,
    onViewReport,
    onRetry,
    onClose,
}: AnalysisProgressModalProps) {
    if (!isOpen) return null;

    // Completed only when actual analysis mutation succeeded and report ID is received
    const isCompleted = analysisStatus.isSuccess && Boolean(reportId);

    // Carousel state & timer setup
    const [currentTipIndex, setCurrentTipIndex] = useState<number>(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const totalTips = tipsCardData?.length || 0;

    const resetTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        if (totalTips > 1) {
            timerRef.current = setInterval(() => {
                setCurrentTipIndex((prev) => (prev + 1) % totalTips);
            }, 10000);
        }
    }, [totalTips]);

    useEffect(() => {
        if (isOpen && !isCompleted && !errorMessage && totalTips > 1) {
            resetTimer();
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isOpen, isCompleted, errorMessage, resetTimer, totalTips]);

    const handlePrevTip = () => {
        if (totalTips === 0) return;
        setCurrentTipIndex((prev) => (prev - 1 + totalTips) % totalTips);
        resetTimer();
    };

    const handleNextTip = () => {
        if (totalTips === 0) return;
        setCurrentTipIndex((prev) => (prev + 1) % totalTips);
        resetTimer();
    };

    const handleSelectTip = (index: number) => {
        setCurrentTipIndex(index);
        resetTimer();
    };

    const steps: StepItemConfig[] = [
        {
            id: 'resume',
            stepNumber: 1,
            pendingLabel: 'Uploading your resume...',
            completedLabel: 'Resume uploaded successfully',
            isPending: resumeStatus.isPending,
            isCompleted: resumeStatus.isSuccess,
            isError: resumeStatus.isError,
        },
        {
            id: 'job',
            stepNumber: 2,
            pendingLabel: 'Adding job description...',
            completedLabel: 'Job description added successfully',
            isPending: jobStatus.isPending,
            isCompleted: resumeStatus.isSuccess && jobStatus.isSuccess,
            isError: jobStatus.isError,
        },
        {
            id: 'analysis',
            stepNumber: 3,
            pendingLabel: 'Analyzing your profile...',
            completedLabel: 'Analysis completed successfully',
            isPending: analysisStatus.isPending,
            isCompleted: resumeStatus.isSuccess && jobStatus.isSuccess && isCompleted,
            isError: analysisStatus.isError,
        },
    ];

    return (
        <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="analysis-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn"
        >
            <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto">
                {/* Header */}
                <div className="p-6 sm:p-8 pb-4 sm:pb-6 border-b border-slate-100">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-(--primaryBlue) text-xs font-semibold mb-3">
                                <Icons name="analyze" size="xs" className={!isCompleted && !errorMessage ? "animate-spin" : ""} />
                                <span>
                                    {errorMessage
                                        ? 'Action Needed'
                                        : isCompleted
                                        ? 'Analysis Ready'
                                        : 'AI Match in Progress'}
                                </span>
                            </div>
                            <h3 id="analysis-modal-title" className="text-xl sm:text-2xl font-bold text-(--primaryBlack)">
                                Analyzing Your Resume
                            </h3>
                            <p className="text-xs sm:text-sm text-(--secondaryBlack) mt-1.5 leading-relaxed">
                                We're comparing your resume with the job description to generate your personalized match report.
                            </p>
                        </div>

                        {/* Close button shown ONLY on error when View Report is not available */}
                        {errorMessage && !isCompleted && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                                aria-label="Close modal"
                            >
                                <Icons name="close" size="sm" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-8 space-y-6">
                    {/* Error State Banner with Retry and Try Again Later buttons */}
                    {errorMessage && (
                        <div className="p-5 rounded-2xl bg-red-50/90 border border-red-200 text-center space-y-4 animate-fadeIn">
                            <div className="flex flex-col items-center gap-2">
                                <div className="size-11 rounded-full bg-red-100 text-red-600 flex items-center justify-center shadow-xs">
                                    <Icons name="alert" size="md" className="text-red-500" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-red-900">
                                        Something went wrong. Please try again.
                                    </h4>
                                    {errorMessage && errorMessage !== 'Something went wrong. Please try again.' && (
                                        <p className="text-xs text-red-700 mt-1 max-w-md mx-auto leading-relaxed">
                                            {errorMessage}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons: Retry and Try again later */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                                {onRetry && (
                                    <button
                                        type="button"
                                        onClick={onRetry}
                                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-(--primaryBlue) hover:bg-blue-700 text-white shadow-md shadow-(--primaryBlue)/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                    >
                                        <Icons name="repeat" size="xs" />
                                        <span>Retry</span>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                                >
                                    <span>Try again later</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Progress Steps Section */}
                    <div className="space-y-3" aria-label="Analysis progress steps">
                        {steps.map((step) => {
                            const isDone = step.isCompleted;
                            const isActive = step.isPending;

                            return (
                                <div
                                    key={step.id}
                                    className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all ${
                                        isDone
                                            ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-900'
                                            : isActive
                                            ? 'bg-blue-50/70 border-blue-200 ring-2 ring-blue-500/10 text-(--primaryBlue)'
                                            : 'bg-slate-50/70 border-slate-200/60 text-slate-400'
                                    }`}
                                >
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        {/* Status Indicator Icon */}
                                        <div className="shrink-0">
                                            {isDone ? (
                                                <div className="size-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                                                    <Icons name="check" size="xs" className="stroke-3" />
                                                </div>
                                            ) : isActive ? (
                                                <div className="size-7 rounded-full bg-blue-100 text-(--primaryBlue) flex items-center justify-center">
                                                    <svg
                                                        className="size-4 animate-spin text-(--primaryBlue)"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8v8H4z"
                                                        />
                                                    </svg>
                                                </div>
                                            ) : (
                                                <div className="size-7 rounded-full bg-slate-200/80 text-slate-500 text-xs font-bold flex items-center justify-center">
                                                    {step.stepNumber}
                                                </div>
                                            )}
                                        </div>

                                        {/* Label text */}
                                        <div className="min-w-0">
                                            <span
                                                className={`text-xs sm:text-sm font-semibold truncate block ${
                                                    isDone
                                                        ? 'text-emerald-900'
                                                        : isActive
                                                        ? 'text-(--primaryBlack)'
                                                        : 'text-slate-500'
                                                }`}
                                            >
                                                {isDone ? step.completedLabel : step.pendingLabel}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Badge state */}
                                    <div className="shrink-0 text-xs font-medium pl-2">
                                        {isDone && (
                                            <span className="text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                                                Completed
                                            </span>
                                        )}
                                        {isActive && (
                                            <span className="text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                                                In progress
                                            </span>
                                        )}
                                        {!isDone && !isActive && (
                                            <span className="text-slate-400 text-[11px]">
                                                Waiting
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Educational Tips Carousel (Smooth left-to-right slide, hidden when Completed or Errored) */}
                    {!isCompleted && !errorMessage && totalTips > 0 && (
                        <div className="pt-2 space-y-2.5">
                            {/* Header with Navigation Controls */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    <Icons name="bulb" size="xs" className="text-amber-500" />
                                    <span>How CareerOS evaluates your match</span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] font-medium text-slate-400 mr-1 tabular-nums">
                                        {currentTipIndex + 1} / {totalTips}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handlePrevTip}
                                        aria-label="Previous tip"
                                        className="size-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                                    >
                                        <Icons name="left" size="xs" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNextTip}
                                        aria-label="Next tip"
                                        className="size-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
                                    >
                                        <Icons name="right" size="xs" />
                                    </button>
                                </div>
                            </div>

                            {/* Carousel Viewport: Smooth left-to-right horizontal sliding */}
                            <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-50">
                                <div
                                    className="flex transition-transform duration-500 ease-in-out"
                                    style={{ transform: `translateX(-${currentTipIndex * 100}%)` }}
                                >
                                    {tipsCardData?.map((card) => (
                                        <div
                                            key={card.id}
                                            className="w-full shrink-0 p-4 sm:p-5 flex flex-col justify-between min-h-26"
                                        >
                                            <div>
                                                <h4 className="text-xs sm:text-sm font-semibold text-(--primaryBlack)">
                                                    {card.label}
                                                </h4>
                                                <p className="text-xs text-(--secondaryBlack) mt-1.5 leading-relaxed">
                                                    {card.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination Dots */}
                                <div className="flex items-center justify-center gap-1.5 pb-3">
                                    {tipsCardData?.map((tip, idx) => (
                                        <button
                                            key={tip.id}
                                            type="button"
                                            onClick={() => handleSelectTip(idx)}
                                            aria-label={`Go to tip ${idx + 1}`}
                                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                                idx === currentTipIndex
                                                    ? 'w-5 bg-(--primaryBlue)'
                                                    : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Completed State: Primary "View Report →" CTA */}
                    {isCompleted && (
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={onViewReport}
                                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-(--primaryBlue) hover:bg-blue-700 text-white shadow-lg shadow-(--primaryBlue)/25 hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <span>View Report</span>
                                <Icons name="right" size="sm" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
