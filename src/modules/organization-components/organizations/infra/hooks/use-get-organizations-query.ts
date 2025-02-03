import { useQuery } from "@tanstack/react-query"
import { getOrganizations } from "../remote"

export function useGetOrganizationsQuery(account_id: string) {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: () => getOrganizations(account_id),
    enabled: !!account_id,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
