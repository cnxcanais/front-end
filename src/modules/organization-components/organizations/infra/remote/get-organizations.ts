import { Organization } from "@/@types/organizations"
import { api } from "@/lib/axios"

export async function getOrganizations({ accountId }: Organization.GetRequest) {
  try {
    const { data } = await api.get<Organization.GetResponse>(
      `/organization/account/${accountId}`
    )

    return data.organizations
  } catch (error) {
    console.error(error)
  }
}
