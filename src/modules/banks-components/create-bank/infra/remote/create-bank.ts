import { Bank } from "@/@types/banks"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function createBank({
  name,
  account_id,
  bank_number,
}: Bank.CreateRequest) {
  try {
    const { data } = await api.post("/bank", { name, account_id, bank_number })
    return data.message
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
