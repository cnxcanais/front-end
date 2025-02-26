import { Expense } from "@/@types/expense"
import { api } from "@/lib/axios"

export async function getExpenses(
  account_id: string,
  queryParams?: Expense.GetRequestParams
) {
  try {
    const { data } = await api.get<Expense.GetResponse>(
      `/expenses/account/${account_id}`,
      {
        params: queryParams,
      }
    )

    return { expenses: data.expenses, totalPages: data.totalPages }
  } catch (error) {
    console.info(error)
  }
}
