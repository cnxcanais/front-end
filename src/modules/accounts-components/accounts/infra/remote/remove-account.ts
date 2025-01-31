import { Account } from "@/@types/accounts"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function removeAccount({ account_id }: Account.DeleteRequest) {
  try {
    await api.delete(`/account/${account_id}`)
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
