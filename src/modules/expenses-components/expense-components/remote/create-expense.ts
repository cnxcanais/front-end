import { Expense } from "@/@types/expense"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function createExpense({
  account_id,
  date,
  description,
  document,
  expense_group_id,
  expense_percentage,
  supplier_id,
  organization_id,
  is_operational,
  is_variable,
}: Expense.CreateRequest) {
  try {
    const { data } = await api.post(`/expenses`, {
      account_id,
      date,
      description,
      document,
      expense_group_id,
      expense_percentage,
      supplier_id,
      organization_id,
      is_operational,
      is_variable,
    })

    return data
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
