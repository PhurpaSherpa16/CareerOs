import { useEffect, useState } from 'react';
import Icons from '../../../../../utils/Icons';
import { Card } from '../../../../../components/Card.UserDashboard';

interface ResumePreviewProps {
  selectedFile: File | null;
}

export default function ResumePreview({ selectedFile }: ResumePreviewProps) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileTextContent, setFileTextContent] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedFile) {
      setFileUrl(null);
      setFileTextContent(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setFileUrl(url);

    if (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileTextContent(e.target?.result as string);
      };
      reader.readAsText(selectedFile);
    } else {
      setFileTextContent(null);
    }

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  if (!selectedFile) {
    return (
      <Card>
        <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center space-y-4 h-120">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200/80 shadow-xs">
            <Icons name="file" size="lg" />
          </div>
          <div className="space-y-1.5 max-w-xs">
            <h4 className="text-base font-bold text-slate-700">No Resume Preview</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload a resume document on the left to see a live formatted preview and parsing diagnostics here.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-left max-w-xs space-y-1 mt-2">
            <p className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
              <Icons name="light" size="xs" className="text-amber-500" /> Preview Feature Note
            </p>
            <p className="text-[10px] text-slate-500 leading-normal">
              PDF documents render in real-time. Text files show structured line view.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf');

  return (
    <Card>
      <div className="p-6 space-y-4 flex flex-col h-130">
        {/* Preview Header Toolbar */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-(--primaryBlue)/10 text-(--primaryBlue) flex items-center justify-center shrink-0 border border-(--primaryBlue)/10">
              <Icons name="eye" size="sm" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-(--primaryBlack) truncate">
                  Resume Preview
                </h4>
                <div className="relative">
                  <button
                    type="button"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="text-slate-400 hover:text-(--primaryBlue) transition-colors cursor-pointer"
                  >
                    <Icons name="alert" size="xs" />
                  </button>
                  {showTooltip && (
                    <div className="absolute left-0 top-full mt-2 w-56 p-2.5 bg-slate-900 text-white text-[10px] rounded-lg shadow-xl z-20 pointer-events-none">
                      Verify that your work experience and contact details are clearly formatted in the preview.
                    </div>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-slate-500 truncate" title={selectedFile.name}>
                {selectedFile.name}
              </p>
            </div>
          </div>

          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors shrink-0"
            >
              <Icons name="view" size="xs" />
              Full View
            </a>
          )}
        </div>

        {/* Scrollable Container with Fixed Height */}
        <div className="w-full flex-1 bg-slate-50 rounded-xl overflow-y-auto border border-slate-200 relative">
          {isPdf && fileUrl ? (
            <iframe
              src={`${fileUrl}#toolbar=0&navpanes=0`}
              title="Resume Preview"
              className="w-full h-full border-none rounded-xl"
            />
          ) : fileTextContent ? (
            <div className="p-5 font-mono text-xs text-slate-800 whitespace-pre-wrap overflow-y-auto h-full bg-white leading-relaxed">
              {fileTextContent}
            </div>
          ) : (
            <div className="p-6 flex flex-col items-center justify-center text-center space-y-3 h-full bg-white">
              <div className="w-14 h-14 rounded-2xl bg-(--lightBlue) text-(--primaryBlue) flex items-center justify-center border border-(--primaryBlue)/20">
                <Icons name="resume" size="lg" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h5 className="text-sm font-bold text-slate-800">File Ready for Processing</h5>
                <p className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{selectedFile.name}</span> selected. Click "Full View" to open in browser viewer.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
