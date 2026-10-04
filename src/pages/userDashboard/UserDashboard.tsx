import { useClerk, useUser } from "@clerk/react"
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import useRegisterUser from "../../hooks/registerUser"
import useGetAllResume from "../../hooks/getAllResume.hook"
import { dashboardMockData } from "../../data/userDashboard.mock"
import { Heading } from "../../components/Heading.UserDashboard"
import TopJobMatch from "./components/TopJobMatchCard"
import TotalResumeJobCard from "./components/TotalResume&JobCard"
import AnalysisCard from "./components/AnalysisCard"
import AtsInsight from "./components/AtsInsight"
import SkillSummary from "./components/SkillSummary"
import AIResumeInsight from "./components/AIResumeInsight"
import RecentAnalysis from "./components/RecentAnalysis"


export default function UserDashboard() {
    const {session} = useClerk()
    const {isLoaded, user} = useUser()
    const {register, loading: RegisterLoading, error:formError} = useRegisterUser('api/auth/register')
    const {resumes, loading:getAllResumeLoading, error:getAllResumeError} = useGetAllResume('resume/all')

    const registerRef = useRef(register)
    registerRef.current = register

    const attemptedUserIdRef = useRef<string | null>(null)
    const isSyncingRef = useRef<boolean>(false)

    console.log("resumes", resumes)

    const [loading, setLoading] = useState<string>('Loading...')
    const navigate = useNavigate()

    useEffect(()=>{
        if (session === null) {
            navigate("/login", { replace: true });
        }
    },[session, navigate])

    console.log(localStorage.getItem('careerOsUserToken'), user)

    useEffect(()=>{
        if(getAllResumeLoading) return
        if(getAllResumeError) return
        if(RegisterLoading) return
        if(formError) return
        setLoading("")
    },[getAllResumeLoading, getAllResumeError, RegisterLoading, formError])

    useEffect(() => {
        if (!session || !user?.id) return;
        if (isSyncingRef.current) return;

        const syncUser = async () => {
            const storedRegisteredId = localStorage.getItem('registeredId');
            const isRegisteredFlag = localStorage.getItem('userRegistered') === 'true'

            // Only considered registered if flag is true AND registeredId matches current clerk user ID
            const isCurrentClerkUserRegistered = isRegisteredFlag && storedRegisteredId === user.id;

            // If already registered and already handled for this user, do nothing
            if (isCurrentClerkUserRegistered && attemptedUserIdRef.current === user.id) return

            isSyncingRef.current = true;

            try {
                const token = await session.getToken({ template: "careeros" })
                if (token) localStorage.setItem('careerOsUserToken', token);

                if (!isCurrentClerkUserRegistered) {
                    await registerRef.current();
                    localStorage.setItem('userRegistered', 'true');
                    localStorage.setItem('registeredId', user.id);
                }

                attemptedUserIdRef.current = user.id;
            } catch (error) {
                console.error("Register sync error: ", error);
                attemptedUserIdRef.current = user.id;
            } finally {
                isSyncingRef.current = false;
            }
        };

        syncUser();
    }, [user?.id, session?.id]);

    console.log("registerd", localStorage.getItem('userRegistered'), "registeredId", localStorage.getItem('registeredId'))

    if(!isLoaded) return <div className="grid gap-2 place-content-center h-screen w-screen">{loading}</div>

    const fullName = `${user?.firstName || "John"} ${user?.lastName || "Doe"}`
    const mockData = dashboardMockData
    const analysisCardData = mockData?.analysis || []
    const totalResume = mockData?.resumeUpload?.total
    const toalJobSaved = mockData?.jobSaved?.total
    const topJobMatchData = mockData?.topJobMatch
    const aiATSInsightData = mockData?.ats
    const skillData = mockData?.skills || []
    const aiInsightData = mockData?.aiInsights.slice(0,3) || []
    const analysisData = mockData?.recentAnalyses || []
    const resumesData = mockData?.resumes || []
    const latestJobsData = mockData?.latestJobs || []


  return (
    <div className="mainDiv">
        <header>
            <h1 className="h1">Good Evening, {fullName}</h1>
            <p className="text-(--secondaryBlack)">"Analyze your resume against a job description"</p>
        </header>

        <div className="space-y-6">
            <Heading label="Quick Summary"/>
            {/* Quick Overall Summary  */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 w-full min-h-0">
                <div className="space-y-4 h-full flex flex-col justify-between w-full min-w-0">
                    <AnalysisCard analysisCardData={analysisCardData}/>
                </div>

                <div className="space-y-4 h-fit w-full min-w-0">
                    <TotalResumeJobCard totalResume={totalResume} totalJobSaved={toalJobSaved}/>
                    <TopJobMatch topJobMatchData={topJobMatchData}/>
                </div>
                
                <div className="space-y-4 h-full flex flex-col justify-between w-full min-w-0 md:col-span-2 xl:col-span-1">
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
            <div className="flex flex-col lg:flex-row gap-6 w-full">
                <div className="w-full lg:w-2/3">
                    <SkillSummary resumeData={resumesData[0] || mockData?.resumes?.[0]} skillData={skillData}/>
                </div>
                <div className="w-full lg:w-1/3"> 
                    <AIResumeInsight aiInsightData={aiInsightData}/>
                </div>
            </div>
        </div>
        
    </div>
  )
}




