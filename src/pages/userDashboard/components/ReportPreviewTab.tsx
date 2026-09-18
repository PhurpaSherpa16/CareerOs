import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FiAlertCircle, FiTrendingUp, FiAward, FiLayers, FiClock, FiCheck, FiX } from 'react-icons/fi';
import { DateFormatDistance } from '../../../utils/DateFormatDistance';
import Icons from '../../../utils/Icons';

interface ReportPreviewTabProps {
  analysis: any;
  resume: any;
  job: any;
}

export default function ReportPreviewTab({ analysis, resume }: ReportPreviewTabProps) {
  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <FiAlertCircle className="w-10 h-10 mb-2 stroke-1" />
        <p className="text-sm">Select an analysis to view report details</p>
      </div>
    );
  }

  const atsScore = analysis.atsScore || 0;
  const jobMatch = analysis.jobMatch || 0;
  const matchedSkills: string[] = analysis.matchedSkills || [];
  const missingSkills: string[] = analysis.missingSkills || [];
  const aiInsights = analysis.aiInsights || [];
  const experience = analysis.experience || { required: 0, candidate: 0, meetsRequirement: false };

  // Calculate skill breakdown for 3-segregated pie chart:
  // 1. Main: Matched Skills
  // 2. Sub Main: Missing Skills
  // 3. Others (Ternary): Other Resume Skills (Resume skills not in matched list)
  const resumeSkillsObj = resume?.skills || {};
  const allResumeSkills: string[] = Object.values(resumeSkillsObj).flat() as string[];
  
  // Unique resume skills minus matched skills
  const otherResumeSkills = allResumeSkills.filter(
    (skill) => !matchedSkills.some((m) => m.toLowerCase() === skill.toLowerCase())
  );
  const otherSkillsCount = Math.max(0, Array.from(new Set(otherResumeSkills)).length);

  const matchedCount = matchedSkills.length;
  const missingCount = missingSkills.length;
  const totalSkillsEval = matchedCount + missingCount + otherSkillsCount;

  const pieData = [
    {
      name: 'Matched Skills (Main)',
      value: matchedCount,
      color: '#048734',
      percent: totalSkillsEval ? Math.round((matchedCount / totalSkillsEval) * 100) : 0,
    },
    {
      name: 'Missing Skills (Sub Main)',
      value: missingCount,
      color: '#F59E0B',
      percent: totalSkillsEval ? Math.round((missingCount / totalSkillsEval) * 100) : 0,
    },
    {
      name: 'Other Resume Skills (Ternary)',
      value: otherSkillsCount,
      color: '#6363F9',
      percent: totalSkillsEval ? Math.round((otherSkillsCount / totalSkillsEval) * 100) : 0,
    },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* ATS Score Card */}
        <div className="bg-linear-to-br from-indigo-50/70 to-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 block">ATS Score</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-extrabold text-slate-800">{atsScore}</span>
              <span className="text-xs font-semibold text-slate-500">/ 100</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-(--primaryBlue)/10 text-(--primaryBlue) flex items-center justify-center font-bold text-sm">
            <FiAward className="w-5 h-5" />
          </div>
        </div>

        {/* Job Match Card */}
        <div className="bg-linear-to-br from-emerald-50/70 to-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 block">Job Match</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-extrabold text-emerald-700">{jobMatch}%</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
            <FiTrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Experience Evaluation Card */}
        <div className="bg-linear-to-br from-slate-50 to-indigo-50/30 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 block">Experience</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-sm font-bold text-slate-800">
                {experience.candidate} Yrs / {experience.required} Yrs
              </span>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-1 ${
              experience.meetsRequirement ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
            }`}>
              {experience.meetsRequirement ? 'Meets Requirement' : 'Experience Gap'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <FiClock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Segregated Pie Chart Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <FiLayers className="w-4 h-4 text-(--primaryBlue)" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Skill Composition (3 Segments)</h4>
          </div>
          <span className="text-[11px] font-medium text-slate-500">Total Analyzed: {totalSkillsEval} Skills</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
          {/* Pie Chart */}
          <div className="md:col-span-5 h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} Skills`, name]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown Legend & Statistics */}
          <div className="md:col-span-7 space-y-2.5">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{item.name}</p>
                    <span className="text-[10px] text-slate-500">
                      {idx === 0 ? 'Main matched skills' : idx === 1 ? 'Sub main missing skills' : 'Other ternary resume skills'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800 block">{item.value}</span>
                  <span className="text-[10px] font-medium text-slate-500">{item.percent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Segregated Skills (Matched with Resume) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Resume Skills vs Job Requirements
          </h4>
          <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
            {matchedCount} Skills Matched
          </span>
        </div>

        {/* Categorized Resume Skills */}
        {resumeSkillsObj && Object.keys(resumeSkillsObj).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(resumeSkillsObj).map(([category, skills]) => {
              const skillList = (skills as string[]) || [];
              if (skillList.length === 0) return null;

              return (
                <div key={category} className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 capitalize tracking-wide block">
                    {category} Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {skillList.map((skill) => {
                      const isMatched = matchedSkills.some(
                        (m) => m.toLowerCase() === skill.toLowerCase()
                      );

                      return (
                        <span
                          key={skill}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                            isMatched
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          {isMatched ? (
                            <FiCheck className="w-3 h-3 text-emerald-600 stroke-3" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          )}
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {/* Missing Skills Section */}
        {missingSkills.length > 0 && (
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <span className="text-[11px] font-semibold text-amber-700 tracking-wide flex items-center gap-1">
              <FiAlertCircle className="w-3.5 h-3.5 text-amber-600" /> Missing Required Skills
            </span>
            <div className="flex flex-wrap gap-1.5">
              {missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200"
                >
                  <FiX className="w-3 h-3 text-amber-600 stroke-3" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Insights Section */}
      {aiInsights.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              AI Analysis Insights
            </h4>
            <span className="text-[11px] font-medium text-slate-500">
              {aiInsights.length} Recommendations
            </span>
          </div>

          <div className="space-y-4">
            {aiInsights.map((insight: any) => (
              <AiInsightCard insight={insight} />
            ))}
          </div>
        </div>
      )}

      {/* Analysis Metadata Footer */}
      <div className="text-[11px] text-slate-400 flex items-center justify-between px-1 pt-1">
        <span>Analysis ID: {analysis.id}</span>
        <span>Analyzed on: {analysis.createdAt ? DateFormatDistance(analysis.createdAt) : 'Recently'}</span>
      </div>
    </div>
  );
}


const AiInsightCard = ({insight}: {insight: any}) =>{
  const logo = insight.tag === 'Resume Tip' ? 'ai' : insight.tag === 'Skill Gap' ? 'alert' : 'light'
  return (
    <div key={insight.id} className={`flex items-center gap-2 rounded-lg p-2 px-4 border border-slate-100 
      bg-slate-100/60 hover:bg-slate-50 transition-all
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
}