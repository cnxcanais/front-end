import { Expense } from "@/@types/expense"
import { api } from "@/lib/axios"

export const getExpenseById = async (id: string) => {
  const { data } = await api.get<Expense.GetByIdResponse>(`/expense/${id}`)
  return data.expense
}
