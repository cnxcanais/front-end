import { Bank } from "@/@types/banks"
import { api } from "@/lib/axios"

export async function getBankById(id: string) {
  try {
    const { data } = await api.get<Bank.GetByIdResponse>(`/bank/${id}`)

    return data.bank
  } catch (error) {
    console.info(error)
  }
}
