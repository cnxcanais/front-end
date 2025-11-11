import { Produtor } from "@/@types/produtor"
import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"

export async function createProdutor(data: Produtor.CreateRequest) {
  try {
    const response = await bffApi.post("/produtores", data)
    return response.data.message
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
