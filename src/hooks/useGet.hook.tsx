import { useAuth } from "@clerk/react";
import { useQuery, type QueryKey } from "@tanstack/react-query";
import { getItem } from "../api/get.api";

interface UseGetOptions {
  queryKey?: QueryKey;
  enabled?: boolean;
  staleTime?: number;
}

export default function useGet<TData = any>(url: string, options?: UseGetOptions) {
  const { getToken } = useAuth();

  const response = useQuery({
    queryKey: options?.queryKey || [url],
    queryFn: async () => {
      let token: string | null = null;
      try {
        token = await getToken({ template: "careeros" });
      } catch {
        token = await getToken();
      }

      if (!token) {
        throw new Error("No authentication token found. Please sign in again.");
      }

      return getItem({ url, token });
    },
    enabled: options?.enabled !== undefined ? options.enabled : !!url,
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    data: (response.data?.data ?? response.data) as TData | undefined,
    rawData: response.data,
    loading: response.isPending,
    error: response.error ? (response.error.message || "Something went wrong") : null,
    isSuccess: response.isSuccess,
    isError: response.isError,
    refetch: response.refetch,
  };
}
