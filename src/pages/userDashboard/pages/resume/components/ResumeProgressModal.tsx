import { useState, useEffect, useRef, useCallback } from 'react';
import Icons from '../../../../../utils/Icons';
import { tipsCardData } from '../../../../../data/userDashboard.mock';
import { Link } from 'react-router-dom';

export interface ResumeStepStatus {
    isPending: boolean;
    isSuccess: boolean;
    isError: boolean;
}

interface ResumeProgressModalProps {
    isOpen: boolean;
    resumeStatus: ResumeStepStatus;
    errorMessage?: string | null;
    onRetry?: () => void;
    onClose: () => void;
}

export default function ResumeProgressModal({
    isOpen,
    resumeStatus,
    errorMessage,
    onRetry,
    onClose,
}: ResumeProgressModalProps) {
    if (!isOpen) return null;

    const isCompleted = resumeStatus.isSuccess;
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
            }, 8000);
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

    return (
        <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-modal-title"
            className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn"
        >
            <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto">
                {/* Header */}
                <div className="p-6 sm:p-8 pb-4 sm:pb-6 border-b border-slate-100">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-blue-50 text-(--primaryBlue)">
                                {isCompleted ? (
                                    <>
                                        <Icons name="check" size="xs" className="text-emerald-600" />
                                        <span className="text-emerald-700 font-bold">Uploaded</span>
                                    </>
                                ) : errorMessage ? (
                                    <>
                                        <Icons name="alert" size="xs" className="text-red-500" />
                                        <span className="text-red-700 font-bold">Action Needed</span>
                                    </>
                                ) : (
                                    <>
                                        <Icons name="analyze" size="xs" className="animate-spin text-(--primaryBlue)" />
                                        <span>Upload in Progress</span>
                                    </>
                                )}
                            </div>
                            <h3 id="resume-modal-title" className="text-xl sm:text-2xl font-bold text-(--primaryBlack)">
                                {isCompleted ? 'Resume Uploaded' : errorMessage ? 'Upload Failed' : 'Uploading Your Resume'}
                            </h3>
                            <p className="text-xs sm:text-sm text-(--secondaryBlack) mt-1.5 leading-relaxed">
                                {isCompleted
                                    ? 'Your resume has been parsed and uploaded successfully to your portfolio.'
                                    : errorMessage
                                    ? 'We were unable to complete your resume upload. Please check the details below.'
                                    : "We're parsing your resume text, skills, and extracting key data."}
                            </p>
                        </div>

                        {/* Close button shown on error or completion */}
                        {!resumeStatus.isPending && (
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
                    {/* Error State Banner */}
                    {errorMessage && (
                        <div className="p-5 rounded-2xl bg-red-50/90 border border-red-200 text-center space-y-4 animate-fadeIn">
                            <div className="flex flex-col items-center gap-2">
                                <div className="size-11 rounded-full bg-red-100 text-red-600 flex items-center justify-center shadow-xs">
                                    <Icons name="alert" size="md" className="text-red-500" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-red-900">
                                        Something went wrong during upload.
                                    </h4>
                                    <p className="text-xs text-red-700 mt-1 max-w-md mx-auto leading-relaxed">
                                        {errorMessage}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons: Retry and Cancel */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                                {onRetry && (
                                    <button
                                        type="button"
                                        onClick={onRetry}
                                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-(--primaryBlue) hover:bg-blue-700 text-white shadow-md shadow-(--primaryBlue)/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                    >
                                        <Icons name="repeat" size="xs" />
                                        <span>Retry Upload</span>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step Status Indicator (Single Step for Resume Status) */}
                    <div className="space-y-4">
                        <div
                            className={`p-4 rounded-2xl border transition-all ${
                                resumeStatus.isError
                                    ? 'bg-red-50/50 border-red-200'
                                    : isCompleted
                                    ? 'bg-emerald-50/50 border-emerald-200'
                                    : resumeStatus.isPending
                                    ? 'bg-blue-50/40 border-blue-200 ring-2 ring-blue-500/20 shadow-xs'
                                    : 'bg-slate-50 border-slate-200'
                            }`}
                        >
                            <div className="flex items-center gap-3.5">
                                <div
                                    className={`size-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                                        resumeStatus.isError
                                            ? 'bg-red-100 text-red-600'
                                            : isCompleted
                                            ? 'bg-emerald-100 text-emerald-600'
                                            : resumeStatus.isPending
                                            ? 'bg-(--primaryBlue) text-white shadow-xs'
                                            : 'bg-slate-200 text-slate-500'
                                    }`}
                                >
                                    {resumeStatus.isError ? (
                                        <Icons name="alert" size="xs" />
                                    ) : isCompleted ? (
                                        <Icons name="check" size="sm" />
                                    ) : resumeStatus.isPending ? (
                                        <Icons name="analyze" size="sm" className="animate-spin" />
                                    ) : (
                                        <span>1</span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <h4
                                            className={`text-sm font-semibold truncate ${
                                                resumeStatus.isError
                                                    ? 'text-red-900'
                                                    : isCompleted
                                                    ? 'text-emerald-900'
                                                    : resumeStatus.isPending
                                                    ? 'text-(--primaryBlue)'
                                                    : 'text-slate-700'
                                            }`}
                                        >
                                            Resume Status
                                        </h4>
                                        <span
                                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                                resumeStatus.isError
                                                    ? 'bg-red-100 text-red-700'
                                                    : isCompleted
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : resumeStatus.isPending
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-slate-100 text-slate-500'
                                            }`}
                                        >
                                            {resumeStatus.isError
                                                ? 'Failed'
                                                : isCompleted
                                                ? 'Uploaded'
                                                : resumeStatus.isPending
                                                ? 'Uploading...'
                                                : 'Pending'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                                        {isCompleted
                                            ? 'Uploaded'
                                            : resumeStatus.isPending
                                            ? 'Uploading and parsing your resume...'
                                            : resumeStatus.isError
                                            ? 'Upload encountered an error'
                                            : 'Ready to upload'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Educational Tips Card Carousel (While Pending) */}
                    {resumeStatus.isPending && !errorMessage && totalTips > 0 && (
                        <div className="space-y-2.5 pt-1 animate-fadeIn">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <Icons name="light" size="xs" className="text-amber-500" />
                                    <span>ATS Preparation Tip</span>
                                </span>
                                <div className="flex items-center gap-1">
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

                            <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-50">
                                <div
                                    className="flex transition-transform duration-500 ease-in-out"
                                    style={{ transform: `translateX(-${currentTipIndex * 100}%)` }}
                                >
                                    {tipsCardData?.map((card) => (
                                        <div
                                            key={card.id}
                                            className="w-full shrink-0 p-4 sm:p-5 flex flex-col justify-between min-h-24"
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

                    {/* Completed State Actions */}
                    {isCompleted && (
                        <div className="pt-2 space-y-3 animate-fadeIn">
                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                    <Icons name="check" size="md" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h5 className="text-xs font-bold text-emerald-900">Uploaded</h5>
                                    <p className="text-[11px] text-emerald-700 mt-0.5">
                                        Your resume has been saved. You can now preview it or run a new ATS analysis.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-(--primaryBlue) hover:bg-blue-700 text-white shadow-md shadow-(--primaryBlue)/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                                >
                                    <Icons name="check" size="xs" />
                                    <span>Done</span>
                                </button>
                                <Link
                                    to="/user-dashboard/new-analysis"
                                    onClick={onClose}
                                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Icons name="analyze" size="xs" />
                                    <span>Analyze with Job</span>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
