import { IncomeDetails } from "@/@types/income-details"
import { api } from "@/lib/axios"

export const getIncomeDetailsById = async (id: IncomeDetails.GetRequest) => {
  const { data } = await api.get<IncomeDetails.GetResponse>(
    `/income-details/${id}`
  )
  return data.incomeDetails
}
