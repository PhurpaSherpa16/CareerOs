import Icons from '../../utils/Icons'
import { DateFormatDistance } from '../../utils/DateFormatDistance';

interface AnalysisCardProps{
    jobTitle:string,
    ats: number,
    company:string,
    date:string,
    onPreview: ()=>void
}

export default function AnalysisCard({jobTitle, company, ats, date, onPreview}:AnalysisCardProps) {
    const formattedDate = DateFormatDistance(date as string);

    let matchScoreColor = ''
    let matchScoreBgColor = ''
    if(ats >= 90){
        matchScoreColor = 'text-(--darkGreen)'
        matchScoreBgColor = 'bg-(--darkGreen)/10'
    }else if(ats >= 80){
        matchScoreColor = 'text-(--primaryBlue)'
        matchScoreBgColor = 'bg-(--primaryBlue)/10'
    }else if(ats >= 70){
        matchScoreColor = 'text-(--yellow)'
        matchScoreBgColor = 'bg-(--yellow)/10'
    }else{
        matchScoreColor = 'text-(--red)'
        matchScoreBgColor = 'bg-(--red)/10'
    }
  return (
    <button onClick={onPreview} className='flex items-center justify-between w-full rounded-lg p-2 px-4'>
        <div className='flex items-center gap-4'>
            <div className='w-8 h-8 rounded-full bg-(--primaryBlue)/10 text-(--primaryBlue) flex items-center justify-center'>
                <Icons name='analysis' size='sm'/>
            </div>
            <div className='flex flex-col gap-0.5'>
                <h4 className='font-semibold text-sm text-left'>{jobTitle}</h4>
                <span className='flex items-center gap-1 text-slate-500 text-[12px] capitalize'>
                    <Icons logo={company} size='xs'/>
                    {company}
                </span>
            </div>
        </div>
        <div className='flex flex-col items-end gap-1'>
            <span className='text-slate-500 text-[11px]'>{formattedDate}</span>
            <div className={`px-3 py-1 rounded-full ${matchScoreBgColor}`}>
                <h4 className={`${matchScoreColor} font-semibold text-[11px] w-12 text-center`}>{ats} ATS</h4>
            </div>
        </div>
    </button>
  )
}
