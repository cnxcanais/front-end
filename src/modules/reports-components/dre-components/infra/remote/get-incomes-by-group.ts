import { Income } from "@/@types/income"
import { api } from "@/lib/axios"

export async function getIncomesByGroup(
  account_id: string,
  queryParams: Income.GetRequest
) {
  try {
    const { data } = await api.get<Income.GetByGroupsResponse>(
      `/income/group/${account_id}`,
      {
        params: queryParams,
      }
    )

    return data.incomes
  } catch (error) {
    console.info(error)
    return []
  }
}
