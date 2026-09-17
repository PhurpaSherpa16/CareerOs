import { Link } from 'react-router-dom';
import { Card } from '../../../components/Card.UserDashboard'
import ActivityCard from '../../../components/ui/ActivityCard';


interface RecentAcivityProps {
    recentAcivityData:any[];
}

export default function RecentAcivity({recentAcivityData}:RecentAcivityProps) {
    const recentActivityItem = recentAcivityData || []
    
  return (
    <Card>
        <div className='px-6 py-6 min-h-80 max-h-80 2xl:min-h-100 2xl:max-h-100 space-y-6 overflow-hidden'>
            <div className='border-b border-slate-200 pb-2'>
                <h3 className='text-sm font-semibold'>Recent Activity</h3>
            </div>

            <div className='space-y-2'>
                <div className='h-50 2xl:h-70 overflow-y-auto space-y-4 scrollbar-hide'
                style={{scrollbarWidth:'none'}}>
                    {recentActivityItem.length > 0 && recentActivityItem.map((item)=>(
                        <ActivityCard activity={item} icon={'job'}/>
                    ))}
                </div>
                <div className='flex items-end justify-end'>
                    <Link to="/" className='text-primaryBlue hover:underline text-[10px] underline text-slate-400'>View All</Link>
                </div>
            </div>
        </div>
    </Card>
  )
}


