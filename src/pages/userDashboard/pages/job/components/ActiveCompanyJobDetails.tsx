import React, { useState } from 'react';
import { Card } from '../../../../../components/Card.UserDashboard';
import Icons from '../../../../../utils/Icons';
import { dashboardMockData } from '../../../../../data/userDashboard.mock';
import { useNavigate } from 'react-router-dom';

interface JobItem {
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

interface ActiveCompanyJobDetailsProps {
  selectedCompanyName?: string;
  jobs?: JobItem[];
}

export default function ActiveCompanyJobDetails({
  selectedCompanyName,
  jobs = dashboardMockData.latestJobs as JobItem[],
}: ActiveCompanyJobDetailsProps) {
  const navigate = useNavigate();

  // Filter jobs based on selected company, or default to all / first
  const filteredJobs = selectedCompanyName
    ? jobs.filter((j) => j.company?.toLowerCase() === selectedCompanyName.toLowerCase())
    : jobs;

  const displayJobs = filteredJobs.length > 0 ? filteredJobs : jobs;
  const [activeJobIndex, setActiveJobIndex] = useState(0);

  const activeJob = displayJobs[activeJobIndex] || displayJobs[0] || {};

  // Safeguarded field extraction with explicit 'N/A' and 'Not Specified' fallbacks
  const title = activeJob.title || 'N/A';
  const company = activeJob.company || 'Not Specified';
  const location = activeJob.location || 'N/A';
  const employmentType = activeJob.employmentType || 'Not Specified';
  const salary = activeJob.salary || 'Not Specified';
  const dateAdded = activeJob.date || 'N/A';

  const minExp = activeJob.requirements?.minimumExperience !== undefined
    ? `${activeJob.requirements.minimumExperience}+ yrs`
    : 'Not Specified';

  const requiredSkills = activeJob.requirements?.requiredSkills || [];
  const preferredSkills = activeJob.requirements?.preferredSkills || [];

  return (
    <Card>
      <div className="p-5 space-y-4 h-full flex flex-col justify-between">
        {/* Header & Company Selector Tabs */}
        <div className="space-y-3 border-b border-slate-100 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-(--primaryBlue) border border-blue-200 font-bold text-xs px-3 py-1 rounded-full">
                <Icons name="jobFill" size="xs" />
                Active Job Details
              </span>
              {selectedCompanyName && (
                <span className="text-xs text-slate-500 font-semibold">
                  Filtered by: <strong className="text-slate-900">{selectedCompanyName}</strong>
                </span>
              )}
            </div>

            <span className="text-xs text-slate-400 font-medium">
              {displayJobs.length} {displayJobs.length === 1 ? 'position' : 'positions'}
            </span>
          </div>

          {/* Job position tabs if multiple positions exist */}
          {displayJobs.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {displayJobs.map((job, idx) => (
                <button
                  key={job.id || idx}
                  type="button"
                  onClick={() => setActiveJobIndex(idx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer border ${
                    activeJobIndex === idx
                      ? 'bg-(--primaryBlue) text-white border-(--primaryBlue) shadow-2xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {job.title || 'N/A'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Job Overview Card */}
        <div className="space-y-4 flex-1">
          {/* Top Job Banner */}
          <div className="flex items-start justify-between gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-white shadow-xs border border-slate-200/70 flex items-center justify-center shrink-0 text-slate-800">
                <Icons logo={company !== 'Not Specified' ? company : undefined} size="md" />
              </div>
              <div className="space-y-1 min-w-0">
                <h2 className="text-base font-bold text-slate-900 leading-snug truncate">
                  {title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-semibold">
                  <span className="flex items-center gap-1 text-(--primaryBlue)">
                    <Icons logo={company !== 'Not Specified' ? company : undefined} size="xs" />
                    {company}
                  </span>
                  <span>•</span>
                  <span className="text-slate-500 font-medium">Posted {dateAdded}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              type="button"
              onClick={() => navigate('/user-dashboard/all-analysis')}
              className="px-3 py-1.5 bg-(--primaryBlue) hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              <Icons name="analyze" size="xs" />
              Analyze
            </button>
          </div>

          {/* Key Job Specifications Grid (Type, Location, Salary, Experience) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Employment</span>
              <p className="text-xs font-bold text-slate-800 truncate">{employmentType}</p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Location</span>
              <p className="text-xs font-bold text-slate-800 truncate">{location}</p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Salary</span>
              <p className="text-xs font-bold text-emerald-700 truncate">{salary}</p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Min Experience</span>
              <p className="text-xs font-bold text-slate-800 truncate">{minExp}</p>
            </div>
          </div>

          {/* Key Required Skills Badges */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Icons name="layers" size="xs" className="text-(--primaryBlue)" />
                Required Core Competencies
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {requiredSkills.length > 0 ? `${requiredSkills.length} skills` : 'N/A'}
              </span>
            </div>

            {requiredSkills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {requiredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-slate-800 text-[11px] font-semibold rounded-md border border-slate-200 shadow-2xs"
                  >
                    <Icons logo={skill} size="xs" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No specific skills listed (Not Specified)</p>
            )}
          </div>

          {/* Preferred / Nice-to-Have Skills Badges */}
          {preferredSkills.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-600 block">Preferred Skills:</span>
              <div className="flex flex-wrap gap-1.5">
                {preferredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-medium rounded border border-slate-200"
                  >
                    <Icons logo={skill} size="xs" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            Active position ID: <span className="font-mono text-slate-700">{activeJob.id || 'N/A'}</span>
          </span>
          <button
            type="button"
            onClick={() => navigate('/user-dashboard/all-analysis')}
            className="text-xs font-bold text-(--primaryBlue) hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Full Job Match Analysis</span>
            <Icons name="right" size="xs" />
          </button>
        </div>
      </div>
    </Card>
  );
}
