import { Account } from "@/@types/accounts"
import { api } from "@/lib/axios"

export async function getAccountById(id: string) {
  try {
    const { data } = await api.get<Account.GetRequest>(`/account/${id}`)

    return data.accounts
  } catch (error) {
    console.info(error)
  }
}
