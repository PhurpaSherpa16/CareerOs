import { useClerk, useUser } from "@clerk/react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useRegisterUser from "../../hooks/registerUser"
import useGetAllResume from "../../hooks/getAllResume.hook"
export default function UserDashboard() {
    const {session, signOut} = useClerk()
    const {isLoaded, user} = useUser()
    const {register, loading: RegisterLoading, error:formError} = useRegisterUser('api/auth/register')

    const {resumes, loading:getAllResumeLoading, error:getAllResumeError} = useGetAllResume('resume/all')

    console.log('resumes', resumes, getAllResumeLoading, getAllResumeError)

    const [loading, setLoading] = useState<string>('Loading...')
    const navigate = useNavigate()

    const getToken = async()=>{
        if (!session){
            console.log('No active session')
            return;
        }

        const token = await session.getToken({
            template: "careeros",
        })
        window.navigator.clipboard.writeText(token || "")
        console.log("token", token)
    }

    const handleLogout = async() => {
        setLoading('Logging out...')
        await signOut()
    }

    useEffect(()=>{
        if (session === null) {
            navigate("/login", { replace: true });
        }
    },[session, navigate])

    useEffect(()=>{
        if (RegisterLoading) return setLoading('Loading...')
        if (formError) return setLoading(formError)
    },[RegisterLoading, formError])

    useEffect(()=>{
        if (session) {
            register().catch((err) => console.log("Register sync error: ", err))
        }
    },[session])

    if(!isLoaded) return <div className="grid gap-2 place-content-center h-screen w-screen">{loading}</div>

  return (
    <div className="grid gap-2 place-content-center h-screen w-screen">
        <h1>Welcome {user?.firstName || 'John'}</h1>
        <p>{user?.primaryEmailAddress?.emailAddress}</p>
        <button onClick={getToken}>Get Token</button>
        <button onClick={handleLogout}>Logout</button>


        <div>
            {resumes?.map((resume: any) => (
                <div key={resume._id}>
                    <p>{resume.title}</p>
                    <p>{resume.description}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

