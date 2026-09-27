import React, { useState } from 'react';
import Icons from '../../../../../utils/Icons';
import { Card } from '../../../../../components/Card.UserDashboard';

interface JobDescriptionFormProps {
  jobDescription: string;
  setJobDescription: (val: string) => void;
  companyName: string;
  setCompanyName: (val: string) => void;
  jobUrl: string;
  setJobUrl: (val: string) => void;
}

export default function JobDescriptionForm({
  jobDescription,
  setJobDescription,
  companyName,
  setCompanyName,
  jobUrl,
  setJobUrl,
}: JobDescriptionFormProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const wordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;
  const charCount = jobDescription.length;
  const isMinWordsMet = wordCount >= 100;

  return (
    <Card>
      <div className="p-6 space-y-6">
        {/* Header toolbar */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-(--primaryBlue)/10 text-(--primaryBlue) flex items-center justify-center shrink-0 border border-(--primaryBlue)/10">
              <Icons name="jobIcon" size="sm" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-(--primaryBlack)">Job Posting Details</h4>
              <p className="text-xs text-slate-500">
                Paste the job description (minimum 100 words) and optional company info to run deep AI keyword benchmarking.
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-slate-400 hover:text-(--primaryBlue) transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
            >
              <Icons name="alert" size="xs" />
              <span>Matching Info</span>
            </button>
            {showTooltip && (
              <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-slate-900 text-white text-[11px] rounded-xl shadow-xl z-30 pointer-events-none space-y-1">
                <p className="font-semibold text-emerald-400">AI Match Engine</p>
                <p className="text-slate-300 leading-relaxed">
                  The AI compares your resume's skills, keywords, and experience against key requirements extracted from this text.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          {/* Job Description Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="job-description-input"
                className="text-xs font-bold text-(--primaryBlack) flex items-center gap-1.5"
              >
                <span>Job Description Text</span>
                <span className="text-rose-500">*</span>
              </label>
            </div>

            <textarea
              id="job-description-input"
              rows={9}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste complete job description here (minimum 100 words required for accurate ATS keyword parsing)..."
              className={`w-full p-4 text-xs sm:text-sm text-(--primaryBlack) bg-slate-50/50 border rounded-xl focus:bg-white focus:ring-2 transition-all outline-none resize-y min-h-[200px] ${
                wordCount > 0 && !isMinWordsMet
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : isMinWordsMet
                  ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20'
                  : 'border-slate-200 focus:border-(--primaryBlue) focus:ring-(--primaryBlue)/20'
              }`}
            />

            {/* Word Count Showcase & Min 100 Words Validation */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-0.5">
              <div>
                {wordCount > 0 && !isMinWordsMet && (
                  <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                    <Icons name="alert" size="xs" /> Need at least 100 words for ATS parsing (add {100 - wordCount} more words).
                  </p>
                )}
                {isMinWordsMet && (
                  <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <Icons name="check" size="xs" /> Minimum 100 words met! Good length for analysis.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto">
                {wordCount === 0 ? (
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                    0/100 words • Target: 150-800 words
                  </span>
                ) : !isMinWordsMet ? (
                  <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200 flex items-center gap-1">
                    <Icons name="cross" size="xs" />
                    {wordCount}/100 words ({charCount} chars)
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                    <Icons name="check" size="xs" />
                    {wordCount}/100 words met • {charCount} chars
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Company Name & Job URL grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company Name */}
            <div className="space-y-1.5">
              <label htmlFor="company-name-input" className="text-xs font-bold text-(--primaryBlack)">
                Company Name <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-slate-400 pointer-events-none">
                  <Icons name="office" size="sm" />
                </div>
                <input
                  id="company-name-input"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Google, Stripe, Microsoft"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm text-(--primaryBlack) bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-(--primaryBlue) focus:ring-2 focus:ring-(--primaryBlue)/20 transition-all outline-none"
                />
              </div>
            </div>

            {/* Job URL */}
            <div className="space-y-1.5">
              <label htmlFor="job-url-input" className="text-xs font-bold text-(--primaryBlack)">
                Job Posting URL <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-slate-400 pointer-events-none">
                  <Icons name="link" size="sm" />
                </div>
                <input
                  id="job-url-input"
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://company.com/careers/job-123"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm text-(--primaryBlack) bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-(--primaryBlue) focus:ring-2 focus:ring-(--primaryBlue)/20 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Helpful Tips Card */}
          <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Icons name="light" size="xs" className="text-amber-500" />
              <span>Optimization Advice for Job Descriptions</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Include the full job description text rather than just a summary. The AI extracts hard skills, soft skills, certifications, and years of experience to calculate exact keyword density and ATS match score.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
