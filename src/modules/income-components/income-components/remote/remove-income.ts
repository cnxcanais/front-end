import { Income } from "@/@types/income"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function removeIncome({ income_id }: Income.DeleteRequest) {
  try {
    await api.delete(`/income/${income_id}`)
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
