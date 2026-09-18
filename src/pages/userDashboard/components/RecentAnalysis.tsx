import { Card } from '../../../components/Card.UserDashboard'
import AnalysisCard from '../../../components/ui/AnalysisCard';

interface RecentAnalysisProps {
    recentAnalysisData: any[];
    resumesData: any[];
    latestJobsData: any[];
}

export default function RecentAnalysis({recentAnalysisData, resumesData, latestJobsData}: RecentAnalysisProps) {
    const recentAnalysis = recentAnalysisData || []

  return (
    <Card>
        <div className="flex gap-8 divide-x-2 divide-slate-100">
                <div className="min-w-md">
                    <div className='px-6 py-6 min-h-150 max-h-150 2xl:min-h-180 2xl:max-h-180 space-y-6 overflow-hidden'>
                        <div className='border-b border-slate-200 pb-2'>
                            <h3 className='text-sm font-semibold'>Analysis Results</h3>
                        </div>

                        {
                            recentAnalysis.map((analysis, index)=>{
                                const specificResume = resumesData.find((resume)=>analysis.id)
                                const specificJob = latestJobsData.find((job)=>analysis.id)
                                console.log(specificJob)
                                return(
                                <AnalysisCard jobTitle={specificJob?.title} company={specificJob?.company} 
                                date={specificJob?.date} matchScore={specificJob?.matchScore}/>
                            )
                            })
                        }
                    </div>
                </div>
                <div className="w-full">
                    <div className='px-6 py-6 min-h-150 max-h-150 2xl:min-h-180 2xl:max-h-180 space-y-6 overflow-hidden'>
                        <div className='border-b border-slate-200 pb-2'>
                            <h3 className='text-sm font-semibold'>Preview</h3>
                        </div>
                    </div>
                </div>
        </div>
    </Card>
  )
}
