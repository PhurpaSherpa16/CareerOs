import React, { useRef } from 'react';
import { HiOutlineCloudUpload } from 'react-icons/hi';

interface ResumeUploadProps {
    onNext?: () => void;
    selectedFile?: File | null;
    setSelectedFile?: (file: File | null) => void;
    fileError?: string;
    handleFile: (file: File) => void;
}

export default function ResumeUpload({ onNext, selectedFile, handleFile, fileError }: ResumeUploadProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleBoxClick = () => {
        fileInputRef.current?.click();
    };

    const handleNextClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedFile && onNext) {
            onNext();
        }
    };


    return (
        <div className="bg-(--white) p-8 sm:p-12 rounded-3xl border border-(--lightBlack)/20 w-full max-w-2xl flex flex-col items-center space-y-8 shadow-xl">
            <input type="file" ref={fileInputRef} onChange={(e) => handleFile(e.target.files?.[0] as File)} accept=".pdf" className="hidden"/>

            <div onClick={handleBoxClick} 
                className="w-full border-2 border-dashed border-(--primaryBlue) bg-(--lightBlue)/40 hover:bg-(--lightBlue)/80 transition-all rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center gap-4 cursor-pointer group">
                {/* Upload Icon */}
                <div className="p-4 rounded-full bg-(--primaryBlue)/10 text-(--primaryBlue) group-hover:scale-110 transition-transform">
                    <HiOutlineCloudUpload className="text-4xl" />
                </div>

                {/* File to upload text */}
                <div className="space-y-1">
                    <p className="font-semibold text-lg text-(--primaryBlack)">
                        {selectedFile ? selectedFile.name : "Drag & drop your file here"}
                    </p>
                    <p className="text-sm text-(--secondaryBlack)">
                        or <span className="text-(--primaryBlue) underline font-medium">browse files</span> from your computer
                    </p>
                </div>

                {/* Helper text */}
                <p className="text-xs text-(--lightBlack) font-medium">
                    PDF files recommended (Max. 5MB)
                </p>
            </div>

            {
                fileError && (
                    <p className="text-xs text-(--primaryRed) font-medium">{fileError}</p>
                )
            }

            {/* Next Button */}
            <button type="button" disabled={!selectedFile} onClick={handleNextClick}
                className={`w-full font-semibold py-3 px-6 rounded-xl transition-all ${
                    !selectedFile 
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none" 
                        : "bg-(--primaryBlue) hover:opacity-90 text-white cursor-pointer shadow-md shadow-(--primaryBlue)/20 active:scale-[0.99]"
                }`}>
                Next
            </button>
        </div>
    );
}

