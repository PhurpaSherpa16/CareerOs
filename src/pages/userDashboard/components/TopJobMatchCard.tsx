import { HalfOutlinePieChart } from '../../../components/ui/HalfOutlinePieChart'
import { Link } from 'react-router-dom';
import { Card } from "../../../components/Card.UserDashboard";
import CardTitle from '../../../components/CardTitle';
import Icons from '../../../utils/Icons';

interface TopJobMatchProps{
    topJobMatchData: {
        overallMatch: number;
        relevance: string;
        title: string;
        company: string;
    }
}

export default function TopJobMatch({topJobMatchData}: TopJobMatchProps) {
    const {overallMatch: overJobMatchPercentage, relevance:JobRelevance, title: jobTitle, company: jobCompany} = topJobMatchData
    let relevenceColor: string;
    let textColor: string;
    if(JobRelevance?.toLowerCase() === 'high' && overJobMatchPercentage >= 80){
        relevenceColor = '#22C55E'
        textColor = 'text-(--darkGreen)'
    }
    else if(JobRelevance?.toLowerCase() === 'medium' && overJobMatchPercentage >= 60){
        relevenceColor = '#F59E0B'
        textColor = 'text-(--yellow)'
    }
    else if(JobRelevance?.toLowerCase() === 'low' && overJobMatchPercentage >= 40){
        relevenceColor = '#B91C1C'
        textColor = 'text-(--red)'
    }
    else{
        relevenceColor = '#B91C1C'
        textColor = 'text-(--red)'
    }

  return (
    <Card>
        <div className="flex items-center gap-8 w-full px-8 py-4">
            <HalfOutlinePieChart value={overJobMatchPercentage} color={relevenceColor}/>
            <div className="flex flex-col justify-center space-y-2">
                <CardTitle label='Top Job Match'/>
                <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold truncate">
                        {jobTitle}
                    </span>
                    <span className={`font-bold text-sm flex items-center min-w-36 gap-1 ${textColor} capitalize`}>
                        <Icons name='shield'/>{JobRelevance || 'high'} Relevance
                    </span>
                    <div className='flex items-center justify-between'>
                        <span className="text-[11px] font-medium text-slate-400 truncate flex items-center gap-1">
                            <Icons name='office' size='xs'/>{jobCompany}
                        </span>
                        <Link to={'/'} className='text-[10px] underline text-slate-400'>View</Link>
                    </div>
                </div>
            </div>
        </div>
    </Card>
  )
}
