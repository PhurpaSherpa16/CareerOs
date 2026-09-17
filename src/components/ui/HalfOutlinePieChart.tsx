export const HalfOutlinePieChart = ({ value = 75, color }: { value: number, color: string }) => {
  const radius = 20;
  const strokeWidth = 4;
  const arcLength = Math.PI * radius; // ~62.83
  const safeValue = Math.min(100, Math.max(0, value));
  const strokeDashoffset = arcLength - (safeValue / 100) * arcLength;

  return (
    <div className="relative w-20 h-20 shrink-0 flex flex-col items-center justify-center">
      <svg width="120" height="60" viewBox="0 0 52 30" className="relative overflow-visible">
        <defs>
          <linearGradient id="halfPieGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <path
          d="M 6 26 A 20 20 0 0 1 46 26"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <path
          d="M 6 26 A 20 20 0 0 1 46 26"
          fill="none"
          stroke="url(#halfPieGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute top-10 text-center">
        <span className="text-xl font-extrabold text-slate-800 tracking-tight">{value}%</span>
      </div>
    </div>
  );
};