import { Income } from "@/@types/income"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function createIncome({
  account_id,
  amount,
  date,
  description,
  document,
  income_group_id,
  income_percentage,
  income_source_id,
  organization_id,
  parts_qty,
}: Income.CreateResquest) {
  try {
    const { data } = await api.post(`/income`, {
      account_id,
      amount,
      date,
      description,
      document,
      income_group_id,
      income_percentage,
      income_source_id,
      organization_id,
      parts_qty,
    })

    return data.message
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
