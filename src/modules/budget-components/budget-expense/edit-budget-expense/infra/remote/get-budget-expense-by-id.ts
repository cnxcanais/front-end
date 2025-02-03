import { Budget } from "@/@types/budgets"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function getBudgetExpenseById(budget_expense_id: string) {
  try {
    const response = await api.get<Budget.GetExpenseById>(
      `/budget-expense/${budget_expense_id}`
    )

    return response.data.budgetExpense
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
