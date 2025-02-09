import { ExpenseDetails } from "@/@types/expense-details"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function createExpenseDetails(
  details: ExpenseDetails.CreateRequest[]
) {
  try {
    const { data } = await api.post(`/expense-details`, details)

    return data.message
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
