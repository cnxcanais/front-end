import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function removeSeguradora(id: string) {
  try {
    await bffApi.delete(`/seguradoras/${id}`)
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
