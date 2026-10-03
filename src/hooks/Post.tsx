import { useMutation } from "@tanstack/react-query"
import PostToDb from "../api/post"

type UsePostOptiosn = {
    url: string,
    token: string
}

export default function usePost<TPayload = unknown, TResponse = unknown>({ url, token }: UsePostOptiosn) {

    return useMutation({
        mutationFn: (payload: TPayload) => PostToDb<TPayload, TResponse>({ url, payload, token }),
        onError: (error: any) => {
            const message = error?.response?.data?.message ||
                "Something went wrong. Please try again.";
            console.log('Error in post temp analysis', message)
        }
    })

}