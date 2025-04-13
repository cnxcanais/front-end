import { Account } from "@/@types/accounts"
import { api } from "@/lib/axios"

export async function getAccountById(id: string) {
  try {
    if (!id) {
      throw new Error("ID is required")
    }
    const { data } = await api.get<Account.GetByIdRequest>(`/account/${id}`)
    return data.account
  } catch (error) {
    console.info(error)
  }
}
