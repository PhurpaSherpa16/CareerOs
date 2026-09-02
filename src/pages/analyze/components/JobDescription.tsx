import { useState } from 'react';

interface JobDescriptionProps {
  onNext?: () => void;
  jobDescription?: string;
  setJobDescription?: (jd: string) => void;
}

export default function JobDescription({ onNext, jobDescription: externalJd, setJobDescription: setExternalJd }: JobDescriptionProps) {
  const [internalJd, setInternalJd] = useState<string>('');
  const jobDescription = externalJd !== undefined ? externalJd : internalJd;
  const setJobDescription = setExternalJd || setInternalJd;

  const isValid = jobDescription.trim().length > 0;

  const handleNext = () => {
    if (isValid && onNext) {
      onNext();
    }
  };

  return (
    <div className="bg-(--white) p-8 sm:p-12 rounded-3xl border border-(--lightBlack)/20 w-full max-w-2xl flex flex-col items-center space-y-6 shadow-xl">
      <div className="w-full space-y-2">
        <h2 className="text-xl font-bold text-(--primaryBlack)">Job Description</h2>
        <p className="text-sm text-(--secondaryBlack)">
          Paste the target job description or role requirements below to analyze your match.
        </p>
      </div>

      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the job description here..."
        className="w-full min-h-55 p-4 border border-(--lightBlack)/30 rounded-2xl focus:outline-none focus:border-(--primaryBlue) focus:ring-2 focus:ring-(--primaryBlue)/20 text-sm text-(--primaryBlack) placeholder:text-(--lightBlack) resize-none"
      />

      <button
        type="button"
        disabled={!isValid}
        onClick={handleNext}
        className={`w-full font-semibold py-3 px-6 rounded-xl transition-all ${
          !isValid
            ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
            : "bg-(--primaryBlue) hover:opacity-90 text-white cursor-pointer shadow-md shadow-(--primaryBlue)/20 active:scale-[0.99]"
        }`}
      >
        Analyze Now
      </button>
    </div>
  );
}
