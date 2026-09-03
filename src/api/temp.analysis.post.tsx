import axios_api from "./axios"

export default async function TempAnalysisPost({ url, payload }: { url: string, payload: FormData }) {
    try {
        const res = await axios_api.post(url, payload)
        return res
    } catch (error: any) {
        console.log('Error:', error)
        throw error
    }
}