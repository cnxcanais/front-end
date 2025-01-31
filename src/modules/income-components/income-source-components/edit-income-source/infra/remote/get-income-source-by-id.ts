import { IncomeSource } from "@/@types/income-sources"
import { api } from "@/lib/axios"

export async function getIncomeSourceById({
  income_source_id,
}: IncomeSource.GetByIdRequest) {
  try {
    const { data } = await api.get<IncomeSource.GetByIdResponse>(
      `/income-source/${income_source_id}`
    )

    return data.incomeSource
  } catch (error) {
    console.error(error)
  }
}
