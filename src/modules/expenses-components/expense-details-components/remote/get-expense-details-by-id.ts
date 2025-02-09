import { ExpenseDetails } from "@/@types/expense-details"
import { api } from "@/lib/axios"

export const getExpenseDetailsById = async (id: string) => {
  const { data } = await api.get<ExpenseDetails.GetbyIdResponse>(
    `/expense-details/${id}`
  )
  return data
}
