import { api } from "@/lib/axios"

export const deleteIncomeDetails = async (id: string) => {
  const response = await api.delete(`/income-details/${id}`)
  return response.data
}
