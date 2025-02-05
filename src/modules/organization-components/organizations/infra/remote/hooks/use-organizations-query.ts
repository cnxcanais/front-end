import { Organization } from "@/@types/organizations"
import { getOrganizations } from "@/modules/organization-components/organizations/infra/remote"
import { useQuery } from "@tanstack/react-query"

export function useOrganizationsQuery(
  account_id: string,
  queryParams?: Organization.GetRequest
) {
  return useQuery({
    queryKey: ["income-source"],
    queryFn: () => getOrganizations(account_id, queryParams),
    enabled: !!account_id,
  })
}
