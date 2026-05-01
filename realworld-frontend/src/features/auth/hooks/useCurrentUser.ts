import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/features/auth/api/authApi";
import { getToken } from "@/lib/auth";
import { queryKeys } from "@/lib/queryKeys";

export function useCurrentUser() {
  const hasToken = Boolean(getToken());

  return useQuery({
    queryKey: queryKeys.auth.currentUser,
    queryFn: getCurrentUser,
    enabled: hasToken,
  });
}
