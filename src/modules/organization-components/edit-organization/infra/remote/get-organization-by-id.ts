import { Organization } from "@/@types/organizations"
import { api } from "@/lib/axios"

export async function getOrganizationById({
  organizationId,
}: Organization.GetByIdRequest) {
  try {
    const { data } = await api.get<Organization.GetByIdResponse>(
      `/organization/${organizationId}`
    )

    return data.organization
  } catch (error) {
    console.error(error)
  }
}
