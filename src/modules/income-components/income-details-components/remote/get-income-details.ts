import { IncomeDetails } from "@/@types/income-details"
import { api } from "@/lib/axios"

export async function getIncomeDetails({
  account_id,
  start_date,
  end_date,
  is_paid,
  bank_account_id,
}: IncomeDetails.GetRequest) {
  try {
    const { data } = await api.get<IncomeDetails.GetResponse>(
      `/income-details/account/${account_id}?` +
        (start_date ? `&start_date=${start_date}` : "") +
        (end_date ? `&end_date=${end_date}` : "") +
        (is_paid ? `&is_paid=${is_paid}` : "") +
        (bank_account_id ? `&bank_account_id=${bank_account_id}` : "")
    )

    return data.incomeDetails
  } catch (error) {
    console.error(error)
  }
}
