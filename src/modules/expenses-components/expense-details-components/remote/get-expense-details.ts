import { ExpenseDetails } from "@/@types/expense-details"
import { api } from "@/lib/axios"

export async function getExpenseDetails(
  account_id: string,
  queryParams: ExpenseDetails.GetRequestParams
) {
  try {
    if (queryParams?.start_date) {
      const startDate = new Date(queryParams.start_date)
      startDate.setUTCHours(0, 0, 0, 0)
      queryParams.start_date = startDate.toDateString()
    }

    if (queryParams?.end_date) {
      const endDate = new Date(queryParams.end_date)
      endDate.setUTCHours(0, 0, 0, 0)
      queryParams.end_date = endDate.toDateString()
    }
    const { data } = await api.get<ExpenseDetails.GetResponse>(
      `/expense-details/account/${account_id}`,
      {
        params: queryParams,
      }
    )

    return data
  } catch (error) {
    console.info(error)
  }
}
