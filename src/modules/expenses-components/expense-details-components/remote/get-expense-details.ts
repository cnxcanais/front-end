import { ExpenseDetails } from "@/@types/expense-details"
import { api } from "@/lib/axios"

export async function getExpenseDetails(
  account_id: string,
  queryParams: ExpenseDetails.GetRequest
) {
  try {
    const { data } = await api.get<ExpenseDetails.GetResponse>(
      `/expense-details/account/${account_id}`,
      {
        params: queryParams,
      }
    )

    return data
  } catch (error) {
    console.error(error)
  }
}
