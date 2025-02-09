import { Account } from "@/@types/accounts"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editAccount({
  account_id,
  name,
  enabled,
}: Account.UpdateRequest) {
  try {
    await api.put(`/account/${account_id}`, { name, enabled })
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
