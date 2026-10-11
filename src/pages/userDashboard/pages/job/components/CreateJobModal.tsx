import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@clerk/react';
import { useQueryClient } from '@tanstack/react-query';
import Icons from '../../../../../utils/Icons';
import { FaWandMagicSparkles } from 'react-icons/fa6';
import { FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi';
import usePost from '../../../../../hooks/Post';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (createdJobId?: string) => void;
}

interface JobUploadResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    title: string;
    company?: string;
    jobUrl?: string;
    description: string;
    [key: string]: unknown;
  };
}

const SAMPLE_JOB = {
  title: 'Senior Frontend Engineer',
  company: 'TechCorp Global',
  jobUrl: 'https://careers.techcorp.com/jobs/senior-frontend-engineer',
  description: `About the Role:
We are looking for a Senior Frontend Engineer to build high-performance, responsive web applications using React, TypeScript, and Next.js. You will collaborate closely with UI/UX designers, backend engineers, and product managers to deliver seamless user experiences.

Key Responsibilities:
- Design, build, and maintain scalable web user interfaces using modern React and TypeScript.
- Optimize frontend web performance, ensuring sub-second page loads and fast user interactions.
- Architect state management, asynchronous data fetching with TanStack Query, and robust error handling.
- Write unit, integration, and end-to-end tests to maintain high code coverage and reliability.
- Participate in code reviews, mentor junior engineers, and champion engineering best practices.

Requirements:
- 4+ years of hands-on experience in web development using JavaScript/TypeScript and React.
- Strong proficiency with CSS, modern styling libraries (Tailwind CSS), and responsive design principles.
- Experience with server-side rendering, REST APIs, GraphQL, and modern build tooling.
- Solid understanding of Git, CI/CD pipelines, and web accessibility standards (WCAG).
- Strong communication, problem-solving skills, and a collaborative mindset.`,
};

export default function CreateJobModal({ isOpen, onClose, onSuccess }: CreateJobModalProps) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const [token, setToken] = useState<string>(() => localStorage.getItem('careerOsUserToken') || '');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  // Form Validation & Error state
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccessState, setIsSuccessState] = useState(false);

  // Refresh token if needed
  useEffect(() => {
    if (!token) {
      getToken({ template: 'careeros' })
        .then((t) => {
          if (t) {
            localStorage.setItem('careerOsUserToken', t);
            setToken(t);
          }
        })
        .catch(() => {
          getToken().then((t) => {
            if (t) {
              localStorage.setItem('careerOsUserToken', t);
              setToken(t);
            }
          });
        });
    }
  }, [token, getToken]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const postJobURL = 'job/create';

  const {
    mutateAsync: jobMutateAsync,
    reset: resetJobMutation,
    isPending: isSubmitting,
  } = usePost<FormData, JobUploadResponse>({ url: postJobURL, token: token || '' });

  // Word count calculation
  const wordCount = useMemo(() => {
    const trimmed = jobDescription.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
  }, [jobDescription]);

  const handlePasteSample = () => {
    setJobTitle(SAMPLE_JOB.title);
    setCompanyName(SAMPLE_JOB.company);
    setJobUrl(SAMPLE_JOB.jobUrl);
    setJobDescription(SAMPLE_JOB.description);
    setTitleError(null);
    setDescriptionError(null);
    setServerError(null);
  };

  const handleClear = () => {
    setJobTitle('');
    setCompanyName('');
    setJobUrl('');
    setJobDescription('');
    setTitleError(null);
    setDescriptionError(null);
    setServerError(null);
  };

  const validate = (): boolean => {
    let valid = true;
    setTitleError(null);
    setDescriptionError(null);
    setServerError(null);

    if (!jobTitle.trim()) {
      setTitleError('Job title is required');
      valid = false;
    }

    if (!jobDescription.trim()) {
      setDescriptionError('Job description is required');
      valid = false;
    } else if (wordCount < 50) {
      setDescriptionError(`Please provide more details (${wordCount} words provided, minimum 50 recommended for AI parsing)`);
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      resetJobMutation();
      setServerError(null);

      const formData = new FormData();
      formData.append('title', jobTitle.trim());
      if (companyName.trim()) formData.append('company', companyName.trim());
      if (jobUrl.trim()) formData.append('jobUrl', jobUrl.trim());
      formData.append('description', jobDescription.trim());

      const res = await jobMutateAsync(formData);
      const createdId = res?.data?.data?.id;

      // Invalidate queries to refresh job listings across the dashboard
      queryClient.invalidateQueries({ queryKey: ['jobs'] });

      setIsSuccessState(true);
      setTimeout(() => {
        setIsSuccessState(false);
        handleClear();
        onSuccess?.(createdId);
        onClose();
      }, 1200);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to save job description. Please verify input and try again.';
      setServerError(message);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setTitleError(null);
    setDescriptionError(null);
    setServerError(null);
    setIsSuccessState(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-job-modal-title"
    >
      <div
        className="w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-(--primaryBlue)/10 text-(--primaryBlue) flex items-center justify-center border border-(--primaryBlue)/20 shrink-0">
              <FaWandMagicSparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 id="create-job-modal-title" className="text-base sm:text-lg font-bold text-slate-900">
                Upload New Job Description
              </h2>
              <p className="text-xs text-slate-500 hidden sm:block">
                Add job details to extract requirements, competencies, and calculate match scores with AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePasteSample}
              className="text-[11px] font-semibold text-(--primaryBlue) bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer border border-blue-200/60 hidden sm:inline-flex items-center gap-1"
            >
              <Icons name="copy" size="xs" />
              <span>Fill Sample</span>
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer disabled:opacity-50"
              aria-label="Close modal"
            >
              <Icons name="close" size="sm" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Server Error Alert */}
          {serverError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <FiAlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Unable to save job description</p>
                <p className="text-[11px] text-rose-700 mt-0.5">{serverError}</p>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {isSuccessState && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
              <FiCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">Job description parsed and saved successfully!</span>
            </div>
          )}

          {/* Submitting Loading Overlay */}
          {isSubmitting && (
            <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-900 text-xs flex items-center gap-3 animate-pulse">
              <FiLoader className="w-5 h-5 text-(--primaryBlue) animate-spin shrink-0" />
              <div className="space-y-0.5">
                <p className="font-bold">Analyzing & structuring job description with AI...</p>
                <p className="text-[11px] text-blue-700">Extracting required competencies, responsibilities, and experience requirements.</p>
              </div>
            </div>
          )}

          {/* Input Grid: Title & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Job Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-800">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Frontend Developer"
                value={jobTitle}
                disabled={isSubmitting}
                onChange={(e) => {
                  setJobTitle(e.target.value);
                  if (titleError) setTitleError(null);
                }}
                className={`w-full px-3 py-2 text-xs rounded-xl border ${
                  titleError ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 bg-slate-50'
                } focus:outline-none focus:border-(--primaryBlue) focus:bg-white transition-colors`}
              />
              {titleError && <p className="text-[11px] text-rose-500 font-medium">{titleError}</p>}
            </div>

            {/* Company Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-800">
                Company Name <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Google, Stripe, TechCorp"
                value={companyName}
                disabled={isSubmitting}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-(--primaryBlue) focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Job URL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">
              Job Posting URL <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Icons name="file" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
              <input
                type="url"
                placeholder="https://company.com/careers/job-id"
                value={jobUrl}
                disabled={isSubmitting}
                onChange={(e) => setJobUrl(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-(--primaryBlue) focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Job Description Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-800">
                Job Description & Requirements <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    wordCount >= 100
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : wordCount > 0
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {wordCount} words {wordCount >= 100 ? '✓' : ''}
                </span>
              </div>
            </div>

            <textarea
              rows={8}
              placeholder="Paste full job duties, requirements, technical qualifications, and company overview..."
              value={jobDescription}
              disabled={isSubmitting}
              onChange={(e) => {
                setJobDescription(e.target.value);
                if (descriptionError) setDescriptionError(null);
              }}
              className={`w-full p-3 text-xs rounded-xl border leading-relaxed font-sans ${
                descriptionError ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 bg-slate-50'
              } focus:outline-none focus:border-(--primaryBlue) focus:bg-white transition-colors resize-y`}
            />
            {descriptionError && <p className="text-[11px] text-rose-500 font-medium">{descriptionError}</p>}
            <p className="text-[11px] text-slate-400">
              Tip: Include responsibilities and requirements for optimal ATS skills extraction and matching.
            </p>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>AI powered parser</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isSubmitting || !jobTitle.trim() || !jobDescription.trim()}
              onClick={handleSubmit}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                isSubmitting || !jobTitle.trim() || !jobDescription.trim()
                  ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                  : 'bg-(--primaryBlue) hover:bg-blue-700 text-white shadow-(--primaryBlue)/25 cursor-pointer active:scale-98'
              }`}
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="w-3.5 h-3.5 animate-spin" />
                  <span>Structuring...</span>
                </>
              ) : (
                <>
                  <FaWandMagicSparkles className="w-3.5 h-3.5" />
                  <span>Save & Structure Job</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
