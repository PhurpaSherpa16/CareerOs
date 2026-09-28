import { Link } from 'react-router-dom';
import Icons from '../../../utils/Icons';
import { formatDistanceToNow } from 'date-fns';

export interface RecommendedJobItem {
  id: string;
  title?: string;
  company?: string;
  date?: string;
  location?: string;
  employmentType?: string;
  salary?: string;
  atsScore?: number;
  requirements?: {
    minimumExperience?: number;
    requiredSkills?: string[];
    preferredSkills?: string[];
    softSkills?: string[];
  };
}

interface RecommendedJobCardProps {
  job: RecommendedJobItem;
}

export default function RecommendedJobCard({ job }: RecommendedJobCardProps) {
  const title = job.title || 'Position';
  const company = job.company || 'Not Specified';
  const location = job.location || 'Remote / Unspecified';
  const employmentType = job.employmentType || 'Full-time';
  const salary = job.salary || 'Competitive';
  const dateAdded = job.date || 'Recently';

  const minExp =
    job.requirements?.minimumExperience !== undefined
      ? `${job.requirements.minimumExperience}+ yrs`
      : 'Not Specified';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-4 space-y-3.5 flex flex-col justify-between">
      <div className="space-y-3.5">
        {/* Top Job Banner */}
        <div className="flex items-start justify-between gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-white shadow-xs border border-slate-200/70 flex items-center justify-center shrink-0 text-slate-800">
              <Icons company={company !== 'Not Specified' ? company : undefined} size="md" />
            </div>
            <div className="space-y-1 min-w-0">
              <h2 className="text-base font-bold text-slate-900 leading-snug truncate">
                {title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-semibold">
                <span className="flex items-center gap-1 text-(--primaryBlue) truncate">
                  <Icons company={company !== 'Not Specified' ? company : undefined} size="xs" />
                  {company}
                </span>
                <span className="text-slate-500 font-medium">Posted {formatDistanceToNow(new Date(dateAdded), { addSuffix: true })}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <Link to="/user-dashboard/new-analysis" className="px-3 py-1.5 bg-(--primaryBlue) hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer shrink-0">
            <Icons name="analyze" size="xs" />
            Analyze
          </Link>
        </div>

        {/* Key Job Specifications Grid (Type, Location, Salary, Experience) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Employment
            </span>
            <p className="text-xs font-bold text-slate-800 truncate">{employmentType}</p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Location
            </span>
            <p className="text-xs font-bold text-slate-800 truncate">{location}</p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Salary
            </span>
            <p className="text-xs font-bold text-emerald-700 truncate">{salary}</p>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-0.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Min Experience
            </span>
            <p className="text-xs font-bold text-slate-800 truncate">{minExp}</p>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="font-mono text-[11px] text-slate-400">ID: {job.id}</span>
        <Link
          to="/user-dashboard/new-analysis"
          className="text-xs font-bold text-(--primaryBlue) hover:underline flex items-center gap-1 cursor-pointer"
        >
          Match with Resume
          <Icons name="right" size="xs" />
        </Link>
      </div>
    </div>
  );
}
