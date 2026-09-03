import axios, { type AxiosInstance } from "axios";


export const axios_api: AxiosInstance = axios.create({
  baseURL: import.meta.env.MODE === 'development' 
    ? 'http://localhost:9000' 
    : import.meta.env.VITE_API_URL,
});

export default axios_api;