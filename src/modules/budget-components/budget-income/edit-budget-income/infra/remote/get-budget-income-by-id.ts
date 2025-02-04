import { Budget } from "@/@types/budgets"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function getBudgetIncomeById(budget_income_id: string) {
  try {
    const response = await api.get<Budget.GetIncomeById>(
      `/budget-income/${budget_income_id}`
    )

    return response.data.budgetIncome
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
