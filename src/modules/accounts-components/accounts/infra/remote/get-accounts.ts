import { Account } from "@/@types/accounts"
import { api } from "@/lib/axios"

export async function getAccounts() {
  try {
    const { data } = await api.get<Account.GetRequest>("/account")

    return data.accounts
  } catch (error) {
    console.info(error)
  }
}
