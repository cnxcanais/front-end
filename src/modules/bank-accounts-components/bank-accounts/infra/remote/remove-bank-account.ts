import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function removeBankAccount(id: string) {
  try {
    await api.delete(`/bank-account/${id}`)
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
