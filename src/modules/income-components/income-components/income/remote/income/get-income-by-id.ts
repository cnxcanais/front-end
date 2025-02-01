import { Income } from "@/@types/income"
import { api } from "@/lib/axios"

export const getIncomeById = async (id: Income.GetByIdRequest) => {
  const { data } = await api.get<Income.GetByIdResponse>(`/incomes/${id}`)
  return data.income
}
