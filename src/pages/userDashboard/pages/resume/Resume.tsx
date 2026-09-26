import { useNavigate } from 'react-router-dom';
import { FaWandMagicSparkles } from 'react-icons/fa6';
import { dashboardMockData } from '../../../../data/userDashboard.mock';
import TopAtsRatedResume from './components/TopAtsRatedResume';
import ResumeList from './components/ResumeList';
import { useMemo } from 'react';

export default function Resume() {
  const navigate = useNavigate();
  const resumesList: any[] = dashboardMockData.resumes || [];

  // Top rated resume (highest ATS score)
  const topRatedResume = useMemo(() => {
    if (!resumesList || resumesList.length === 0) return null;
    return [...resumesList].sort((a, b) => (b.atsScore || 0) - (a.atsScore || 0))[0];
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
          <button type="button" onClick={() => navigate('/analyze')} 
          className="px-4 py-2 bg-(--primaryBlue) hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer">
            <FaWandMagicSparkles className="w-3.5 h-3.5" />
            Upload & Analyze New Resume
          </button>
        </div>
      </header>

      {/* Top Section: Top Rated Resume Card w-full */}
      {topRatedResume && (
        <TopAtsRatedResume data={topRatedResume} />
      )}

        {/* Bottom Section: Split 2-Column (Left: Resume List, Right: Raw Resume Text Preview + 3 Action Buttons) */}
        <ResumeList />
    </div>
  );
}