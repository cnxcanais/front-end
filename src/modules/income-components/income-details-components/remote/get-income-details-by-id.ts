import { IncomeDetails } from "@/@types/income-details"
import { api } from "@/lib/axios"

export const getIncomeDetailsById = async (id: string) => {
  const { data } = await api.get<IncomeDetails.GetbyIdResponse>(
    `/income-details/${id}`
  )
  return data
}
