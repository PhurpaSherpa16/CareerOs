import { useParams, useSearchParams } from "react-router-dom";
import HeaderUserDashboard from "../../components/Header.UserDashboard";

export default function AnalysisReport() {
    const { analysisId: id } = useParams();
    const [searchParams] = useSearchParams();
    const queryId = searchParams.get("id");

    const reportId = id || queryId;

  return (
    <div className="mainDiv space-y-8 pb-10">
        <HeaderUserDashboard title="Analysis Report" 
            subTitle="Track your applied companies, manage saved job descriptions, and analyze match scores"
            link="/user-dashboard/all-analysis"
            buttonLabel="All Analysis"/>

        AnalysisReport

        <p>Report ID: {reportId}</p>
    </div>
  )
}
