import React, { useState, useEffect } from 'react';
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

export interface JDValidationResult {
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error';
  isValid: boolean;
}

export const validateJobDescription = (text: string): JDValidationResult | null => {
  const trimmed = text.trim();
  if (!trimmed) {
    return null;
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 1. Minimum length 100 words check
  if (wordCount < 100) {
    return {
      type: 'error',
      title: 'Insufficient Word Count',
      message: `Job description must be at least 100 words (currently ${wordCount} words). Add ${100 - wordCount} more words for accurate ATS parsing.`,
      isValid: false,
    };
  }

  // 2. Maximum length 3000 words check
  if (wordCount > 3000) {
    return {
      type: 'error',
      title: 'Maximum Word Limit Exceeded',
      message: `Job description cannot exceed 3,000 words (currently ${wordCount} words). Please reduce the text length.`,
      isValid: false,
    };
  }

  // 3. Check for placeholders or generic template text
  const lowerText = trimmed.toLowerCase();
  const placeholders = [
    'lorem ipsum',
    'insert job description',
    'paste job description',
    'sample job description',
    'asdfasdf',
    'test test test',
    'your job description here',
  ];
  const hasPlaceholder = placeholders.some((p) => lowerText.includes(p));
  if (hasPlaceholder) {
    return {
      type: 'error',
      title: 'Placeholder Content Detected',
      message: 'The pasted text contains generic placeholder terms. Please paste an actual job description.',
      isValid: false,
    };
  }

  // 4. Detect excessive word repetition
  const stopWords = new Set(['the', 'and', 'to', 'a', 'of', 'in', 'is', 'for', 'with', 'on', 'at', 'by', 'this', 'that', 'or', 'an', 'be', 'are', 'as']);
  const freqMap: Record<string, number> = {};
  words.forEach((w) => {
    const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean && !stopWords.has(clean)) {
      freqMap[clean] = (freqMap[clean] || 0) + 1;
    }
  });

  const uniqueWordsCount = Object.keys(freqMap).length;
  if (uniqueWordsCount < 15) {
    return {
      type: 'warning',
      title: 'High Text Repetition',
      message: 'The text appears to repeat the same few words frequently. Ensure complete duties and qualification details are included.',
      isValid: true,
    };
  }

  // 5. Check job-related signals
  const signals = [
    'responsibilities', 'requirements', 'qualifications', 'experience',
    'skills', 'job description', 'role', 'position', 'you will',
    'preferred', 'must have', 'nice to have', 'education', 'benefits',
    'salary', 'remote', 'hybrid', 'developer', 'engineer', 'manager',
    'lead', 'team', 'work'
  ];
  const signalMatches = signals.filter((s) => lowerText.includes(s)).length;

  if (signalMatches === 0) {
    return {
      type: 'warning',
      title: 'Missing Core Job Keywords',
      message: 'No standard job keywords (e.g. responsibilities, requirements, skills) were detected. Including complete job sections improves match quality.',
      isValid: true,
    };
  }

  // 6. Alert at exactly 3000 words max limit
  if (wordCount === 3000) {
    return {
      type: 'warning',
      title: 'Maximum 3,000 Words Limit Reached',
      message: 'You have reached the maximum limit of 3,000 words. Typing has been blocked.',
      isValid: true,
    };
  }

  // 7. Success
  return {
    type: 'success',
    title: 'Job Description Validated',
    message: `Validated ${wordCount} words with ${signalMatches} job signal keywords. Perfect length for AI analysis.`,
    isValid: true,
  };
};

export default function JobDescriptionForm({
  jobDescription,
  setJobDescription,
  companyName,
  setCompanyName,
  jobUrl,
  setJobUrl,
}: JobDescriptionFormProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [jdError, setJdError] = useState<JDValidationResult | null>(null);

  const wordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = jobDescription.length;
  const isMinWordsMet = wordCount >= 100;
  const isMaxWordsReached = wordCount >= 3000;

  useEffect(() => {
    const result = validateJobDescription(jobDescription);
    setJdError(result);
  }, [jobDescription]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const words = val.trim() ? val.trim().split(/\s+/).filter(Boolean) : [];

    // Enforce 3000 words maximum limit
    if (words.length > 3000) {
      const allowedWords = words.slice(0, 3000);
      setJobDescription(allowedWords.join(' '));
    } else {
      setJobDescription(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (wordCount >= 3000) {
      // Allowed keys for deletion, navigation, select all, copy, cut
      const allowedKeys = [
        'Backspace',
        'Delete',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Tab',
        'Home',
        'End',
        'PageUp',
        'PageDown',
      ];
      const isControlShortcut = (e.metaKey || e.ctrlKey) && ['a', 'c', 'x'].includes(e.key.toLowerCase());

      if (!allowedKeys.includes(e.key) && !isControlShortcut) {
        e.preventDefault();
      }
    }
  };

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
                Paste the job description (100 – 3,000 words) and optional company info to run deep AI keyword benchmarking.
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
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Paste complete job description here (100 - 3,000 words required for accurate ATS keyword parsing)..."
              className={`w-full p-4 text-xs sm:text-sm text-(--primaryBlack) bg-slate-50/50 border rounded-xl focus:bg-white focus:ring-2 transition-all outline-none resize-y min-h-50 ${
                isMaxWordsReached
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/20'
                  : jdError?.type === 'error'
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : jdError?.type === 'warning'
                  ? 'border-amber-300 focus:border-amber-500 focus:ring-amber-500/20'
                  : isMinWordsMet
                  ? 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20'
                  : 'border-slate-200 focus:border-(--primaryBlue) focus:ring-(--primaryBlue)/20'
              }`}
            />

            {/* Word Count Showcase & Status Bar */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-0.5">
              <div className="flex items-center gap-2">
                {wordCount === 0 ? (
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                    0/3000 words
                  </span>
                ) : !isMinWordsMet ? (
                  <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200 flex items-center gap-1">
                    <Icons name="cross" size="xs" />
                    {wordCount}/100 min words ({charCount} chars)
                  </span>
                ) : isMaxWordsReached ? (
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-md border border-rose-300 flex items-center gap-1">
                    <Icons name="alert" size="xs" />
                    3000/3000 words (Max Limit Reached)
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                    <Icons name="check" size="xs" />
                    {wordCount}/3000 words • {charCount} chars
                  </span>
                )}

                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                  Target: 100 - 3,000 words
                </span>
              </div>
            </div>

            {/* Showcase JD Validation Message (jdError) */}
            {jdError && (
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                  jdError.type === 'error'
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : jdError.type === 'warning'
                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    jdError.type === 'error'
                      ? 'bg-rose-600 text-white'
                      : jdError.type === 'warning'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  <Icons
                    name={
                      jdError.type === 'error'
                        ? 'cross'
                        : jdError.type === 'warning'
                        ? 'alert'
                        : 'check'
                    }
                    size="xs"
                  />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h5 className="text-xs font-bold leading-tight">{jdError.title}</h5>
                  <p className="text-[11px] leading-relaxed opacity-90">{jdError.message}</p>
                </div>
              </div>
            )}
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
