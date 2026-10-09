import { useAuth } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import { getItem } from "../api/get.api";

export interface UserDetailsResponse {
  userId: string;
  token?: string;
  userDetails?: {
    id: string;
    firstName?: string;
    first_name?: string;
    lastName?: string;
    last_name?: string;
    emailAddresses?: Array<{ emailAddress: string; email_address?: string }>;
    email_addresses?: Array<{ email_address: string }>;
    imageUrl?: string;
    image_url?: string;
    phoneNumbers?: Array<{ phoneNumber: string; phone_number?: string }>;
    phone_numbers?: Array<{ phone_number: string }>;
    profileImageUrl?: string;
    profile_image_url?: string;
    [key: string]: any;
  };
  dbUser?: {
    id: string;
    clerkUserId: string;
    createdAt: string;
    updatedAt: string;
    aiModel?: any;
  };
  aiModel?: {
    id: string;
    userId: string;
    modelId: string;
    model?: {
      id: string;
      model: string;
      modelProvider: string;
    };
  } | null;
  hasAiModel: boolean;
}

export default function useGetUserDetails(url: string = "api/auth/me") {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const response = useQuery({
    queryKey: ["userDetails", url],
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
    enabled: isLoaded && isSignedIn,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const rawData = response.data?.data as UserDetailsResponse | undefined;

  return {
    data: rawData,
    userDetails: rawData?.userDetails,
    dbUser: rawData?.dbUser,
    aiModel: rawData?.aiModel,
    hasAiModel: rawData?.hasAiModel ?? !!rawData?.aiModel,
    loading: response.isPending,
    error: response.error ? (response.error.message || "Failed to load user details") : null,
    refetch: response.refetch,
  };
}
