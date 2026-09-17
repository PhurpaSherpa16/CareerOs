import { FullOutlinePieChart } from '../../../components/ui/FillOutlinePieChart'
import { Link } from 'react-router-dom'
import { Card } from '../../../components/Card.UserDashboard'
import CardTitle from '../../../components/CardTitle';
import Icons from '../../../utils/Icons';


interface AnalysisCardProps{
    analysisCardData: {total?: number; noMatch?: number; bestFitRole?: string; totalAnalysis?: number;}
}

export default function AnalysisCard({analysisCardData}: AnalysisCardProps) {
    const {total, noMatch, bestFitRole} = analysisCardData
  return (
    <Card>
        <div className="h-full flex flex-col gap-4">
            <div className="flex items-center gap-4 w-full border-b border-slate-200 px-4 py-4">
                <div className="min-w-26 max-w-26 grid place-content-center">
                    <h3 className="text-4xl font-bold text-center">{total}</h3>
                </div>
                <div className="min-w-45 max-w-45">
                    <h3 className="text-sm tracking-wide text-slate-400">Analysis <br /> Made</h3>
                </div>
            </div>
            <div className="flex items-center gap-4 w-full px-4">
                <div className="min-w-26 max-w-26 grid place-content-center">
                    <FullOutlinePieChart value={noMatch || 0} total={total || 0}/>
                </div>
                <div className="min-w-45 max-w-45 grid place-content-center space-y-2">
                    <CardTitle label={`Job Match (${noMatch}/${total})`}/>
                    <div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-semibold truncate">Best Fit Roles</span>
                            <h4 className="font-bold text-(--primaryBlue) text-base w-fit capitalize flex items-center gap-1" title={bestFitRole}>
                                <Icons name='jobFill' size='sm'/>{bestFitRole}
                            </h4>
                            <Link to={'/'} className="text-[10px] underline text-slate-400 tracking-wide cursor-pointer">View all Roles</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Card>
  )
}
