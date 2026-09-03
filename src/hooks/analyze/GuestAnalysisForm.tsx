import { useState, useEffect } from "react"


export default function useGuestAnalysisForm() {
    const [tempModelData, setTempModelData] = useState<{
        guestId: string,
        selectedFile: File | null,
        jobDescription: string,
    }>({guestId: "", selectedFile: null, jobDescription: ""})

    const [jobDescriptionError, setJobDescriptionError] = useState<string>("")
    const [fileError, setFileError] = useState<string>("")

    useEffect(() => {
        const storedGuestId = localStorage.getItem("guestId")
        if (storedGuestId) {
            setTempModelData((prev) => ({ ...prev, guestId: storedGuestId }))
        }
    }, [])

    const validate = (value: string) => {
        const wordCount = value.trim()
            ? value.trim().split(/\s+/).length
            : 0

        if (wordCount === 0) {
            setJobDescriptionError(
                "Please enter a job description"
            )
            return false
        }

        if (wordCount < 100) {
            setJobDescriptionError(
                "Job description must be at least 100 words long"
            )
            return false
        }

        setJobDescriptionError("")
        return true
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        const {name, value} = e.target
        setTempModelData((prev) => ({
            ...prev,
            [name]: value,
        }))
        if (jobDescriptionError) {
            setJobDescriptionError("")
        }
    }

    const handleFile = (file: File) =>{
        if(file){
            setTempModelData({
                ...tempModelData,
                selectedFile: file
            })
            setFileError("")
        }
        else {
            setFileError("Please select a file")
        }
    }

    const handleAanlyze = (mutate: any) =>{
        const formData = new FormData()
        const storedGuestId = localStorage.getItem("guestId") || tempModelData.guestId
        if (storedGuestId) {
            formData.append('guestId', storedGuestId)
        }
        formData.append('jobDescription', tempModelData.jobDescription)
        if(tempModelData.selectedFile){
            formData.append('resume', tempModelData.selectedFile)
        }

        try {
            mutate(formData)
        } catch (error) {
            console.log('handle analyze error', error)
        }
    }

    const handleRemoveFile = () =>{
        setTempModelData({
            ...tempModelData,
            selectedFile: null
        })
    }


  return {tempModelData, setTempModelData, jobDescriptionError, handleChange, 
    handleFile, handleRemoveFile, validate, fileError, handleAanlyze
    }
}

