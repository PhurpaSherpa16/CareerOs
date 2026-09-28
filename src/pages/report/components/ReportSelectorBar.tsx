import Icons from '../../../utils/Icons';

interface AnalysisItem {
  id: string;
  atsScore?: number;
  jobMatch?: number;
  createdAt?: string;
  jobId?: string;
  resumeId?: string;
}

interface ReportSelectorBarProps {
  analyses: AnalysisItem[];
  currentId: string;
  onSelect: (id: string) => void;
  jobs: any[];
}

export default function ReportSelectorBar({
  analyses,
  currentId,
  onSelect,
  jobs,
}: ReportSelectorBarProps) {
  if (analyses.length <= 1) return null;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-(--primaryBlue)" />
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Available Reports ({analyses.length})
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
        {analyses.map((item) => {
          const isSelected = item.id === currentId;
          const relatedJob = jobs.find((j) => j.id === item.jobId);
          const jobTitle = relatedJob?.title || item.id;
          const company = relatedJob?.company;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-(--primaryBlue) text-white border-(--primaryBlue) shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {company && (
                <Icons
                  company={company}
                  size="xs"
                />
              )}
              <span className="truncate max-w-32">{jobTitle}</span>
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {item.atsScore}%
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
