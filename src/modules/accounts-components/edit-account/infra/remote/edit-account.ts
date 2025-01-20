import { Account } from "@/@types/accounts"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editAccount({
  accountId,
  name,
  enabled,
}: Account.UpdateRequest) {
  try {
    await api.put(`/account/${accountId}`, { name, enabled })
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
