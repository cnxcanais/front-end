import { Segurado } from "@/@types/segurado"
import { bffApi } from "@/lib/axios"
import { toast } from "sonner"

export async function getSegurados(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  try {
    const { data } = await bffApi.get<Segurado.GetResponse>(`/segurados`, {
      params: { page, limit, ...filters },
    })
    return data
  } catch (error) {
    console.info(error)
    toast.error("Erro ao carregar segurados: " + error?.response?.data?.message)
  }
}
