import { Produtor } from "@/@types/produtor"
import { bffApi } from "@/lib/axios"

export async function getProdutorById(id: string) {
  try {
    const { data } = await bffApi.get<Produtor.GetByIdResponse>(`/produtores/${id}`)
    return data
  } catch (error) {
    console.info(error)
  }
}
