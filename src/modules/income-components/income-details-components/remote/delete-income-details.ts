import { IncomeDetails } from "@/@types/income-details"
import { api } from "@/lib/axios"

export const deleteIncomeDetails = async (id: IncomeDetails.DeleteRequest) => {
  const response = await api.delete(`/income-details/${id}`)
  return response.data
}
