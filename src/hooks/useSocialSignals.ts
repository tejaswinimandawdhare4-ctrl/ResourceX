import { useQuery } from "@tanstack/react-query";
import { fetchSocialSignals } from "@/lib/social-signals";

export function useSocialSignals(city: string, severity?: string) {
  return useQuery({
    queryKey: ["social-signals", city, severity],
    queryFn: () => fetchSocialSignals(city, severity),
    staleTime: 10 * 60 * 1000, // 10 minutes — news doesn't need second-by-second refetching
    retry: false, // don't compound a rate-limit with automatic retries
  });
}