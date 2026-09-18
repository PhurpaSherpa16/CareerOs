import { FiBriefcase, FiMapPin, FiCalendar, FiClock, FiCheckCircle, FiStar, FiHeart, FiAward, FiDollarSign, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import { DateFormatDistance } from '../../../utils/DateFormatDistance';
import Icons from '../../../utils/Icons';

interface JobDescriptionTabProps {
  job: any;
  matchedSkills?: string[];
  resumeSkills?: Record<string, string[]> | string[];
  experience?: {
    required: number;
    candidate: number;
    meetsRequirement: boolean;
  };
}

export default function JobDescriptionTab({
  job,
  matchedSkills = [],
  resumeSkills,
  experience,
}: JobDescriptionTabProps) {
  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <FiBriefcase className="w-10 h-10 mb-2 stroke-1" />
        <p className="text-sm">Job description details unavailable</p>
      </div>
    );
  }

  const requirements = job.requirements || {};
  const requiredSkills: string[] = requirements.requiredSkills || [];
  const preferredSkills: string[] = requirements.preferredSkills || [];
  const softSkills: string[] = requirements.softSkills || [];
  const minExp = requirements.minimumExperience || 0;

  // Candidate experience calculation
  const candidateYears = experience?.candidate ?? 1;
  const reqYears = minExp || experience?.required || 0;
  const isExpMatched = experience ? experience.meetsRequirement : candidateYears >= reqYears;

  // Flatten candidate skills from resume and matchedSkills for matching
  const candidateSkillsList: string[] = [
    ...(matchedSkills || []),
    ...(resumeSkills
      ? Array.isArray(resumeSkills)
        ? resumeSkills
        : Object.values(resumeSkills).flat()
      : []),
  ];

  const isSkillMatched = (skill: string) => {
    const target = skill.trim().toLowerCase();
    return candidateSkillsList.some((c) => c.trim().toLowerCase() === target);
  };

  const formatMatchedCount = (count: number, total: number) =>
    `(${count.toString().padStart(2, '0')}/${total.toString().padStart(2, '0')} Matched)`;

  const matchedRequiredCount = requiredSkills.filter(isSkillMatched).length;
  const matchedPreferredCount = preferredSkills.filter(isSkillMatched).length;
  const matchedSoftCount = softSkills.filter(isSkillMatched).length;

  const unmatchedSoftSkills = softSkills.filter((s) => !isSkillMatched(s));

  return (
    <div className="space-y-5 pb-6">
      {/* Job Header Card */}
      <div className="bg-linear-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-white/10 text-blue-200 px-2.5 py-0.5 rounded-md backdrop-blur-xs mb-2">
              {job.employmentType || 'Full-time'}
            </span>
            <h3 className="text-xl font-bold text-white">{job.title}</h3>
            <p className="text-sm text-blue-200 font-medium flex items-center gap-1 mt-0.5">
              <Icons logo={job.company} size="xs" />
              {job.company}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1">
              <FiAward className="w-3.5 h-3.5" />
              {minExp}+ Yrs Experience
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-blue-100/80 pt-3 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <FiMapPin className="w-3.5 h-3.5 text-blue-300" />
            <span>{job.location || 'Remote'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiCalendar className="w-3.5 h-3.5 text-blue-300" />
            <span>Posted {job.date ? DateFormatDistance(job.date) : 'Recently'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiDollarSign className="w-3.5 h-3.5 text-blue-300" />
            <span>{job.salary || 'Negotiable on experience'}</span>
          </div>
        </div>
      </div>

      {/* Minimum Requirements Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                isExpMatched
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              <FiClock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Experience Requirement</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Minimum <span className="font-bold text-slate-900">{reqYears} years</span> of relevant professional experience.
              </p>
            </div>
          </div>

          {/* Status Tag */}
          {isExpMatched ? (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Matched ({candidateYears}/{reqYears} Yrs)
            </span>
          ) : (
            <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-md border border-red-200">
              Low Experience ({candidateYears}/{reqYears} Yrs)
            </span>
          )}
        </div>

        {/* Tip / Recommendation at bottom */}
        {!isExpMatched ? (
          <div className="p-3 rounded-lg bg-red-50/80 border border-red-200 text-xs text-red-900 flex items-start gap-2.5">
            <FiAlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>
              <strong>Experience Tip:</strong> Your current experience ({candidateYears} Yrs) is below the required {reqYears} Yrs. 
              Showcase more hands-on projects and measurable project achievements in your resume for a much higher chance of acceptance!
            </span>
          </div>
        ) : (
          <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <FiCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Great Fit:</strong> Your professional experience ({candidateYears} Yrs) meets or exceeds the required {reqYears} years!
            </span>
          </div>
        )}
      </div>

      {/* Required Skills Section */}
      {requiredSkills.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="w-4 h-4 text-(--primaryBlue)" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Required Skills</h4>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              {formatMatchedCount(matchedRequiredCount, requiredSkills.length)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {requiredSkills.map((skill) => {
              const matched = isSkillMatched(skill);
              return (
                <span
                  key={skill}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    matched
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs'
                      : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}
                >
                  {matched ? (
                    <FiCheck className="w-3.5 h-3.5 text-emerald-600 stroke-3" />
                  ) : (
                    <FiX className="w-3 h-3 text-slate-400" />
                  )}
                  {skill}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Preferred Skills Section */}
      {preferredSkills.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <FiStar className="w-4 h-4 text-purple-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Preferred Skills</h4>
            </div>
            <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-md border border-green-200">
              {formatMatchedCount(matchedPreferredCount, preferredSkills.length)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferredSkills.map((skill) => {
              const matched = isSkillMatched(skill);
              return (
                <span
                  key={skill}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                    matched
                      ? 'bg-green-100 text-green-700 border-green-300 shadow-2xs'
                      : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}
                >
                  {matched ? (
                    <FiCheck className="w-3.5 h-3.5 text-green-700 stroke-3" />
                  ) : (
                    <FiX className="w-3 h-3 text-slate-400" />
                  )}
                  {skill}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Soft Skills Section */}
      {softSkills.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <FiHeart className="w-4 h-4 text-green-700" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Soft Skills & Culture</h4>
            </div>
            <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-md border border-green-200">
              {formatMatchedCount(matchedSoftCount, softSkills.length)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {softSkills.map((skill) => {
              const matched = isSkillMatched(skill);
              return (
                <span
                  key={skill}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                    matched
                      ? 'bg-green-50 text-green-700 border-green-200 font-semibold shadow-2xs'
                      : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}
                >
                  {matched ? (
                    <FiCheck className="w-3.5 h-3.5 text-green-600 stroke-3" />
                  ) : (
                    <FiX className="w-3 h-3 text-slate-400" />
                  )}
                  {skill}
                </span>
              );
            })}
          </div>

          {/* Missing Soft Skills Optimization Recommendation */}
          {unmatchedSoftSkills.length > 0 && (
            <div className="mt-3 p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-center gap-2.5">
              <FiAlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Resume Tip:</strong> Consider adding <em>{unmatchedSoftSkills.join(', ')}</em> to your resume to improve your match score for this position!
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
