import { IncomeDetails } from "@/@types/income-details"
import { api } from "@/lib/axios"

export async function getIncomeDetails(
  account_id: string,
  queryParams?: IncomeDetails.GetRequestParams
) {
  try {
    if (queryParams?.start_date) {
      const startDate = new Date(queryParams.start_date)
      startDate.setUTCHours(0, 0, 0, 0)
      queryParams.start_date = startDate
    }

    if (queryParams?.end_date) {
      const endDate = new Date(queryParams.end_date)
      endDate.setUTCHours(0, 0, 0, 0)
      queryParams.end_date = endDate
    }
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
