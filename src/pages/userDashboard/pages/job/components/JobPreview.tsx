import { formatDistanceToNow } from 'date-fns';
import Icons from '../../../../../utils/Icons';

interface JobPreviewProps {
  tempData: any;
}

export default function JobPreview({ tempData }: JobPreviewProps) {
  if (!tempData) {
    return (
      <div className="p-8 text-center text-slate-400 space-y-2">
        <p className="text-xs font-semibold">No Job Description Selected</p>
        <p className="text-[11px]">Select a job description from the list to preview details.</p>
      </div>
    );
  }

  // Parse structuredText if string or object
  let structured = tempData.structuredText;
  if (typeof structured === 'string') {
    try {
      structured = JSON.parse(structured);
    } catch {
      structured = null;
    }
  }

  const title = tempData.title || structured?.jobInfo?.title || 'N/A';
  const company = tempData.company || structured?.jobInfo?.company || 'Not Specified';
  const location =
    tempData.location ||
    structured?.jobInfo?.location ||
    (structured?.jobInfo?.remote ? 'Remote' : 'Not Specified');
  const employmentType =
    tempData.employmentType || structured?.jobInfo?.employmentType || 'Not Specified';
  const salary = tempData.salary || structured?.salary || 'Not Specified';

  const dateValue = tempData.date || tempData.createdAt;
  let date = 'Recently';
  if (dateValue) {
    try {
      date = formatDistanceToNow(new Date(dateValue), { addSuffix: true });
    } catch {
      date = String(dateValue);
    }
  }

  const requirements = tempData.requirements || {};
  const minExperience =
    tempData.experience ||
    structured?.experience ||
    (requirements.minimumExperience !== undefined
      ? `${requirements.minimumExperience}+ years`
      : 'Not Specified');

  const requiredSkills: string[] =
    requirements.requiredSkills ||
    structured?.requiredSkills ||
    tempData.requiredSkills ||
    [];
  const preferredSkills: string[] =
    requirements.preferredSkills ||
    structured?.preferredSkills ||
    tempData.preferredSkills ||
    [];
  const softSkills: string[] =
    requirements.softSkills ||
    structured?.softSkills ||
    tempData.softSkills ||
    [];
  const responsibilities: string[] =
    structured?.rolesAndResponsibilities ||
    tempData.rolesAndResponsibilities ||
    [];

  const summary =
    structured?.summary ||
    tempData.summary ||
    tempData.description ||
    `We are looking for a qualified ${title} at ${company} (${location}) to join our team.`;

  return (
    <div className="space-y-5 font-sans text-slate-900 bg-white">
      {/* Header Info */}
      <div className="border-b border-slate-200 pb-4 space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700 font-semibold">
          <span>
            <strong className="text-slate-400 font-medium uppercase text-[10px] block">Type</strong>
            {employmentType}
          </span>

          <span>
            <strong className="text-slate-400 font-medium uppercase text-[10px] block">Salary</strong>
            <span className="text-emerald-700 font-bold">{salary}</span>
          </span>

          <span>
            <strong className="text-slate-400 font-medium uppercase text-[10px] block">Min Experience</strong>
            {minExperience}
          </span>

          {tempData.jobUrl && (
            <span>
              <strong className="text-slate-400 font-medium uppercase text-[10px] block">Posting</strong>
              <a
                href={tempData.jobUrl}
                target="_blank"
                rel="noreferrer"
                className="text-(--primaryBlue) hover:underline inline-flex items-center gap-1 font-semibold"
              >
                View Link ↗
              </a>
            </span>
          )}
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 self-start sm:self-auto shrink-0">
          Posted: {date}
        </span>
      </div>

      {/* Summary / Description */}
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <h4 className="font-bold text-slate-900 text-xs tracking-wider uppercase">
          Job Summary & Role Description
        </h4>
        <p className="text-xs text-slate-800 leading-relaxed font-normal whitespace-pre-line">
          {summary}
        </p>
      </div>

      {/* Roles & Responsibilities if available */}
      {responsibilities.length > 0 && (
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <h4 className="font-bold text-slate-900 text-xs tracking-wider uppercase">
            Roles & Responsibilities
          </h4>
          <ul className="space-y-2">
            {responsibilities.map((resp: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-800">
                <span className="text-(--primaryBlue) font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{resp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Required Technical Competencies */}
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <h4 className="font-bold text-slate-900 text-xs tracking-wider uppercase">
          Required Technical Skills
        </h4>
        {requiredSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2.5">
            {requiredSkills.map((skill: string, idx: number) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-900 border border-slate-200 rounded-md text-xs font-semibold shadow-2xs"
              >
                <Icons skill={skill} size="xs" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">Not Specified</p>
        )}
      </div>

      {/* Preferred Skills */}
      {preferredSkills.length > 0 && (
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <h4 className="font-bold text-slate-900 text-xs tracking-wider uppercase">
            Preferred / Nice-to-Have Skills
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {preferredSkills.map((skill: string, idx: number) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50/70 text-blue-900 border border-blue-200/80 rounded-md text-xs font-medium"
              >
                <Icons skill={skill} size="xs" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Soft Skills */}
      {softSkills.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-bold text-slate-900 text-xs tracking-wider uppercase">
            Soft Skills & Attributes
          </h4>
          <div className="flex flex-wrap gap-2">
            {softSkills.map((skill: string, idx: number) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200/80 rounded-md text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
