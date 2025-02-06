import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function removeIncomeSource(income_source_id: string) {
  try {
    await api.delete(`/income-source/${income_source_id}`)
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
