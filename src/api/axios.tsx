import axios, { type AxiosInstance } from "axios";

export const axios_api: AxiosInstance = axios.create({
  baseURL: import.meta.env.MODE === 'development' 
    ? 'http://localhost:9000' 
    : 'http://localhost:9000',
});

export default axios_api;