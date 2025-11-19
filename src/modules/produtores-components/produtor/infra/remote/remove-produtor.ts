import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function removeProdutor(id: string) {
  try {
    await bffApi.delete(`/produtores/${id}`)
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
