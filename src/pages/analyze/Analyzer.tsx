import Stepper from "./components/Stepper";
import Analysis from "./components/Analysis";
import JobDescription from "./components/JobDescription";
import ResumeUpload from "./components/ResumeUpload";
import { useState } from "react";

export default function Analyzer() {
  const [activeSteps, setActiveStep] = useState<number>(2);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");

  const handleNextStep = () => {
    setActiveStep((prev) => Math.min(prev + 1, 2));
  };

  const steps = [
    {
      id: 0,
      label: "Upload Resume",
      components: (
        <ResumeUpload
          onNext={handleNextStep}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      ),
    },
    {
      id: 1,
      label: "Upload Job Description",
      components: (
        <JobDescription
          onNext={handleNextStep}
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}/>
      ),
    },
    {
      id: 2,
      label: "Analyze",
      components: (
        <Analysis onReset={() => setActiveStep(0)} />
      ),
    },
  ];

  return (
    <div className="mainDiv py-8 pt-16 min-h-screen flex flex-col items-center gap-10 space-y-8">
      <div className="w-full flex flex-col items-center gap-8">
        <Stepper steps={steps.map((s) => ({ id: s.id, label: s.label }))} 
          activeStep={activeSteps} 
          onStepClick={(stepId) => setActiveStep(stepId)}/>

        <div className="w-full grid place-items-center">
          {steps[activeSteps].components}
        </div>
      </div>

      {/* Hero text */}
      <div className="space-y-2 text-center max-w-2xl">
        <h1 className="text-3xl font-bold text-(--primaryBlack)">
          Turn Your Resume Into a Stronger Job Match.
        </h1>
        <p className="text-(--secondaryBlack)">
          Get an instant AI-powered ATS-style score, matched skills, missing keywords, and actionable insights.
        </p>
      </div>
    </div>
  );
}

