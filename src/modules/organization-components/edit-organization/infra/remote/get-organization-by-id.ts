import { Organization } from "@/@types/organizations"
import { api } from "@/lib/axios"

export async function getOrganizationById(organization_id: string) {
  try {
    const { data } = await api.get<Organization.GetByIdResponse>(
      `/organization/${organization_id}`
    )

    return data.organization
  } catch (error) {
    console.error(error)
  }
}
