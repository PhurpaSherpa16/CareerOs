import { FiExternalLink, FiDownload, FiFileText, FiAward, FiCalendar } from 'react-icons/fi';
import { Card } from '../../../components/Card.UserDashboard';
import Icons from '../../../utils/Icons';

interface ResumePreviewTabProps {
  resume: any;
}

export default function ResumePreviewTab({ resume }: ResumePreviewTabProps) {
  const pdfUrl = '/resume.pdf';
  const fileName = resume?.name || 'Phurpa_Sherpa_Frontend_Resume.pdf';
  const title = resume?.title || 'Frontend Developer Resume';
  const atsScore = resume?.atsScore || 91;
  const uploadDate = resume?.date || '2026-09-14';
  const summary = resume?.summary || ''

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Resume Info Header Toolbar */}
      <Card>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-(--primaryBlue)/10 text-(--primaryBlue) flex items-center justify-center shrink-0 border border-(--primaryBlue)/10">
              <FiFileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-(--primaryBlue)">{title}</h4>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                <span>{fileName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <FiCalendar className="w-3 h-3" />
                  {uploadDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {atsScore && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <FiAward className="w-3.5 h-3.5" />
                {atsScore} ATS Score
              </span>
            )}

            <a href={pdfUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">
              <FiExternalLink className="w-3.5 h-3.5" />
              Open Full
            </a>

            <a href={pdfUrl} download={fileName}
              className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-(--primaryBlue) hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors shadow-xs">
              <FiDownload className="w-3.5 h-3.5" />
              Download
            </a>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6 space-y-2">
          <div className='flex items-center gap-2'>
            <div className="w-9 h-9 rounded-lg bg-(--primaryBlue)/10 text-(--primaryBlue) flex items-center justify-center shrink-0 border border-(--primaryBlue)/10">
              <Icons name='scan'/>
            </div>
            <h4 className="text-sm font-bold text-(--primaryBlue)">Summary of Resume</h4>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>{summary}</span>
          </div>
        </div>
      </Card>



      {/* PDF View Container */}
      {/* <div className="w-full flex-1 min-h-110 max-h-125 2xl:max-h-145 bg-slate-900 
      rounded-xl overflow-hidden border border-slate-200 shadow-inner relative p-8">
        <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0`}
          title="Resume PDF Preview"
          className="w-full min-h-110 max-h-125 2xl:max-h-145 border-none rounded"
        />
      </div> */}
    </div>
  );
}
