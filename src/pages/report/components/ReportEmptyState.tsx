import { Link } from 'react-router-dom';
import { FiFileText, FiPlusCircle } from 'react-icons/fi';

interface ReportEmptyStateProps {
  reportId?: string;
}

export default function ReportEmptyState({ reportId }: ReportEmptyStateProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-10 sm:p-16 text-center max-w-xl mx-auto space-y-6 shadow-xs my-8">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-(--primaryBlue) border border-indigo-100 flex items-center justify-center mx-auto shadow-2xs">
        <FiFileText className="w-8 h-8 stroke-1.5" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-800">No Analysis Report Found</h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          {reportId
            ? `We couldn't find an analysis report matching ID "${reportId}". It may have been deleted or the link might be incorrect.`
            : 'No analysis report was selected. Upload your resume and job description to run a new analysis.'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/user-dashboard/all-analysis"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all text-center"
        >
          View All Analyses
        </Link>
        <Link
          to="/user-dashboard/new-analysis"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-(--primaryBlue) hover:bg-blue-700 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs"
        >
          <FiPlusCircle className="w-4 h-4" />
          Create New Analysis
        </Link>
      </div>
    </div>
  );
}
