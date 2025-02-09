import { Bank } from "@/@types/banks"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editBank(
  bank_id: string,
  { bank_number, name }: Bank.UpdateRequest
) {
  try {
    await api.put(`/bank/${bank_id}`, { bank_number, name })
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
