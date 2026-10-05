import { FaWandMagicSparkles } from 'react-icons/fa6';
import TopAtsRatedResume from './components/TopAtsRatedResume';
import ResumeList from './components/ResumeList';
import { useMemo, useState } from 'react';
import { Heading } from '../../../../components/Heading.UserDashboard';
import useGetAllResume from '../../../../hooks/getAllResume.hook';
import UploadResumeModal from './components/UploadResumeModal';

export default function Resume() {
  const { resumes } = useGetAllResume('resume/all');
  const resumesList: any[] = resumes || [];
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Top rated resume (highest ATS score)
  const topRatedResume = useMemo(() => {
    if (!resumesList || resumesList.length === 0) return null;
    const resumesWithScore = resumesList.filter((r) => typeof r.atsScore === 'number' && r.atsScore > 0);
    if (resumesWithScore.length === 0) return null;
    const sorted = [...resumesWithScore].sort((a, b) => (b.atsScore || 0) - (a.atsScore || 0));
    const top = sorted[0];

    let structured = top.structuredText;
    if (typeof structured === 'string') {
      try {
        structured = JSON.parse(structured);
      } catch {
        structured = null;
      }
    }
    if (structured) {
      return {
        ...top,
        name: structured.contact?.name || top.name || top.fileName || 'Candidate',
        summary: structured.summary || top.summary,
        skills: structured.skills || top.skills,
        date: top.date || top.createdAt,
      };
    }
    return top;
  }, [resumesList]);

  return (
    <div className="mainDiv space-y-8 pb-10">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="h1">My Resumes & ATS Reports</h1>
          <p className="text-(--secondaryBlack) text-xs sm:text-sm mt-1">
            Manage, preview, analyze, and download your uploaded resumes and ATS optimization reports
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 bg-(--primaryBlue) hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <FaWandMagicSparkles className="w-3.5 h-3.5" />
            Upload & Analyze New Resume
          </button>
        </div>
      </header>

      {/* Bottom Section: Split 2-Column (Left: Resume List, Right: Raw Resume Text Preview + 3 Action Buttons) */}
      <ResumeList onOpenUploadModal={() => setIsUploadModalOpen(true)} />

      <div className='space-y-8 pt-4'>
        <Heading label="Top ATS style Resume" />
          {/* Top Section: Top Rated Resume Card w-full */}
        {topRatedResume ? (
          <TopAtsRatedResume data={topRatedResume} />
        ) : (
          <div className='border border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center gap-3 bg-slate-50/20'>
              <div className='w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center'>
                  <FaWandMagicSparkles className='text-slate-400'/>
              </div>
              <div>
                  <span className='block text-center text-sm font-semibold text-(--primaryBlack)'>No ATS-optimized resume found</span>
                  <p className='text-(--secondaryBlack) text-xs text-center mt-1'>Upload and analyze your first resume to see your ATS score and optimization suggestions.</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2 bg-(--primaryBlue) hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                  <FaWandMagicSparkles className="w-3.5 h-3.5" />
                  Upload & Analyze New Resume
              </button>
          </div>
          )
        }
      </div>

      {/* Upload Resume Modal */}
      <UploadResumeModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </div>
  );
}