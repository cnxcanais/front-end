import { Expense } from "@/@types/expense"
import { api } from "@/lib/axios"

export async function getExpensesByGroup(
  account_id: string,
  queryParams: Expense.GetRequestParams
) {
  try {
    const { data } = await api.get<Expense.GetByGroupsResponse>(
      `/expenses/group/${account_id}`,
      {
        params: queryParams,
      }
    )

    return data.expenses
  } catch (error) {
    console.info(error)
    return []
  }
}
