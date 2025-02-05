import { Income } from "@/@types/income"
import { api } from "@/lib/axios"

export const getIncomeById = async (id: string) => {
  const { data } = await api.get<Income.GetByIdResponse>(`/income/${id}`)
  return data.income
}
