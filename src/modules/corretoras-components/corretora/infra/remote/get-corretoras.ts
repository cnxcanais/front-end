import { Corretora } from "@/@types/corretora"
import { bffApi } from "@/lib/axios"

export async function getCorretoras(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  try {
    const { data } = await bffApi.get<Corretora.GetResponse>(`/corretoras`, {
      params: { page, limit, ...filters },
    })
    return data
  } catch (error) {
    console.info(error)
  }
}
