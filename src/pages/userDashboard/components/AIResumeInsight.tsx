import React from 'react'
import { Card } from '../../../components/Card.UserDashboard'
import Icons from '../../../utils/Icons'
import { Link } from 'react-router-dom'

interface AIResumeInsightProps{
    aiInsightData: any[]
}



export default function AIResumeInsight({aiInsightData}:AIResumeInsightProps) {
    const aiInsight = aiInsightData

  return (
   <Card>
        <div className='px-6 py-6 min-h-80 max-h-80 2xl:min-h-100 2xl:max-h-100 space-y-6 overflow-hidden'>
            <div className='border-b border-slate-200 pb-2'>
                <h3 className='text-sm font-semibold'>Ai Resume Insights</h3>
            </div>
            <div className='space-y-2'>
                <div className='space-y-4 h-50 2xl:h-70 overflow-y-auto' style={{scrollbarWidth:'none'}}>
                    {aiInsight?.map((insight) => {
                        const logo = insight.tag === 'Resume Tip' ? 'ai' : insight.tag === 'Skill Gap' ? 'alert' : 'light'
                        return (
                        <div key={insight.id} className={`flex items-center gap-2 w-full rounded-lg p-2 px-4
                        ${insight.tag === 'Resume Tip' ? 'bg-(--primaryBlue)/10 ' 
                                    : insight.tag === 'Skill Gap' ? 'bg-(--red)/10 ' 
                                    : 'bg-(--yellow)/10 '}`}>
                            <div className='flex items-center gap-4'>
                                <div className={`w-8 h-8 rounded-full 
                                    ${insight.tag === 'Resume Tip' ? 'bg-(--primaryBlue)/10 text-(--primaryBlue)' 
                                    : insight.tag === 'Skill Gap' ? 'bg-(--red)/10 text-(--red)' 
                                    : 'bg-(--yellow)/10 text-(--darkYellow)'} flex items-center justify-center`}>
                                    <Icons name={logo} size='sm'/>
                                </div>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <span className={`text-slate-500 text-[11px]`}>{insight.tag}</span>
                                <div>
                                    <h4 className={`text-[11px] font-bold
                                        ${insight.tag === 'Resume Tip' ? 'text-(--primaryBlue)' 
                                        : insight.tag === 'Skill Gap' ? 'text-(--red)' 
                                        : 'text-(--darkYellow)'}`}>{insight.title}</h4>
                                    <p className='text-[11px]'>{insight.supporting}</p>
                                </div>
                            </div>
                        </div>
                    )
                    })}
                </div>
                <div className='flex items-end justify-end'>
                    <Link to="/" className='text-primaryBlue hover:underline text-[10px] underline text-slate-400'>View All</Link>
                </div>
            </div>
        </div>
    </Card>
  )
}
