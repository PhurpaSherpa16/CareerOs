import { useMutation, useQueryClient } from "@tanstack/react-query"
import TempAnalysisPost from "../api/temp.analysis.post"


export default function usePostTempAnalysis({url}: {url: string}) {
    
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (payload: FormData) => {return TempAnalysisPost({ url, payload })},
        onSuccess:(data:any)=>{
            const responsePayload = data?.data?.result?.data;
            if (responsePayload) {
                const guestId = responsePayload?.user?.id || responsePayload?.guestId || responsePayload?.newRecord?.guestId || data?.guestId;
                if (guestId) {
                    localStorage.setItem("guestId", guestId);
                }
                localStorage.setItem("analysisData", JSON.stringify(responsePayload));
                queryClient.invalidateQueries({queryKey: ['get_guest_analysis']});
            } else {
                console.log('Error in post temp analysis', data);
            }
        },
        onError:(error:any)=>{
            const message = error?.response?.data?.message ||
                "Something went wrong. Please try again.";
            console.log('Error in post temp analysis', message)
        }
    })
    
    return {
        ...mutation,
    }
}
