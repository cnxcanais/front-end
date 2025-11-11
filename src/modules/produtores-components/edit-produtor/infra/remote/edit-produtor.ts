import { Produtor } from "@/@types/produtor"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editProdutor(id: string, data: Produtor.UpdateRequest) {
  try {
    await bffApi.put(`/produtores/${id}`, data)
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
