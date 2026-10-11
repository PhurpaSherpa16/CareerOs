import { useAuth } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import { getItem } from "../api/get.api";

export default function useGetAllJobs(url: string = 'job/all') {
    const { getToken } = useAuth();

    const response = useQuery({
        queryKey: ['jobs'],
        queryFn: async () => {
            let token: string | null = null;
            try {
                token = await getToken({ template: 'careeros' });
            } catch {
                token = await getToken();
            }

            if (!token) {
                // Fallback to localStorage if available
                token = localStorage.getItem('careerOsUserToken');
            }

            if (!token) {
                throw new Error('No authentication token found. Please sign in again.');
            }

            return getItem({ url, token });
        },
        staleTime: 5 * 60 * 1000,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });

    return {
        jobs: response.data?.data,
        rawData: response.data,
        loading: response.isPending,
        error: response.error ? (response.error.message || "Failed to load job descriptions") : null,
        refetch: response.refetch,
        isSuccess: response.isSuccess,
        isError: response.isError,
    };
}
