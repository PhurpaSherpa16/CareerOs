import axios_api from "./axios";

export const registerUserAPICall = async ({ url, token }: { url: string; token: string | null }) => {
    try {
        const response = await axios_api.post(
            url,
            {},
            {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            }
        );
        return response.data;
    } catch (error: any) {
        console.log("registerUserAPICall error:", error);
        throw error;
    }
};