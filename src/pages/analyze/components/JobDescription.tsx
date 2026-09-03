import { FaInfoCircle } from "react-icons/fa";

interface JobDescriptionProps {
  onNext?: () => void;
  jobDescription?: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  jobDescriptionError?: string;
  validate: (value: string) => boolean;
  onAnalyze: () => void;
}

export default function JobDescription({ onNext, jobDescription='', handleChange, jobDescriptionError, validate, onAnalyze }: JobDescriptionProps) {
  const wordCount = jobDescription.trim()
      ? jobDescription.trim().split(/\s+/).length
      : 0

  const isValid = wordCount >= 100

  const handleNext = () => {
      if (validate(jobDescription)) {
          onAnalyze()
          onNext?.()
      }
  }

  return (
    <div className="bg-(--white) p-8 sm:p-12 rounded-3xl border border-(--lightBlack)/20 w-full max-w-2xl flex flex-col items-center space-y-6 shadow-xl">
      <div className="w-full space-y-2">
        <h2 className="text-xl font-bold text-(--primaryBlack)">Job Description</h2>
        <p className="text-sm text-(--secondaryBlack)">
          Paste the target job description or role requirements below to analyze your match.
        </p>
      </div>

      <textarea 
        name='jobDescription'
        value={jobDescription}
        onChange={handleChange}
        required
        placeholder="Paste the job description here..."
        className="w-full min-h-55 p-4 border border-(--lightBlack)/30 rounded-2xl focus:outline-none focus:border-(--primaryBlue) focus:ring-2 focus:ring-(--primaryBlue)/20 text-sm text-(--primaryBlack) placeholder:text-(--lightBlack) resize-none"
      />
      {
        jobDescriptionError && (
          <div className="w-full text-left">
            <p className="text-red-500 text-xs flex items-center gap-1"><FaInfoCircle/>{jobDescriptionError}</p>
          </div>
        )
      }

      <button type="button" disabled={!isValid} onClick={handleNext}
        className={`w-full font-semibold py-3 px-6 rounded-xl transition-all ${
          !isValid
            ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
            : "bg-(--primaryBlue) hover:opacity-90 text-white cursor-pointer shadow-md shadow-(--primaryBlue)/20 active:scale-[0.99]"
        }`}>
        Analyze Now
      </button>
    </div>
  );
}
