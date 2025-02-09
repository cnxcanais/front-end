import { Income } from "@/@types/income"
import { api } from "@/lib/axios"

export async function getIncomes(
  account_id: string,
  queryParams: Income.GetRequest
) {
  try {
    const { data } = await api.get<Income.GetResponse>(
      `/income/account/${account_id}`,
      {
        params: queryParams,
      }
    )

    return data.incomes
  } catch (error) {
    console.error(error)
  }
}
