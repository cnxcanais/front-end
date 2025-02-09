import { Income } from "@/@types/income"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function createIncome({
  account_id,
  date,
  description,
  document,
  income_group_id,
  income_percentage,
  income_source_id,
  organization_id,
}: Income.CreateRequest) {
  try {
    const { data } = await api.post(`/income`, {
      account_id,
      date,
      description,
      document,
      income_group_id,
      income_percentage,
      income_source_id,
      organization_id,
    })

    return data
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
