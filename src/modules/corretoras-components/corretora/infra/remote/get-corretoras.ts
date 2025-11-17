import { Corretora } from "@/@types/corretora"
import { bffApi } from "@/lib/axios"

export async function getCorretoras(page = 1, limit = 10) {
  try {
    const { data } = await bffApi.get<Corretora.GetResponse>(`/corretoras`, {
      params: { page, limit }
    })
    return data
  } catch (error) {
    console.info(error)
  }
}
