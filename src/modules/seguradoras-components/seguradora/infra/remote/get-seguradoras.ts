import { Seguradora } from "@/@types/seguradora"
import { bffApi } from "@/lib/axios"

export async function getSeguradoras(page = 1, limit = 10) {
  try {
    const { data } = await bffApi.get<Seguradora.GetResponse>(`/seguradoras`, {
      params: { page, limit }
    })
    return data
  } catch (error) {
    console.info(error)
  }
}
