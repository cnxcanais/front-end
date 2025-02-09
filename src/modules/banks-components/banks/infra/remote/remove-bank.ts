import { Bank } from "@/@types/banks"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function removeBank({ bank_id }: Bank.DeleteRequest) {
  try {
    await api.delete(`/bank/${bank_id}`)
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
