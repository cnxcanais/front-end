import { getProfiles } from "@/modules/profiles-components/profiles/remote/infra/get-profiles"
import { useQuery } from "@tanstack/react-query"

export function useGetProfilesQuery(account_id: string) {
  return useQuery({
    queryKey: ["profiles", account_id],
    queryFn: () => getProfiles(account_id),
    enabled: !!account_id,
  })
}
