import React from "react";
import { FiAward, FiCheckCircle } from "react-icons/fi";

interface JobMatchCardProps {
  score?: number;
  fit?: string;
}

export default function JobMatchCard({ score = 82, fit = "Good Fit" }: JobMatchCardProps) {
  // Semi-circle SVG Arc calculations (180 degrees)
  const radius = 65;
  const strokeWidth = 12;
  const arcLength = Math.PI * radius; // Half circumference
  const strokeDashoffset = arcLength - (score / 100) * arcLength;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl shadow-slate-100/50 flex flex-col justify-between space-y-5">
      {/* Header & Relevance Badge */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <FiAward className="text-lg" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Job Match</h3>
            <p className="text-xs text-slate-400">Target Role Parity</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <FiCheckCircle className="text-emerald-500" /> High Relevance
        </span>
      </div>

      {/* Semi-Circle Donut Gauge */}
      <div className="flex flex-col items-center justify-center relative py-2">
        <div className="relative w-48 h-28 flex items-end justify-center overflow-hidden">
          <svg width="200" height="110" viewBox="0 0 200 110" className="overflow-visible">
            <defs>
              <linearGradient id="semiGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

            {/* Background Arc */}
            <path
              d="M 25 100 A 75 75 0 0 1 175 100"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />

            {/* Filled Progress Arc */}
            <path
              d="M 25 100 A 75 75 0 0 1 175 100"
              fill="none"
              stroke="url(#semiGaugeGradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={arcLength}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered Score Inside Semi-Circle */}
          <div className="absolute bottom-1 flex flex-col items-center">
            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {score}<span className="text-base font-bold text-emerald-600">%</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {fit}
            </span>
          </div>
        </div>
      </div>

      {/* Match Strength Description */}
      <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 text-center">
        <p className="text-xs text-slate-600 font-medium">
          Strong alignment with required skills &amp; core technologies.
        </p>
      </div>
    </div>
  );
}
