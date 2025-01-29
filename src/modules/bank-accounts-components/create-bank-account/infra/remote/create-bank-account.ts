import { BankAccount } from "@/@types/bank-accounts"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function createBankAccount({
  account_number,
  agency,
  bank_id,
  observation,
}: BankAccount.CreateRequest) {
  try {
    const { data } = await api.post("/bank-account", {
      account_number,
      agency,
      bank_id,
      observation,
    })
    return data.message
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
