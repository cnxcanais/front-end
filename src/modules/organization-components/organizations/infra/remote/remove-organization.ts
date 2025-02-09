import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function removeOrganization(organization_id: string) {
  try {
    await api.delete(`/organization/${organization_id}`)
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
