import { Account } from "@/@types/accounts"
import { api } from "@/lib/axios"

export async function editAccount({
  name,
  accountId,
  enabled,
}: Account.UpdateRequest) {
  try {
    const { data } = await api.put(`/accounts/${accountId}`, { name, enabled })
    console.log(data)
  } catch (error) {
    console.error(error)
  }
}
