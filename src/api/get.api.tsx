import axios_api from "./axios"


export const getItem = async ({url, token}: {url:string, token:string|null}) =>{
    try{
        const response = await axios_api.get(url, {
            headers: token ? {Authorization: `Bearer ${token}`} : undefined,
        })
        return response.data
    }catch(error:any){
        console.log("getAllResumeAPICall error:", error)
        throw error
    }
}