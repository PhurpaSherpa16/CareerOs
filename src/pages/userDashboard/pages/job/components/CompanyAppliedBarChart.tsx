import { Card } from '../../../../../components/Card.UserDashboard';
import Icons from '../../../../../utils/Icons';
import CompanyAppliedSkeleton from './states/CompanyAppliedSkeleton';
import CompanyAppliedError from './states/CompanyAppliedError';
import CompanyAppliedEmpty from './states/CompanyAppliedEmpty';

export interface CompanyAppliedItem {
  id?: string;
  name: string;
  applied_count: number;
  icon: string;
  category?: string;
}

export const appliedCompaniesMock: CompanyAppliedItem[] = [
  { id: '1', name: 'Google', applied_count: 14, icon: 'google', category: 'Tech Giant' },
  { id: '2', name: 'Netflix', applied_count: 11, icon: 'netflix', category: 'Streaming' },
  { id: '3', name: 'Amazon', applied_count: 9, icon: 'amazon', category: 'Cloud & Commerce' },
  { id: '4', name: 'Microsoft', applied_count: 8, icon: 'microsoft', category: 'Software' },
  { id: '5', name: 'Meta', applied_count: 7, icon: 'meta', category: 'Social Media' },
  { id: '6', name: 'Apple', applied_count: 6, icon: 'apple', category: 'Hardware' },
  { id: '7', name: 'Uber', applied_count: 5, icon: 'uber', category: 'Mobility' },
  { id: '8', name: 'Spotify', applied_count: 4, icon: 'spotify', category: 'Streaming' },
];

interface CompanyAppliedBarChartProps {
  data?: CompanyAppliedItem[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  selectedCompany?: string;
  onSelectCompany?: (companyName: string) => void;
}

export default function CompanyAppliedBarChart({
  data = appliedCompaniesMock,
  isLoading = false,
  error = null,
  onRetry,
  selectedCompany,
  onSelectCompany,
}: CompanyAppliedBarChartProps) {
  const maxCount = Math.max(...(data?.map((item) => item.applied_count) || [1]), 1);
  const totalApplications = data?.reduce((acc, curr) => acc + curr.applied_count, 0) || 0;

  // Bar vertical gradient pairs
  const barGradients = [
    'from-blue-600 to-indigo-500',
    'from-emerald-600 to-teal-500',
    'from-purple-600 to-indigo-500',
    'from-amber-600 to-orange-500',
    'from-pink-600 to-rose-500',
    'from-cyan-600 to-blue-500',
    'from-slate-800 to-slate-600',
    'from-violet-600 to-purple-500',
  ];

  return (
    <Card>
      <div className="p-5 space-y-4 h-full flex flex-col justify-between min-h-90">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-(--primaryBlue)/10 text-(--primaryBlue)">
              <Icons name="report" size="sm" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Applied Companies Breakdown</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {totalApplications} total applications tracked across {data?.length || 0} target companies
              </p>
            </div>
          </div>

          {selectedCompany && (
            <button
              type="button"
              onClick={() => onSelectCompany && onSelectCompany('')}
              className="text-[11px] font-bold text-(--primaryBlue) bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer border border-blue-200"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Edgecase Rendering: Loading, Error, Empty, or Vertical Bar Graph */}
        {isLoading ? (
          <CompanyAppliedSkeleton />
        ) : error ? (
          <CompanyAppliedError onRetry={onRetry} message={error} />
        ) : !data || data.length === 0 ? (
          <CompanyAppliedEmpty message="No company applications recorded yet." />
        ) : (
          /* Vertical Bar Chart Container */
          <div className="flex-1 flex flex-col justify-end space-y-2 py-2">
            <div className="flex items-end justify-between gap-2 sm:gap-3 h-52.5 px-1 pt-6 pb-1">
              {data.map((item, index) => {
                const heightPercent = Math.max(Math.round((item.applied_count / maxCount) * 100), 14);
                const isSelected = selectedCompany?.toLowerCase() === item.name.toLowerCase();
                const gradientClass = barGradients[index % barGradients.length];

                return (
                  <div
                    key={item.id || item.name}
                    onClick={() => onSelectCompany && onSelectCompany(item.name)}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                    title={`${item.name}: ${item.applied_count} applied`}
                  >
                    {/* Applied Count Badge above Bar */}
                    <div
                      className={`text-[10px] font-extrabold mb-1 px-1.5 py-0.5 rounded transition-transform group-hover:-translate-y-0.5 ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-(--primaryBlue)'
                      }`}
                    >
                      {item.applied_count}
                    </div>

                    {/* Vertical Bar Track & Animated Fill */}
                    <div className="w-full max-w-9 bg-slate-100/90 rounded-t-xl overflow-hidden flex items-end h-full border border-slate-200/50">
                      <div
                        className={`w-full rounded-t-xl bg-linear-to-t ${gradientClass} transition-all duration-500 ease-out group-hover:brightness-110 ${
                          isSelected ? 'ring-2 ring-blue-500 ring-offset-1 font-bold' : 'opacity-90 group-hover:opacity-100'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                    </div>

                    {/* Company Icon & Name Below Bar */}
                    <div className="flex flex-col items-center gap-0.5 mt-2 shrink-0">
                      <div
                        className={`w-6 h-6 rounded-lg bg-white border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-(--primaryBlue) shadow-xs ring-1 ring-(--primaryBlue)/40'
                            : 'border-slate-200 group-hover:border-slate-300'
                        }`}
                      >
                        <Icons logo={item.icon} size="xs" />
                      </div>
                      <span
                        className={`text-[10px] font-semibold text-center truncate max-w-12 ${
                          isSelected ? 'text-(--primaryBlue) font-bold' : 'text-slate-600 group-hover:text-slate-900'
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Summary Info */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>Top target: <strong className="text-slate-700 font-bold">{data[0]?.name || 'N/A'}</strong> ({data[0]?.applied_count || 0} applied)</span>
          <span>Click column to filter details</span>
        </div>
      </div>
    </Card>
  );
}
