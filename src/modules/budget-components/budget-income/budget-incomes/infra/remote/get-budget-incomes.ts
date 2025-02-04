import { Budget } from "@/@types/budgets"
import { api } from "@/lib/axios"

export async function getBudgetIncomes(
  account_id: string,
  queryParams: Budget.QueryParamsIncome
) {
  try {
    const { data } = await api.get<Budget.GetIncomes>(
      `/budget-income/account/${account_id}`,
      {
        params: queryParams,
      }
    )

    return data.budgetIncomes
  } catch (error) {
    console.error(error)
  }
}
