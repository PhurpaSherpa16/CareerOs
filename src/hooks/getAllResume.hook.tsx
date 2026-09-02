import { useAuth } from "@clerk/react"
import { useQuery } from "@tanstack/react-query"
import { getItem } from "../api/get.api"


export default function useGetAllResume(url: string){
    const {getToken} = useAuth()

    const response = useQuery({
        queryKey: ['resumes'],
        queryFn:async()=>{
            let token : string | null = null
            try {
                token = await getToken({template:'careeros'})
            } catch {
                token = await getToken()
            }
            
            if (!token) throw new Error('No authentication token found.Please sign in again.')
            
            return getItem({url, token})
        },
        staleTime: 5 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    return {
        resumes : response.data?.data,
        loading: response.isPending,
        error: response.error ? (response.error.message || "Something went wrong") : null,
    }
}
