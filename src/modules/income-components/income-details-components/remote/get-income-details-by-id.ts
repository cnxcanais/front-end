import { IncomeDetails } from "@/@types/income-details"
import { api } from "@/lib/axios"

export async function getIncomeDetailsById(
  id: string
): Promise<IncomeDetails.GetbyIdResponse> {
  try {
    const { data } = await api.get<IncomeDetails.GetbyIdResponse>(
      `/income-details/${encodeURIComponent(id)}`
    )
    return data
  } catch (error) {
    console.error("Error fetching income details by ID:", error)
    return { incomeDetails: null }
  }
}
