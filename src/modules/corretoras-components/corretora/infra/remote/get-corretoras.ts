import { Corretora } from "@/@types/corretora"
import { bffApi } from "@/lib/axios"

export async function getCorretoras() {
  try {
    const { data } = await bffApi.get<Corretora.GetResponse>(`/corretoras`)
    return data.data
  } catch (error) {
    console.info(error)
  }
}
