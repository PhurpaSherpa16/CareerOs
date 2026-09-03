import { useState } from "react";
import Banner from "./analyzeUi/Banner";
import Tab from "./analyzeUi/Tab";
import SkillTab from "./analyzeUi/SkillTab";
import OverviewTab from "./analyzeUi/OverviewTab";
import AIinsightTab from "./analyzeUi/AIinsightTab";
import OptimizationTab from "./analyzeUi/OptimizationTab";
import AnalysisSkelation from "./analyzeUi/AnalysisSkelation";
import ErrorMessage from "../../../components/ErrorMessage";

interface AnalysisProps {
  onReset: () => void,
  isPending: boolean
  error: any
}

export default function Analysis({onReset, isPending, error}: AnalysisProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "skills" | "insights" | "checklist">("overview");
  const [copied, setCopied] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const data = JSON.parse(localStorage.getItem('analysisData') || '{}');



  // Normalize nested response data structure from API or fallback
  const analysisData = data?.aiData

  const score = analysisData?.atsScore ?? analysisData?.result?.score ?? 0;

  const fit = analysisData.atsScore >= 90
      ? "Excellent Fit"
      : analysisData.atsScore >= 70
      ? "Good Fit"
      : analysisData.atsScore >= 50
      ? "Moderate Fit"
      : "Needs Improvement";

  const candidateName =
    data?.newRecord?.resumeStructuredText?.contact?.name ||
    "Candidate";

  const jobTitle =
    analysisData?.newRecord?.jobStructuredText?.jobTitle ||
    analysisData?.jobTitle ||
    "Target Role";

  const matchedSkills: string[] = Array.isArray(analysisData?.matchedSkills)
    ? analysisData.matchedSkills
    : [];
  const missingSkills: string[] = Array.isArray(analysisData?.missingSkills)
    ? analysisData.missingSkills
    : [];
  const matchedKeywords: string[] = Array.isArray(analysisData?.matchedKeywords)
    ? analysisData.matchedKeywords
    : [];

  const matchedCount = matchedSkills.length;
  const missingCount = missingSkills.length;
  const reqSkillsCount = analysisData?.jobStructuredText?.requiredSkills?.length || 0;
  const prefSkillsCount = analysisData?.jobStructuredText?.preferredSkills?.length || 0;
  const totalSkillCount =
    reqSkillsCount + prefSkillsCount > 0
      ? reqSkillsCount + prefSkillsCount
      : matchedCount + missingCount;

  const matchPercentage = Math.round(
    (matchedCount / (matchedCount + missingCount || 1)) * 100
  );

  const summaryText =
    typeof analysisData?.result === "object" && analysisData?.result?.summary
      ? analysisData.result.summary
      : typeof analysisData?.result === "string"
      ? analysisData.result
      : analysisData?.summary || "Resume analysis complete.";

  const rawInsights = Array.isArray(analysisData?.insights)
    ? analysisData.insights
    : [];

  const normalizedInsights = rawInsights.map((item: any, idx: number) => {
    if (typeof item === "string") {
      return {
        type: idx === 0 ? "strength" : idx === 1 ? "gap" : "recommendation",
        title: item.split(".")[0] || "Insight",
        description: item,
      };
    }
    return item;
  });

  const normalizedData = {
    ...analysisData,
    atsScore: score,
    matchedSkills,
    missingSkills,
    matchedKeywords,
    insights: normalizedInsights,
    result: {
      score,
      fit,
      summary: summaryText,
      strengths: analysisData?.result?.strengths || matchedSkills.slice(0, 4),
      gaps: analysisData?.result?.gaps || missingSkills.slice(0, 3),
    },
    resumeStructuredText: data?.newRecord?.resumeStructuredText?.contact?.name || {
      contact: { name: candidateName },
    },
    jobStructuredText: analysisData?.jobStructuredText || {
      jobTitle,
    },
  };

  const handleCopySummary = () => {
    const summary = `ATS Score: ${score}% (${fit})\nCandidate: ${candidateName}\nJob: ${jobTitle}\nSummary: ${summaryText}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (error) return <ErrorMessage onRetry={() => onReset()}/>;

  if (isPending && (!data || !error)) return <AnalysisSkelation/>;

  return (
    <div className="w-full mainDiv max-w-7xl! mx-auto space-y-16 animate-fadeIn">
      {/* Header Verdict Banner */}
      <Banner data={normalizedData} candidateName={candidateName} jobTitle={jobTitle} fit={fit} handleCopySummary={handleCopySummary} copied={copied} onReset={onReset}/>

      <div className="space-y-8">
        {/* Navigation Tabs */}
        <Tab activeTab={activeTab} setActiveTab={setActiveTab} matchedCount={matchedCount} missingCount={missingCount} data={normalizedData} />

        {/* Tab 1: OVERVIEW */}
        <OverviewTab totalSkillCount={totalSkillCount} activeTab={activeTab} score={score} fit={fit} data={normalizedData} setActiveTab={setActiveTab} matchedCount={matchedCount} missingCount={missingCount} matchPercentage={matchPercentage} />

        {/* Tab 2: SKILLS MATRIX */}
        <SkillTab activeTab={activeTab} data={normalizedData} />

        {/* Tab 3: AI INSIGHTS */}
        <AIinsightTab activeTab={activeTab} data={normalizedData} />

        {/* Tab 4: OPTIMIZATION CHECKLIST */}
        <OptimizationTab activeTab={activeTab} checkedItems={checkedItems} toggleCheck={toggleCheck}/>
      </div>
    </div>
  );
}
