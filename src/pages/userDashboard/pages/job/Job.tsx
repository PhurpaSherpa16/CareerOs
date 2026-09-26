import { useState } from 'react';
import { FaWandMagicSparkles } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import CompanyAppliedBarChart from './components/CompanyAppliedBarChart';
import ActiveCompanyJobDetails from './components/ActiveCompanyJobDetails';
import JobList from './components/JobList';

export default function Job() {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState<string | undefined>(undefined);

  const handleSelectCompany = (companyName: string) => {
    setSelectedCompany((prev) => (prev === companyName ? undefined : companyName));
  };

  return (
    <div className="mainDiv space-y-8 pb-10">
      {/* Page Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h1 className="h1">My Saved Jobs & Job Descriptions</h1>
          <p className="text-(--secondaryBlack) text-xs sm:text-sm mt-1">
            Track your applied companies, manage saved job descriptions, and analyze match scores
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/analyze')} className="px-4 py-2 bg-(--primaryBlue) hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer">
            <FaWandMagicSparkles className="w-3.5 h-3.5" />
            Upload New Job Description
          </button>
        </div>
      </header>

      {/* Top 2-Column Layout Section */}
      {/* 1. Left Layout: Company Applied Bar Graph + State controls (Data, Skeleton, Error, Empty) */}
      {/* 2. Right Layout: Active Company Job Details (Title, Company logo & name, Type, Location, Salary with N/A / Not Specified fallbacks) */}
      <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 xl:col-span-6 min-h-130 max-h-130">
          <CompanyAppliedBarChart
            selectedCompany={selectedCompany}
            onSelectCompany={handleSelectCompany}
          />
        </div>

        <div className="lg:col-span-6 xl:col-span-6 min-h-130 max-h-130">
          <ActiveCompanyJobDetails selectedCompanyName={selectedCompany}/>
        </div>
      </section>

      {/* Bottom Section: Split 2-Column Saved Job Descriptions List & Detailed Viewer */}
      <section className="w-full">
        <JobList />
      </section>
    </div>
  );
}
