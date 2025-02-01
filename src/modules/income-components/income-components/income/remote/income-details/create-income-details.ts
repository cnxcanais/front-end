import { IncomeDetails } from "@/@types/income-details"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function createIncomeDetails(
  details: IncomeDetails.CreateRequest[]
) {
  try {
    const { data } = await api.post(`/income-details`, details)

    return data.message
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
