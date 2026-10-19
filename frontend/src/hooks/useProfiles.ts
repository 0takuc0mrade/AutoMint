import { useQuery } from "@tanstack/react-query";
import { getUsersBatch, MAX_USERS_BATCH } from "@/lib/contracts";
import { pollWhenVisible } from "@/lib/polling";
import { STALE_TIME, GC_TIME, qk } from "@/lib/queryKeys";
import type { UserProfile } from "@/types";

/**
 * Registry profiles for a batch of addresses, fetched in a single
 * `get_users_batch` simulation instead of one `get_user` RPC round trip per row.
 *
 * Resolves to a map from address to its `UserProfile` (`null` for unregistered
 * addresses). Duplicate/empty addresses are collapsed and at most
 * `MAX_USERS_BATCH` (50) unique addresses are queried per call.
 */
export function useProfiles(addresses: string[]) {
  const batch = Array.from(new Set(addresses.filter(Boolean))).slice(
    0,
    MAX_USERS_BATCH,
  );

  return useQuery<Record<string, UserProfile | null>>({
    queryKey: qk.profiles(batch),
    queryFn: async () => {
      const profiles = await getUsersBatch(batch);
      return Object.fromEntries(
        batch.map((address, index) => [address, profiles[index] ?? null]),
      );
    },
    enabled: batch.length > 0,
    refetchInterval: pollWhenVisible(),
    staleTime: STALE_TIME.STANDARD,
    gcTime: GC_TIME.STANDARD,
  });
}
