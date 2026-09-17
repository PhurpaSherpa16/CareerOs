import { Card } from '../../../components/Card.UserDashboard'
import Icons from '../../../utils/Icons'

interface SkillItem {
    id?: string
    title: string
    match: number
}

interface SkillProps {
    skillData: SkillItem[]
}

export default function SkillSummary({ skillData }: SkillProps) {
    const skills = skillData || []

    return (
        <Card>
            <div className='px-6 py-6 min-h-80 max-h-80 2xl:min-h-100 2xl:max-h-100 
            space-y-6 overflow-hidden'>
                <div className='border-b border-slate-200 pb-2'>
                    <h3 className='text-sm font-semibold'>Skill Summary</h3>
                </div>

                <div className='space-y-4 h-50 2xl:h-70 overflow-y-auto pr-1 scrollbar-hide' style={{ scrollbarWidth: 'none' }}>
                    {skills.length > 0 && skills.map((skill, index) => {
                        const score = skill.match || 0

                        let matchScoreColor = ''
                        let matchScoreBgColor = ''
                        let matchBarColor = ''

                        if (score >= 90) {
                            matchScoreColor = 'text-(--green)'
                            matchScoreBgColor = 'bg-(--green)/10'
                            matchBarColor = 'bg-(--green)'
                        } else if (score >= 80) {
                            matchScoreColor = 'text-(--primaryBlue)'
                            matchScoreBgColor = 'bg-(--primaryBlue)/10'
                            matchBarColor = 'bg-(--primaryBlue)'
                        } else if (score >= 70) {
                            matchScoreColor = 'text-(--yellow)'
                            matchScoreBgColor = 'bg-(--yellow)/10'
                            matchBarColor = 'bg-(--yellow)'
                        } else {
                            matchScoreColor = 'text-(--red)'
                            matchScoreBgColor = 'bg-(--red)/10'
                            matchBarColor = 'bg-(--red)'
                        }

                        return (
                            <div key={skill.id || index} className='space-y-1.5'>
                                <div className='flex items-center justify-between text-xs'>
                                    <div className='flex items-center gap-2'>
                                        <div className={`w-6 h-6 rounded-full bg-(--secondaryBlack)/10
                                        border border-slate-300 
                                            text-(--primaryBlack) flex items-center justify-center shrink-0`}>
                                            <Icons logo={skill.title} name='job' size='xs' />
                                        </div>
                                        <span className='font-medium text-(--primaryBlack)'>{skill.title}</span>
                                    </div>
                                    <span className={`text-[11px] ${matchScoreColor}`}>{score}%</span>
                                </div>
                                <div className='w-full h-2 bg-slate-100 rounded-full overflow-hidden'>
                                    <div className={`h-full rounded-full transition-all duration-500 ease-out ${matchBarColor}`}
                                        style={{ width: `${Math.min(100, Math.max(0, score))}%` }}/>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Card>
    )
}

