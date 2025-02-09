import { Supplier } from "@/@types/suppliers"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editSupplier({
  supplier_id,
  name,
  address_1,
  address_2,
  address_3,
  account_id,
  cep,
  city,
  contact_name,
  cpf_cnpj,
  state,
  email,
  phone,
}: Supplier.UpdateRequest) {
  try {
    await api.put(`/supplier/${supplier_id}`, {
      name,
      address_1,
      address_2,
      address_3,
      account_id,
      cep,
      city,
      contact_name,
      cpf_cnpj,
      state,
      email,
      phone,
    })
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
