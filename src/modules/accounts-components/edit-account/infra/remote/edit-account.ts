import { Account } from "@/@types/accounts"
import { api } from "@/lib/axios"

export async function editAccount({
  accountId,
  name,
  enabled,
}: Account.UpdateRequest) {
  try {
    const { data } = await api.put(`/account/${accountId}`, { name, enabled })
    console.log(data)
  } catch (error) {
    console.error(error)
  }
}
