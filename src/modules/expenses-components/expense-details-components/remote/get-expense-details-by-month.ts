import { ExpenseDetails } from "@/@types/expense-details"

import { api } from "@/lib/axios"

export const getExpenseDetailsByMonth = async (
  account_id: string,
  year: number
) => {
  const { data } = await api.get<ExpenseDetails.GetByMonthResponse>(
    `/expense-details/month/${account_id}/${year}`
  )
  return data
}
