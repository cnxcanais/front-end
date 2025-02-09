import { IncomeSource } from "@/@types/income-sources"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editIncomeSource({
  income_source_id,
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
}: IncomeSource.UpdateRequest) {
  try {
    await api.put(`/income-source/${income_source_id}`, {
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
