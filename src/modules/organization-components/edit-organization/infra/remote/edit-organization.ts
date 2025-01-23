import { Organization } from "@/@types/organizations"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editOrganization({
  organizationId,
  name,
  address,
  cnpj,
  email,
  phone,
}: Organization.UpdateRequest) {
  try {
    await api.put(`/organization/${organizationId}`, {
      organizationId,
      name,
      address,
      cnpj,
      email,
      phone,
    })
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
