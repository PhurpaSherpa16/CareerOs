import Stepper from "./components/Stepper";
import Analysis from "./components/Analysis";
import JobDescription from "./components/JobDescription";
import ResumeUpload from "./components/ResumeUpload";
import { useEffect, useState } from "react";
import useGuestAnalysisForm from "../../hooks/analyze/GuestAnalysisForm";
import usePostTempAnalysis from "../../hooks/PostTempAnalysis";

export default function Analyzer() {
  const [activeSteps, setActiveStep] = useState<number>(2);
  const {tempModelData, handleChange, jobDescriptionError, validate,
    fileError, handleFile, handleAanlyze
  } = useGuestAnalysisForm()

  // API connection
  // this will call the API url, 
  // if new, backend guest Id create and or after analysis creating guestId is return we store in localstorage
  // everytime when anlysis button is hit , it check local storage guestID, if guestID is there then send otherwise 
  // create new guest and store in localstorage
  // frontend file and JD is sent request for new or guestId is also sent for update
  const createapiURL = 'analysis/create'
  const {mutate, isPending, data, error} = usePostTempAnalysis({url: createapiURL } )

  console.log('tempPostAanalysis', data, isPending, error)

  const handleNextStep = () => {
    setActiveStep((prev) => Math.min(prev + 1, 2));
  };

  const handleAanalysis = () => {
    handleAanlyze(mutate)
  }


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
          onAnalyze={handleAanalysis}
          jobDescriptionError={jobDescriptionError}
          jobDescription={tempModelData.jobDescription}/>
      ),
    },
    {
      id: 2,
      label: "Analyze",
      components: (
        <Analysis onReset={() => setActiveStep(0)} 
        error={error} isPending={isPending}/>
      ),
    },
  ]

  const tempData = data?.data?.result?.data

  useEffect(() => {
    if(data){
      const guestId = tempData?.guestId
      localStorage.setItem('guestId', guestId)
      localStorage.setItem('analysisData', JSON.stringify(tempData))
    }else if(error){
      const analysisData = JSON.parse(localStorage.getItem('analysisData') || '{}')
    }
  }, [data])


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

