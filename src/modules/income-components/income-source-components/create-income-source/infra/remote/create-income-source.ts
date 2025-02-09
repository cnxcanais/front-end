import { IncomeSource } from "@/@types/income-sources"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function createIncomeSource({
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
}: IncomeSource.CreateRequest) {
  try {
    const { data } = await api.post("/income-source", {
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
