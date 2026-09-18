import { useClerk, useUser } from "@clerk/react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useRegisterUser from "../../hooks/registerUser"
import useGetAllResume from "../../hooks/getAllResume.hook"
import { dashboardMockData } from "../../data/userDashboard.mock"
import { Heading } from "../../components/Heading.UserDashboard"
import TopJobMatch from "./components/TopJobMatchCard"
import TotalResumeJobCard from "./components/TotalResume&JobCard"
import AnalysisCard from "./components/AnalysisCard"
import AtsInsight from "./components/AtsInsight"
import RecentAcivity from "./components/RecentAcivity"
import SkillSummary from "./components/SkillSummary"
import AIResumeInsight from "./components/AIResumeInsight"
import RecentAnalysis from "./components/RecentAnalysis"


export default function UserDashboard() {
    const {session, signOut} = useClerk()
    const {isLoaded, user} = useUser()
    const {register, loading: RegisterLoading, error:formError} = useRegisterUser('api/auth/register')
    const {resumes, loading:getAllResumeLoading, error:getAllResumeError} = useGetAllResume('resume/all')

    const [loading, setLoading] = useState<string>('Loading...')
    const navigate = useNavigate()

    const getToken = async()=>{
        if (!session){
            console.log('No active session')
            return;
        }

        const token = await session.getToken({
            template: "careeros",
        })
        window.navigator.clipboard.writeText(token || "")
        console.log("token", token)
    }

    const handleLogout = async() => {
        setLoading('Logging out...')
        await signOut()
    }

    useEffect(()=>{
        if (session === null) {
            navigate("/login", { replace: true });
        }
    },[session, navigate])

    useEffect(()=>{
        if(getAllResumeLoading) return
        if(getAllResumeError) return
        if(RegisterLoading) return
        if(formError) return
        setLoading("")
    },[getAllResumeLoading, getAllResumeError, RegisterLoading, formError])

    useEffect(()=>{
        if (!session) {
            register().catch((err) => console.log("Register sync error: ", err))
        }
    },[session])

    if(!isLoaded) return <div className="grid gap-2 place-content-center h-screen w-screen">{loading}</div>

    const fullName = `${user?.firstName || "John"} ${user?.lastName || "Doe"}`
    
    const mockData = dashboardMockData
    const analysisCardData = mockData?.analysis || []
    const totalResume = mockData?.resumeUpload?.total
    const toalJobSaved = mockData?.jobSaved?.total
    const topJobMatchData = mockData?.topJobMatch
    const aiATSInsightData = mockData?.ats
    const recentAcivityData = mockData?.recentActivity
    const skillData = mockData?.skills || []
    const aiInsightData = mockData?.aiInsights.slice(0,3) || []
    const analysisData = mockData?.recentAnalyses || []
    const resumesData = mockData?.resumes || []
    const latestJobsData = mockData?.latestJobs || []


  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto userDashboard space-y-12">
        <header>
            <h1 className="h1">Good Evening, {fullName}</h1>
            <p className="text-(--secondaryBlack)">"Analyze your resume against a job description"</p>
        </header>

        <div className="space-y-6">
            <Heading label="Quick Summary"/>
            {/* Quick Overall Summary  */}
            <div className="flex gap-8 min-h-0 w-full">
                <div className="space-y-4 h-auto flex flex-col justify-between w-full">
                    <AnalysisCard analysisCardData={analysisCardData}/>
                </div>

                <div className="space-y-4 h-fit w-fit">
                    <TotalResumeJobCard totalResume={totalResume} totalJobSaved={toalJobSaved}/>
                    <TopJobMatch topJobMatchData={topJobMatchData}/>
                </div>
                
                <div className="space-y-4 h-auto flex flex-col justify-between w-full">
                    <AtsInsight aiInsightData={aiATSInsightData}/>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <Heading label="Recent Analysis"/>
            <div className="w-full">
                <RecentAnalysis recentAnalysisData={analysisData} resumesData={resumesData} latestJobsData={latestJobsData} />
            </div>
        </div>

        <div className="space-y-6">
            <Heading label="Suggested based on your activity"/>
             <div className="flex gap-8">
               <div className="w-sm">
                    <SkillSummary skillData={skillData}/>
                </div>
                <div className="w-sm">
                    <AIResumeInsight aiInsightData={aiInsightData}/>
                </div>
            </div>
        </div>
    </div>
  )
}




