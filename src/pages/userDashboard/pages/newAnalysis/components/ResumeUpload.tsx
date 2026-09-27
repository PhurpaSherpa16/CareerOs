import React, { useRef, useState } from 'react';
import Icons from '../../../../../utils/Icons';

interface ResumeUploadProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  fileError?: string | null;
}

export default function ResumeUpload({
  selectedFile,
  onFileSelect,
  fileError,
}: ResumeUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const validateAndSelectFile = (file: File) => {
    onFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSelectFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSelectFile(files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept=".pdf,.doc,.docx,.txt"
        className="hidden"
      />

      {/* File Upload Box */}
      {!selectedFile ? (
        <div
          onClick={handleBoxClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full border-2 border-dashed rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center gap-4 cursor-pointer transition-all ${
            isDragging
              ? 'border-(--primaryBlue) bg-(--lightBlue) scale-[1.01]'
              : 'border-slate-300 hover:border-(--primaryBlue) bg-slate-50/70 hover:bg-(--lightBlue)/40'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-(--primaryBlue)/10 text-(--primaryBlue) flex items-center justify-center shadow-xs">
            <Icons name="upload" size="lg" />
          </div>

          <div className="space-y-1.5 max-w-md">
            <p className="font-semibold text-base text-(--primaryBlack)">
              Drag & drop your resume here, or{' '}
              <span className="text-(--primaryBlue) underline font-medium">browse computer</span>
            </p>
            <p className="text-xs text-(--secondaryBlack)">
              Supports PDF, DOCX, DOC, TXT (Maximum file size: 10MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0">
              <Icons name="resume" size="md" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-(--primaryBlack) truncate" title={selectedFile.name}>
                  {selectedFile.name}
                </h4>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Icons name="check" size="xs" /> Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Document'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={handleBoxClick}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Icons name="upload" size="xs" />
              Change
            </button>
            <button
              type="button"
              onClick={() => onFileSelect(null)}
              className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Icons name="trash" size="xs" />
              Remove
            </button>
          </div>
        </div>
      )}

      {fileError && (
        <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
          <Icons name="alert" size="xs" /> {fileError}
        </p>
      )}

      {/* Helpful Guidelines Card */}
      <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Icons name="ai" size="xs" className="text-(--primaryBlue)" />
            <span>ATS Resume Parsing Guidance</span>
          </div>
          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-slate-400 hover:text-(--primaryBlue) text-xs flex items-center gap-1 cursor-pointer"
            >
              <Icons name="alert" size="xs" /> Why this matters
            </button>
            {showTooltip && (
              <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-slate-900 text-white text-[11px] rounded-xl shadow-xl z-30 pointer-events-none space-y-1">
                <p className="font-semibold text-emerald-400">ATS Parsing Engine</p>
                <p className="text-slate-300 leading-relaxed">
                  ATS algorithms scan documents line-by-line. Clear text layouts ensure high keyword match accuracy.
                </p>
              </div>
            )}
          </div>
        </div>

        <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc list-inside pl-1">
          <li>
            <strong className="text-slate-700">Recommended Format:</strong> PDF or DOCX format yields the best AI extraction score.
          </li>
          <li>
            <strong className="text-slate-700">Layout Tip:</strong> Avoid columns, text boxes, or graphics over text to prevent misaligned parsing.
          </li>
          <li>
            <strong className="text-slate-700">Content Tip:</strong> Include standard section headings like "Work Experience", "Education", and "Skills".
          </li>
        </ul>
      </div>
    </div>
  );
}
