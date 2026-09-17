export const FullOutlinePieChart = ({ value = 82, total = 100, label='' }: { value: number; total: number, label?: string }) => {
  const radius = 20;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius; // ~125.66
  const safeValue = Math.min(total, Math.max(0, value));
  const strokeDashoffset = circumference - (safeValue / total) * circumference;

  return (
    <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 56 56" className="transform -rotate-90">
        <defs>
          <linearGradient id="fullPieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          strokeDasharray="4, 2"
        />
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="url(#fullPieGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-xl font-extrabold text-slate-800 tracking-tight">{value}</span>
        <span className="text-[10px] font-extrabold text-slate-400 tracking-tight">{label}</span>
      </div>
    </div>
  );
};