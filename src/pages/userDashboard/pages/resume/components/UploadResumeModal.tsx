import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/react';
import { useQueryClient } from '@tanstack/react-query';
import Icons from '../../../../../utils/Icons';
import ResumeUpload from '../../newAnalysis/components/ResumeUpload';
import ResumePreview from '../../newAnalysis/components/ResumePreview';
import usePost from '../../../../../hooks/Post';
import ResumeProgressModal from './ResumeProgressModal';

interface UploadResumeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ResumeUploadResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        title: string;
        fileUrl?: string;
        [key: string]: unknown;
    };
}

export default function UploadResumeModal({ isOpen, onClose }: UploadResumeModalProps) {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    const [token, setToken] = useState<string>(() => localStorage.getItem('careerOsUserToken') || '');
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [isProgressModalOpen, setIsProgressModalOpen] = useState<boolean>(false);
    const [uploadErrorMsg, setUploadErrorMsg] = useState<string | null>(null);

    // Refresh token if needed
    useEffect(() => {
        if (!token) {
            getToken({ template: 'careeros' })
                .then((t) => {
                    if (t) {
                        localStorage.setItem('careerOsUserToken', t);
                        setToken(t);
                    }
                })
                .catch(() => {
                    getToken().then((t) => {
                        if (t) {
                            localStorage.setItem('careerOsUserToken', t);
                            setToken(t);
                        }
                    });
                });
        }
    }, [token, getToken]);

    const postResumeURL = 'resume/create';

    const {
        mutateAsync: resumeMutateAsync,
        reset: resetResumeMutation,
        isPending: resumeIsPending,
        isSuccess: resumeIsSuccess,
        isError: resumeIsError,
        error: resumeError,
    } = usePost<FormData, ResumeUploadResponse>({ url: postResumeURL, token: token || '' });

    const handleFileSelect = (file: File | null) => {
        setFileError(null);
        setUploadErrorMsg(null);
        if (!file) {
            setResumeFile(null);
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setFileError('File size exceeds 10MB limit. Please upload a smaller file.');
            return;
        }
        setResumeFile(file);
    };

    const handleUpload = async () => {
        if (!resumeFile) {
            setFileError('Please select a resume file (PDF, DOCX, TXT)');
            return;
        }

        setFileError(null);
        setUploadErrorMsg(null);
        resetResumeMutation();
        setIsProgressModalOpen(true);

        try {
            const resumeFormData = new FormData();
            resumeFormData.append('resume', resumeFile);
            const resumeRes = await resumeMutateAsync(resumeFormData);
            const uploadedResumeId = resumeRes?.data?.data?.id;

            if (!uploadedResumeId) {
                throw new Error('Failed to retrieve resume ID from upload response.');
            }

            // Invalidate query to refresh resumes across the app
            queryClient.invalidateQueries({ queryKey: ['resumes'] });
        } catch (err: any) {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                'Failed to upload resume. Please try again.';
            setUploadErrorMsg(message);
        }
    };

    const handleCloseProgressModal = () => {
        setIsProgressModalOpen(false);
        if (resumeIsSuccess) {
            setResumeFile(null);
            resetResumeMutation();
            onClose();
        }
    };

    const handleCloseAll = () => {
        if (resumeIsPending) return;
        setResumeFile(null);
        setFileError(null);
        setUploadErrorMsg(null);
        resetResumeMutation();
        setIsProgressModalOpen(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="upload-resume-modal-title"
                className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fadeIn"
            >
                <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
                    {/* Header */}
                    <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-(--primaryBlue)/10 text-(--primaryBlue) flex items-center justify-center shrink-0 border border-(--primaryBlue)/15">
                                <Icons name="upload" size="md" />
                            </div>
                            <div>
                                <h2 id="upload-resume-modal-title" className="text-base sm:text-lg font-bold text-(--primaryBlack)">
                                    Upload Resume
                                </h2>
                                <p className="text-xs text-slate-500 hidden sm:block">
                                    Upload your resume to view ATS optimization, skills breakdown, and match reports
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleCloseAll}
                            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                            aria-label="Close modal"
                        >
                            <Icons name="close" size="sm" />
                        </button>
                    </div>

                    {/* Scrollable Modal Content */}
                    <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
                        <p className="text-[11px] text-slate-500">
                            Upload your resume on the left. The live preview updates on the right.
                        </p>

                        {/* Resume Upload & Preview Side-by-Side (responsive) */}
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-start gap-6 lg:gap-8">
                            {/* Left: Upload Section */}
                            <div className="w-full lg:w-1/2">
                                <ResumeUpload
                                    selectedFile={resumeFile}
                                    onFileSelect={handleFileSelect}
                                    fileError={fileError}
                                />
                            </div>

                            {/* Right: Scrollable Preview Section */}
                            <div className="w-full lg:w-1/2">
                                <ResumePreview selectedFile={resumeFile} />
                            </div>
                        </div>
                    </div>

                    {/* Footer Action Bar */}
                    <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                        <div className="flex items-center gap-2 text-xs">
                            {resumeFile ? (
                                <span className="inline-flex items-center gap-2 text-slate-700">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>Selected: </span>
                                    <strong className="font-semibold text-slate-900 truncate max-w-xs sm:max-w-sm">
                                        {resumeFile.name}
                                    </strong>
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-2 text-slate-400">
                                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                                    <span>No resume selected yet</span>
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                            <button
                                type="button"
                                onClick={handleCloseAll}
                                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={!resumeFile || resumeIsPending}
                                onClick={handleUpload}
                                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                                    !resumeFile || resumeIsPending
                                        ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                                        : 'bg-(--primaryBlue) hover:bg-blue-700 text-white shadow-(--primaryBlue)/25 cursor-pointer active:scale-98'
                                }`}
                            >
                                <Icons name="upload" size="xs" />
                                <span>{resumeIsPending ? 'Uploading...' : 'Upload Resume'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resume Upload Status Progress Modal */}
            <ResumeProgressModal
                isOpen={isProgressModalOpen}
                resumeStatus={{
                    isPending: resumeIsPending,
                    isSuccess: resumeIsSuccess,
                    isError: resumeIsError || Boolean(uploadErrorMsg),
                }}
                errorMessage={
                    uploadErrorMsg ||
                    (resumeError
                        ? (resumeError as any)?.response?.data?.message || resumeError?.message
                        : null)
                }
                onRetry={handleUpload}
                onClose={handleCloseProgressModal}
            />
        </>
    );
}
