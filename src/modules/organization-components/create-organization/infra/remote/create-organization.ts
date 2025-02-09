import { Organization } from "@/@types/organizations"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function createOrganization({
  name,
  account_id,
  address,
  cnpj,
  email,
  phone,
}: Organization.CreateRequest) {
  try {
    const { data } = await api.post("/organization", {
      name,
      account_id,
      address,
      cnpj,
      email,
      phone,
    })

    return data.message
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
