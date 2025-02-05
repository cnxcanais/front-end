import { Organization } from "@/@types/organizations"
import { api } from "@/lib/axios"

export async function getOrganizations(
  account_id: string,
  queryParams?: Organization.GetRequest
) {
  try {
    const { data } = await api.get<Organization.GetResponse>(
      `/organization/account/${account_id}`,
      {
        params: queryParams,
      }
    )

    return data.organizations
  } catch (error) {
    console.error(error)
  }
}
