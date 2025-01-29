import { BankAccount } from "@/@types/bank-accounts"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editBankAccount(
  bank_account_id: string,
  { account_number, agency, bank_id, observation }: BankAccount.UpdateRequest
) {
  try {
    await api.put(`/bank-account/${bank_account_id}`, {
      account_number,
      agency,
      bank_id,
      observation,
    })
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
