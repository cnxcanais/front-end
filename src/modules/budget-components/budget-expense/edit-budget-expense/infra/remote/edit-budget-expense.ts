import { Budget } from "@/@types/budgets"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editBudgetExpense({
  budget_expense_id,
  account_id,
  amount,
  date,
  description,
  expense_group_id,
}: Budget.UpdateExpense) {
  try {
    const response = await api.put(`/budget-expense/${budget_expense_id}`, {
      account_id,
      amount,
      date,
      description,
      expense_group_id,
    })

    return response.data.message
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
