import { Account } from "@/@types/accounts"
import { api } from "@/lib/axios"

export async function getAccountById(id: string) {
  try {
    const { data } = await api.get<Account.GetByIdRequest>(`/account/${id}`)

    return data.account
  } catch (error) {
    console.error(error)
  }
}
