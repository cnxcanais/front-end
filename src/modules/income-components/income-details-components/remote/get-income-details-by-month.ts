import { IncomeDetails } from "@/@types/income-details"
import { api } from "@/lib/axios"

export const getIncomeDetailsByMonth = async (
  account_id: string,
  year: number
) => {
  const { data } = await api.get<IncomeDetails.GetByMonthResponse>(
    `/income-details/month/${account_id}/${year}`
  )
  return data
}
