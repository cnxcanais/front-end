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
  execution_date,
  is_over_profit,
  is_over_income,
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
      execution_date,
      is_over_profit,
      is_over_income,
    })

    return data
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
