import axios_api from "./axios"

type PostToDbProps<TPayload> = {
  url: string;
  payload: TPayload;
  token: string
};

export default async function PostToDb <TPayload = unknown, TResponse = unknown> ({url, payload, token}: PostToDbProps<TPayload>) {
    const res = await axios_api.post<TResponse>(url, payload, 
        {headers: token ?
            {Authorization: `Bearer ${token}`}
            : undefined
        })
    return res

}