import { useQuery } from "@tanstack/react-query";

export function useOAuthConfig() {
  const { 
    data: googleConfig, 
    isLoading: isLoadingGoogle 
  } = useQuery({
    queryKey: ["/api/auth/google/is-configured"],
    queryFn: async () => {
      const res = await fetch("/api/auth/google/is-configured");
      if (!res.ok) {
        throw new Error("Failed to fetch Google OAuth configuration");
      }
      return res.json();
    },
  });

  return {
    googleEnabled: googleConfig?.isConfigured || false,
    isLoadingGoogleConfig: isLoadingGoogle,
  };
}