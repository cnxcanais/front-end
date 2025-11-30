import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function removeSegurado(id: string) {
  try {
    await bffApi.delete(`/segurados/${id}`)
  } catch (error) {
    if (error instanceof AxiosError) throw error.response?.data?.message
    throw error
  }
}
