import { Income } from "@/@types/income"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editIncome({
  income_id,
  amount,
  date,
  description,
  document,
  income_group_id,
  income_percentage,
  income_source_id,
  organization_id,
}: Income.UpdateRequest) {
  try {
    const { data } = await api.put(`/income/${income_id}`, {
      amount,
      date,
      description,
      document,
      income_group_id,
      income_percentage,
      income_source_id,
      organization_id,
    })

    return data.message
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
