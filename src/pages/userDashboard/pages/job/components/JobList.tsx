import { useMemo, useState } from 'react';
import { Card } from '../../../../../components/Card.UserDashboard';
import Icons from '../../../../../utils/Icons';
import { useNavigate } from 'react-router-dom';
import { dashboardMockData } from '../../../../../data/userDashboard.mock';
import AnalysisCard from '../../../../../components/ui/AnalysisCard';
import JobPreview from './JobPreview';
import JobSortDropdown from './JobSortDropdown';

export default function JobList() {
  const navigate = useNavigate();
  const jobsList: any[] = dashboardMockData.latestJobs || [];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeJobId, setActiveJobId] = useState<string>(jobsList.length > 0 ? jobsList[0].id : '');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [copied, setCopied] = useState(false);

  // Filter & Sort state using dedicated dropdown component
  const [sortBy, setSortBy] = useState<any>('newest');

  // Filter jobs based on title, company, or skills
  const filteredJobs = useMemo(() => {
    return jobsList.filter((job) => {
      const titleMatch = (job.title || '').toLowerCase().includes(searchQuery.toLowerCase());
      const companyMatch = (job.company || '').toLowerCase().includes(searchQuery.toLowerCase());
      const locationMatch = (job.location || '').toLowerCase().includes(searchQuery.toLowerCase());
      const skillsMatch = (job.requirements?.requiredSkills || [])
        .join(' ')
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return titleMatch || companyMatch || locationMatch || skillsMatch;
    });
  }, [jobsList, searchQuery]);

  // Sort filtered jobs dynamically
  const sortedJobs = useMemo(() => {
    const sorted = [...filteredJobs];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
    } else if (sortBy === 'oldest') {
      sorted.sort((a, b) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime());
    } else if (sortBy === 'highestMatch') {
      sorted.sort((a, b) => (b.atsScore || b.matchScore || 0) - (a.atsScore || a.matchScore || 0));
    } else if (sortBy === 'lowestMatch') {
      sorted.sort((a, b) => (a.atsScore || a.matchScore || 0) - (b.atsScore || b.matchScore || 0));
    }
    return sorted;
  }, [filteredJobs, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedJobs.length / itemsPerPage) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedJobs.slice(start, start + itemsPerPage);
  }, [sortedJobs, currentPage, itemsPerPage]);

  const activeJobData = useMemo(() => {
    return jobsList.find((item: any) => item.id === activeJobId) || paginatedJobs[0] || jobsList[0] || null;
  }, [jobsList, activeJobId, paginatedJobs]);

  const handleSelectJob = (jobId: string) => {
    setActiveJobId(jobId);
  };

  const handleCopyRawText = () => {
    if (!activeJobData) return;
    navigator.clipboard.writeText(JSON.stringify(activeJobData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full">
      <Card>
        <div className="flex flex-col lg:flex-row gap-0 w-full min-h-160">
          {/* Left Column: Job Description List & Controls */}
          <div className="w-full lg:w-96 lg:min-w-85 p-5 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between space-y-4">
            <div className="space-y-4 flex-1 overflow-y-auto pr-1">
              <div className="space-y-3 border-b border-slate-200 pb-3">
                {/* Header with Title, Item Count & Standalone Sort Dropdown Component */}
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <Icons name="job" size="sm" />
                    Saved Job Descriptions
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">
                      {sortedJobs.length} {sortedJobs.length === 1 ? 'item' : 'items'}
                    </span>

                    {/* Standalone Reusable Sort Dropdown Component */}
                    <JobSortDropdown sortBy={sortBy} onSortChange={setSortBy} />
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Icons name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                  <input type="text" placeholder="Search job title, company..."
                    value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-(--primaryBlue) bg-slate-50"
                  />
                </div>
              </div>

              {paginatedJobs.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <p className="text-xs">No job descriptions found matching your criteria.</p>
                  <button type="button" onClick={() => { setSearchQuery(''); setSortBy('newest'); }}
                    className="text-xs font-semibold text-(--primaryBlue) underline cursor-pointer">
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {paginatedJobs.map((job) => {
                    const isSelected = activeJobId === job.id;
                    return (
                      <div key={job.id} className={`rounded-lg transition-all ${
                          isSelected
                            ? 'border-2 border-(--primaryBlue) ring-offset-1 bg-(--lightBlue)'
                            : 'hover:bg-(--lightBlue) border border-(--primaryBlue)/10'
                        }`}>
                        <AnalysisCard
                          jobTitle={job.title || 'N/A'}
                          ats={job.atsScore || 88}
                          company={job.company || 'Not Specified'}
                          date={job.date || 'N/A'}
                          iconName="job"
                          onPreview={() => handleSelectJob(job.id)}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination Controls Footer */}
            {totalPages > 1 && (
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs">
                <span className="text-slate-500 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Icons name="left" />
                  </button>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Icons name="right" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Detailed Job Description Text View */}
          <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
            {activeJobData ? (
              <>
                <div className="space-y-4">
                  {/* Top Header Card Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-(--primaryBlue)/10 text-(--primaryBlue) flex items-center justify-center shrink-0 border border-(--primaryBlue)/20">
                        <Icons logo={activeJobData.company !== 'Not Specified' ? activeJobData.company : undefined} name="job" size="md" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{activeJobData.title || 'N/A'}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span className="font-semibold text-slate-700">{activeJobData.company || 'Not Specified'}</span>
                          <span>•</span>
                          <span>{activeJobData.location || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                        <Icons name="star" size="xs" />
                        {activeJobData.atsScore || 88} Match Score
                      </span>

                      <button
                        type="button"
                        onClick={handleCopyRawText}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-slate-200"
                      >
                        {copied ? (
                          <>
                            <Icons name="check" className="text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Icons name="copy" />
                            <span>Copy Raw Text</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Clean Job Description View (No Card Box, No Resume Styling) */}
                  <div className="w-full max-h-125 min-h-96 overflow-y-auto">
                    <JobPreview tempData={activeJobData} />
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 font-medium">
                    Selected: <span className="font-semibold text-slate-800">{activeJobData.title || 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigate('/user-dashboard/all-analysis')}
                      className="inline-flex items-center gap-2 text-xs font-bold text-white bg-(--primaryBlue) hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
                    >
                      <Icons name="analyze" />
                      Analyze This Job
                    </button>

                    <a
                      href="/resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      <Icons name="analysis" />
                      View Full Details
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-20 text-center text-slate-400 space-y-2">
                <p className="text-sm">Select a job description from the left list to view details.</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </section>
  );
}
