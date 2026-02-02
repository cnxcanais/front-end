import { Seguradora } from "@/@types/seguradora"
import { bffApi } from "@/lib/axios"

export async function getSeguradoras(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  const { data } = await bffApi.get<Seguradora.GetResponse>(`/seguradoras`, {
    params: { page, limit, ...filters },
  })
  return data
}
