import { Income } from "@/@types/income"
import { api } from "@/lib/axios"

export async function getIncomes({
  account_id,
  document,
  start_date,
  end_date,
  organization_id,
  income_source_id,
  income_group_id,
}: Income.GetRequest) {
  try {
    const { data } = await api.get<Income.GetResponse>(
      `/income/account/${account_id}?` +
        (document ? `&document=${document}` : "") +
        (start_date ? `&start_date=${start_date}` : "") +
        (end_date ? `&end_date=${end_date}` : "") +
        (organization_id ? `&organization_id=${organization_id}` : "") +
        (income_source_id ? `&income_source_id=${income_source_id}` : "") +
        (income_group_id ? `&income_group_id=${income_group_id}` : "")
    )

    return data.incomes
  } catch (error) {
    console.error(error)
  }
}
