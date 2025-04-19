import { Expense } from "@/@types/expense"
import { api } from "@/lib/axios"

export async function getExpenses(
  account_id: string,
  queryParams?: Expense.GetRequestParams
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
