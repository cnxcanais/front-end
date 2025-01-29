import { Bank } from "@/@types/banks"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function getBanks(account_id: string) {
  try {
    const { data } = await api.get<Bank.GetResponse>(
      `/bank/account/${account_id}`
    )

    return data.banks
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
