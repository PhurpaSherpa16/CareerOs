import { useState, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import HeaderUserDashboard from '../../components/Header.UserDashboard';
import { dashboardMockData } from '../../data/userDashboard.mock';
import Banner from '../analyze/components/analyzeUi/Banner';
import OverviewTab from '../analyze/components/analyzeUi/OverviewTab';
import SkillTab from '../analyze/components/analyzeUi/SkillTab';
import AIinsightTab from '../analyze/components/analyzeUi/AIinsightTab';
import OptimizationTab from '../analyze/components/analyzeUi/OptimizationTab';
import AnalysisSkelation from '../analyze/components/analyzeUi/AnalysisSkelation';
import AICoverLetterTab from '../userDashboard/components/AICoverLetterTab';
import ReportTabSwitcher, { type ReportTabType } from './components/ReportTabSwitcher';
import RecommendedJobsSection from './components/RecommendedJobsSection';
import ReportEmptyState from './components/ReportEmptyState';
import ReportErrorState from './components/ReportErrorState';

export default function AnalysisReport() {
  const { analysisId: id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryId = searchParams.get('id');

  const reportId = id || queryId || 'analysis-001';

  // Mock Data
  const initialAnalyses = dashboardMockData?.recentAnalyses || [];
  const resumesData = dashboardMockData?.resumes || [];
  const latestJobsData = dashboardMockData?.latestJobs || [];

  // Page States
  const [activeTab, setActiveTab] = useState<ReportTabType>('overview');
  const [copied, setCopied] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Derive target analysis, resume, and job for this specific report
  const activeAnalysis = useMemo(() => {
    return initialAnalyses.find((item) => item.id === reportId) || initialAnalyses[0];
  }, [initialAnalyses, reportId]);

  const currentResume = useMemo(() => {
    if (!activeAnalysis) return resumesData[0];
    return resumesData.find((r) => r.id === activeAnalysis.resumeId) || resumesData[0];
  }, [activeAnalysis, resumesData]);

  const currentJob = useMemo(() => {
    if (!activeAnalysis) return latestJobsData[0];
    return latestJobsData.find((j) => j.id === activeAnalysis.jobId) || latestJobsData[0];
  }, [activeAnalysis, latestJobsData]);

  // Derived analysis scores & fields
  const score = activeAnalysis?.atsScore ?? 0;
  const fit =
    score >= 90
      ? 'Excellent Fit'
      : score >= 70
      ? 'Good Fit'
      : score >= 50
      ? 'Moderate Fit'
      : 'Needs Improvement';

  const candidateName = currentResume?.title
    ? currentResume.title.replace(' Resume', '')
    : 'Candidate';
  const jobTitle = currentJob?.title || 'Target Position';

  const matchedSkills: string[] = activeAnalysis?.matchedSkills || [];
  const missingSkills: string[] = activeAnalysis?.missingSkills || [];
  const matchedCount = matchedSkills.length;
  const missingCount = missingSkills.length;
  const totalSkillCount = matchedCount + missingCount;
  const matchPercentage = activeAnalysis?.jobMatch || 85;

  const normalizedInsights = (activeAnalysis?.aiInsights || []).map((item: any, idx: number) => {
    if (typeof item === 'string') {
      return {
        type: idx === 0 ? 'strength' : idx === 1 ? 'gap' : 'recommendation',
        title: item.split('.')[0] || 'Insight',
        description: item,
      };
    }
    return {
      ...item,
      type:
        item.tag === 'Resume Tip' || item.tag === 'Resume Strength'
          ? 'strength'
          : item.tag === 'Skill Gap' || item.tag === 'Experience Gap'
          ? 'gap'
          : 'recommendation',
      title: item.title,
      description: item.supporting,
    };
  });

  const normalizedData = useMemo(() => {
    if (!activeAnalysis) return null;
    return {
      ...activeAnalysis,
      atsScore: score,
      atsScoreReason: `Your resume matches ${score}% of requirements for ${jobTitle} at ${
        currentJob?.company || 'Target Company'
      }.`,
      fit,
      jobMatch: matchPercentage,
      matchMetrics: {
        skills: { percentage: matchPercentage, score: score, matchScore: score },
        experience: {
          percentage: activeAnalysis?.experience?.meetsRequirement ? 90 : 60,
          score: activeAnalysis?.experience?.meetsRequirement ? 90 : 60,
        },
        education: { percentage: 95, score: 95 },
        projects: { percentage: 88, score: 88 },
      },
      experience: activeAnalysis?.experience || {
        required: 2,
        candidate: 1,
        meetsRequirement: false,
      },
      skills: { percentage: matchPercentage, score: score },
      education: { percentage: 95, score: 95 },
      projects: { percentage: 88, score: 88 },
      matchedSkills,
      missingSkills,
      matchedKeywords: matchedSkills,
      missingKeywords: missingSkills,
      insights: normalizedInsights,
      result: {
        score,
        fit,
        summary:
          currentResume?.summary ||
          `${candidateName}'s profile has strong technical alignment with ${jobTitle} at ${
            currentJob?.company || 'Target Company'
          }.`,
        strengths: matchedSkills.slice(0, 4),
        gaps: missingSkills.slice(0, 3),
      },
      resumeStructuredText: {
        contact: { name: candidateName },
      },
      jobStructuredText: {
        jobInfo: { title: jobTitle, company: currentJob?.company },
        requiredSkills: currentJob?.requirements?.requiredSkills || matchedSkills,
        preferredSkills: currentJob?.requirements?.preferredSkills || missingSkills,
      },
    };
  }, [
    activeAnalysis,
    score,
    fit,
    matchPercentage,
    jobTitle,
    currentJob,
    matchedSkills,
    missingSkills,
    normalizedInsights,
    currentResume,
    candidateName,
  ]);

  const summaryText = normalizedData?.result?.summary || '';

  const handleCopySummary = () => {
    const summary = `ATS Score: ${score}% (${fit})\nCandidate: ${candidateName}\nJob: ${jobTitle}\nSummary: ${summaryText}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleCheck = (checkId: string) => {
    setCheckedItems((prev) => ({ ...prev, [checkId]: !prev[checkId] }));
  };

  const handleReset = () => {
    navigate('/user-dashboard/new-analysis');
  };

  // State Handlers
  if (isLoading) {
    return (
      <div className="mainDiv space-y-8 pb-10">
        <HeaderUserDashboard
          title="Analysis Report"
          subTitle="Track your applied companies, manage saved job descriptions, and analyze match scores"
          link="/user-dashboard/all-analysis"
          icon="analysis"
          buttonLabel="View Other Analysis"
        />
        <AnalysisSkelation />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mainDiv space-y-8 pb-10">
        <HeaderUserDashboard
          title="Analysis Report"
          subTitle="Track your applied companies, manage saved job descriptions, and analyze match scores"
          link="/user-dashboard/all-analysis"
          icon="analysis"
          buttonLabel="View Other Analysis"
        />
        <ReportErrorState onRetry={() => setIsError(false)} />
      </div>
    );
  }

  if (!activeAnalysis || !normalizedData) {
    return (
      <div className="mainDiv space-y-8 pb-10">
        <HeaderUserDashboard
          title="Analysis Report"
          subTitle="Track your applied companies, manage saved job descriptions, and analyze match scores"
          link="/user-dashboard/all-analysis"
          icon="analysis"
          buttonLabel="View Other Analysis"
        />
        <ReportEmptyState reportId={reportId} />
      </div>
    );
  }

  return (
    <div className="mainDiv space-y-8 pb-12">
      {/* Top Header Navigation */}
      <HeaderUserDashboard
        title="Analysis Report"
        subTitle="Track your applied companies, manage saved job descriptions, and analyze match scores"
        link="/user-dashboard/all-analysis"
        icon="analysis"
        buttonLabel="View Other Analysis"
      />

      {/* TOP SECTION: Verdict Banner + Details Tab Switcher + Overview & Sub-Tabs */}
      <section className="space-y-8">
        {/* Banner */}
        <Banner
          data={normalizedData}
          candidateName={candidateName}
          jobTitle={jobTitle}
          fit={fit}
          handleCopySummary={handleCopySummary}
          copied={copied}
          onReset={handleReset}
        />

        {/* Tab Switcher */}
        <div className="space-y-6">
          <ReportTabSwitcher
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            matchedCount={matchedCount}
            missingCount={missingCount}
            insightsCount={normalizedInsights.length}
          />

          {/* Tab 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <OverviewTab
              totalSkillCount={totalSkillCount}
              activeTab={activeTab}
              score={score}
              fit={fit}
              data={normalizedData}
              setActiveTab={(tab: string) => setActiveTab(tab as ReportTabType)}
              matchedCount={matchedCount}
              missingCount={missingCount}
              matchPercentage={matchPercentage}
            />
          )}

          {/* Tab 2: SKILLS MATRIX */}
          {activeTab === 'skills' && (
            <SkillTab activeTab={activeTab} data={normalizedData} />
          )}

          {/* Tab 3: AI INSIGHTS */}
          {activeTab === 'insights' && (
            <AIinsightTab activeTab={activeTab} data={normalizedData} />
          )}

          {/* Tab 4: OPTIMIZATION CHECKLIST */}
          {activeTab === 'checklist' && (
            <OptimizationTab
              activeTab={activeTab}
              checkedItems={checkedItems}
              toggleCheck={toggleCheck}
            />
          )}

          {/* Tab 5: AI COVER LETTER */}
          {activeTab === 'coverLetter' && (
            <AICoverLetterTab
              analysis={activeAnalysis}
              resume={currentResume}
              job={currentJob}
            />
          )}
        </div>
      </section>

      {/* BOTTOM SECTION: Recommended Jobs Carousel */}
      <section>
        <RecommendedJobsSection jobs={latestJobsData} />
      </section>
    </div>
  );
}
