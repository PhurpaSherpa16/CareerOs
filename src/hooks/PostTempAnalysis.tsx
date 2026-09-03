import { useMutation, useQueryClient } from "@tanstack/react-query"
import TempAnalysisPost from "../api/temp.analysis.post"


export default function usePostTempAnalysis({url}: {url: string}) {
    
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (payload: FormData) => {return TempAnalysisPost({ url, payload })},
        onSuccess:(data:any)=>{
            if (data?.status === 200 || data?.status === 201 || data?.data?.success || data?.success) {
                const guestId = data?.data?.data?.guestId || data?.data?.guestId || data?.guestId
                if (guestId) {
                    localStorage.setItem("guestId", guestId)
                }
                console.log("Analysis created:", data)
                queryClient.invalidateQueries({queryKey: ['get_guest_analysis']})
            }else{
                console.log('Error in post temp analysis', data)
            }
        },
        onError:(error:any)=>{
            console.log('Error in post temp analysis', error)
        }
    })
    
    return {
        ...mutation,
    }
}
