import { BankAccount } from "@/@types/bank-accounts"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function getBankAccountById(id: string) {
  try {
    const { data } = await api.get<BankAccount.GetByIdResponse>(
      `/bank-account/${id}`
    )

    return data.bankAccount
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
