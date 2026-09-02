import { FiBriefcase, FiCheck, FiCopy, FiRefreshCw } from 'react-icons/fi'
import { IoShieldCheckmark } from 'react-icons/io5'

export default function Banner({data, candidateName,jobTitle,fit,handleCopySummary,copied,onReset}:{
    data: any,
    candidateName: string,
    jobTitle: string,
    fit: string,
    handleCopySummary: () => void,
    copied: boolean,
    onReset?: () => void
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow border border-(--purple)/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-(--primaryBlue)/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-(--primaryBlack) border border-white/15">
                <FiBriefcase className="text-(--primaryBlack)" />
                {jobTitle}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-(--purple)/20 text-(--purple) border border-(--purple)/30">
                    <IoShieldCheckmark className="text-(--purple)" />
                {fit}
                </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-(--primaryBlack) tracking-tight">
                Resume Analysis for <span className="text-(--purple)">{candidateName}</span>
            </h1>

            <p className="text-sm text-(--primaryBlack)/60 max-w-2xl leading-relaxed">
                {data.result?.summary}
            </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
            <button onClick={handleCopySummary}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-(--primaryBlack)/10 hover:bg-(--primaryBlack)/20 text-(--primaryBlack) text-xs font-semibold transition-all border border-white/15 cursor-pointer active:scale-95">
                {copied ? <FiCheck className="text-(--primaryBlack)" /> : <FiCopy />}
                {copied ? "Copied!" : "Copy Summary"}
            </button>
            {onReset && (
                <button
                onClick={onReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-(--primaryBlue) hover:bg-indigo-600 text-white text-xs font-semibold transition-all shadow-lg shadow-indigo-500/25 cursor-pointer active:scale-95"
                >
                <FiRefreshCw />
                New Analysis
                </button>
            )}
            </div>
        </div>
    </div>
  )
}
