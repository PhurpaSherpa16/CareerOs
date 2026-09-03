import Stepper from "./components/Stepper";
import Analysis from "./components/Analysis";
import JobDescription from "./components/JobDescription";
import ResumeUpload from "./components/ResumeUpload";
import { useState } from "react";
import useGuestAnalysisForm from "../../hooks/analyze/GuestAnalysisForm";
import usePostTempAnalysis from "../../hooks/PostTempAnalysis";

export default function Analyzer() {
  const [activeSteps, setActiveStep] = useState<number>(2);
  const {tempModelData, handleChange, jobDescriptionError, validate,
    fileError, handleFile, handleAanlyze, error:formError
  } = useGuestAnalysisForm()

  const createapiURL = 'analysis/create'
  const {mutate, isPending, data, error} = usePostTempAnalysis({url: createapiURL } )

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
          fileError={fileError}
          selectedFile={tempModelData.selectedFile}
          handleFile={handleFile}
        />
      ),
    },
    {
      id: 1,
      label: "Upload Job Description",
      components: (
        <JobDescription
          onNext={handleNextStep}
          validate={validate}
          handleChange={handleChange}
          onAnalyze={()=>handleAanlyze(mutate)}
          jobDescriptionError={jobDescriptionError}
          jobDescription={tempModelData.jobDescription}/>
      ),
    },
    {
      id: 2,
      label: "Analyze",
      components: (
        <Analysis onReset={() => setActiveStep(0)} 
        error={error} isPending={isPending}
        data={data} formError={formError}/>
      ),
    },
  ]



  return (
    <div className="mainDiv py-8 pt-16 min-h-screen flex flex-col items-center gap-10 space-y-8">
      <div className="w-full flex flex-col items-center gap-16">
        <Stepper 
          steps={steps.map((s) => ({ id: s.id, label: s.label }))} 
          activeStep={activeSteps} 
          onStepClick={(stepId) => setActiveStep(stepId)}/>

        <div className="w-full grid place-items-center">
          {steps[activeSteps].components}
        </div>
      </div>
    </div>
  );
}

