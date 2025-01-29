import { IncomeSource } from "@/@types/income-sources"
import { api } from "@/lib/axios"

export async function getIncomeSources({
  account_id,
}: IncomeSource.GetRequest) {
  try {
    const { data } = await api.get<IncomeSource.GetResponse>(
      `/income-source/account/${account_id}`
    )

    return data.incomeSources
  } catch (error) {
    console.error(error)
  }
}
