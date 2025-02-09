import { Expense } from "@/@types/expense"
import { api } from "@/lib/axios"

export async function getExpenses(
  account_id: string,
  queryParams?: Expense.GetRequest
) {
  try {
    const { data } = await api.get<Expense.GetResponse>(
      `/expenses/account/${account_id}`,
      {
        params: queryParams,
      }
    )

    return data.expenses
  } catch (error) {
    console.error(error)
  }
}
