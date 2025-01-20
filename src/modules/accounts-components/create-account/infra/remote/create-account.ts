import { Account } from "@/@types/accounts"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function createAccount({ name }: Account.CreateRequest) {
  try {
    const { data } = await api.post("/account", { name })
    return data.message
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
