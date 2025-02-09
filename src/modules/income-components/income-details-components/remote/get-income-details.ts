import { IncomeDetails } from "@/@types/income-details"
import { api } from "@/lib/axios"

export async function getIncomeDetails(
  account_id: string,
  queryParams?: IncomeDetails.GetRequest
) {
  try {
    const { data } = await api.get<IncomeDetails.GetResponse>(
      `/income-details/account/${account_id}`,
      {
        params: queryParams,
      }
    )

    return { incomeDetails: data.incomeDetails, totalPages: data.totalPages }
  } catch (error) {
    console.info(error)
  }
}
