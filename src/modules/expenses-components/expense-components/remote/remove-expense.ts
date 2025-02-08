import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function removeExpense(expense_id: string) {
  try {
    await api.delete(`/expense/${expense_id}`)
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
