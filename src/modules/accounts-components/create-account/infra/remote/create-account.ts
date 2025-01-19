import { Account } from "@/@types/accounts"
import { api } from "@/lib/axios"

export async function createAccount({ name }: Account.CreateRequest) {
  try {
    const { data } = await api.post("/accounts", { name })
    return data.message
  } catch (error) {
    console.error(error)
  }
}
