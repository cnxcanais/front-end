import { IncomeDetails } from "@/@types/income-details"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function payIcomeDetailsPartially({
  paid_amount,
  income_details_id,
}: IncomeDetails.UpdatePartialPaymentRequest) {
  try {
    await api.put(`/income-details/partial-payment/${income_details_id}`, {
      paid_amount,
    })
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
