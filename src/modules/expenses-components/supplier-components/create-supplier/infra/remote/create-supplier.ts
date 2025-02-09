import { Supplier } from "@/@types/suppliers"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function createSupplier({
  name,
  account_id,
  address_1,
  address_2,
  address_3,
  cep,
  city,
  contact_name,
  cpf_cnpj,
  email,
  phone,
  state,
}: Supplier.CreateRequest) {
  try {
    const { data } = await api.post("/supplier", {
      name,
      account_id,
      address_1,
      address_2,
      address_3,
      cep,
      city,
      contact_name,
      cpf_cnpj,
      email,
      phone,
      state,
    })

    return data.message
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
