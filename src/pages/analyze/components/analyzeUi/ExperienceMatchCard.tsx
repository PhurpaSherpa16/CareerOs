import React from "react";
import { FiBriefcase, FiCheckCircle, FiClock, FiStar } from "react-icons/fi";

interface ExperienceMatchCardProps {
  years?: string;
  verified?: boolean;
  role?: string;
  company?: string;
}

export default function ExperienceMatchCard({
  years = "4+ Years",
  verified = true,
  role = "Frontend Developer Intern",
  company = "YouBloom"
}: ExperienceMatchCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl shadow-slate-100/50 flex flex-col justify-between space-y-5">
      {/* Header & Verified Badge */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 text-(--primaryBlue) rounded-xl">
            <FiBriefcase className="text-lg" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Experience Match</h3>
            <p className="text-xs text-slate-400">Background Alignment</p>
          </div>
        </div>

        {verified && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <FiCheckCircle className="text-blue-500" /> Verified
          </span>
        )}
      </div>

      {/* Main Experience Highlight Display */}
      <div className="flex flex-col items-center justify-center py-4 space-y-2 text-center">
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 text-(--primaryBlue) rounded-full shadow-inner border border-indigo-100/80 mb-1">
          <FiClock className="text-3xl" />
        </div>

        <h4 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {years}
        </h4>

        <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
          <FiStar className="text-amber-500 fill-amber-500 text-xs" />
          <span>{role}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">{company}</span>
        </div>
      </div>

      {/* Experience Match Detail Footer */}
      <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 text-center">
        <p className="text-xs text-slate-600 font-medium">
          Frontend internship &amp; project experience directly fits role seniority.
        </p>
      </div>
    </div>
  );
}
