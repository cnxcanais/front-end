import { IncomeDetails } from "@/@types/income-details"
import { api } from "@/lib/axios"

export async function getIncomeDetailsByMonth(
  accountId: string,
  year: number
): Promise<IncomeDetails.GetByMonthResponse> {
  try {
    const { data } = await api.get<IncomeDetails.GetByMonthResponse>(
      `/income-details/month/${encodeURIComponent(accountId)}/${year}`
    )
    return data
  } catch (error) {
    console.error("Error fetching income details:", error)
    return { totalPerMonth: [] }
  }
}
