import { Produtor } from "@/@types/produtor"
import { bffApi } from "@/lib/axios"

export async function getProdutores(page = 1, limit = 10) {
  try {
    const { data } = await bffApi.get<Produtor.GetResponse>(`/produtores`, {
      params: { page, limit }
    })
    return data
  } catch (error) {
    console.info(error)
  }
}
