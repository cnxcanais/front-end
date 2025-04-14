import { Expense } from "@/@types/expense"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editExpense({
  expense_id,
  amount,
  date,
  description,
  document,
  expense_group_id,
  expense_percentage,
  supplier_id,
  organization_id,
  account_id,
}: Expense.UpdateRequest) {
  try {
    const { data } = await api.put(`/expenses/${expense_id}`, {
      amount,
      date,
      description,
      document,
      expense_group_id,
      expense_percentage,
      supplier_id,
      organization_id,
      account_id,
    })

    return data.message
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
