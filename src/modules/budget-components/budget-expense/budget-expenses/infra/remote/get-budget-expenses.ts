import { Budget } from "@/@types/budgets"
import { api } from "@/lib/axios"

export async function getBudgetExpenses(
  account_id: string,
  queryParams: Budget.QueryParamsExpense
) {
  try {
    const { data } = await api.get<Budget.GetExpenses>(
      `/budget-expense/account/${account_id}`,
      {
        params: queryParams,
      }
    )

    return data.budgetExpenses
  } catch (error) {
    console.info(error)
  }
}
