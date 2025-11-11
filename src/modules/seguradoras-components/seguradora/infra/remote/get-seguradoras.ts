import { Seguradora } from "@/@types/seguradora"
import { bffApi } from "@/lib/axios"

export async function getSeguradoras() {
  try {
    const { data } = await bffApi.get<Seguradora.GetResponse>(`/seguradoras`)
    return data.data
  } catch (error) {
    console.info(error)
  }
}
