import { getOrganizations } from "@/modules/organization-components/organizations/infra/remote"
import { useQuery } from "@tanstack/react-query"

export function useOrganizationsQuery(account_id: string) {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: () => getOrganizations(account_id),
    enabled: !!account_id,
  })
}
