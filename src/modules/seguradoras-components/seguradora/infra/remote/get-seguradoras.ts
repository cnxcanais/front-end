import { Seguradora } from "@/@types/seguradora"
import { bffApi } from "@/lib/axios"

export async function getSeguradoras(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  try {
    const { data } = await bffApi.get<Seguradora.GetResponse>(`/seguradoras`, {
      params: { page, limit, ...filters },
    })
    return data
  } catch (error) {
    console.error(
      "Erro ao buscar seguradoras:",
      error?.response?.data?.message || error.message
    )
  }
}
