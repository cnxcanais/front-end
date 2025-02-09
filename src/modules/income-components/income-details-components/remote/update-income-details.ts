import { IncomeDetails } from "@/@types/income-details"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editIncomeDetails({
  amount,
  bank_account_id,
  part,
  due_date,
  income_id,
  is_paid,
  income_details_id,
}: IncomeDetails.UpdateRequest) {
  try {
    await api.put(`/income-details/${income_details_id}`, {
      amount,
      bank_account_id,
      part,
      due_date,
      income_id,
      is_paid,
    })
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
