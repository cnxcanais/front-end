import { Produtor } from "@/@types/produtor"
import { bffApi } from "@/lib/axios"

export async function getProdutores() {
  try {
    const { data } = await bffApi.get<Produtor.GetResponse>(`/produtores`)
    return data.data
  } catch (error) {
    console.info(error)
  }
}
