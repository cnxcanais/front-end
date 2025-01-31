import { BankAccount } from "@/@types/bank-accounts"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function getBankAccounts({ account_id }) {
  try {
    const { data } = await api.get<BankAccount.GetResponse>(
      `/bank-account/account/${account_id}`
    )

    return data.bankAccounts
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
