import { useAuth } from "@clerk/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerUserAPICall } from "../api/register";

export default function useRegisterUser(url: string = "api/auth/register") {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            let token: string | null = null;
            try {
                token = await getToken({ template: "careeros" });
            } catch {
                token = await getToken();
            }

            if (!token) {
                throw new Error("No authentication token found. Please sign in again.");
            }

            return registerUserAPICall({ url, token });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError: (error: any) => {
            console.error("User registration failed:", error);
        },
    });

    return {
        ...mutation,
        register: () => mutation.mutateAsync(),
        loading: mutation.isPending,
        error: mutation.error ? (mutation.error.message || "Something went wrong") : null,
    };
}

