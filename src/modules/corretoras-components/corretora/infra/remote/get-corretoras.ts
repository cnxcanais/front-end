import { Corretora } from "@/@types/corretora"
import { bffApi } from "@/lib/axios"
import { toast } from "sonner"

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
    toast.error("Erro ao buscar corretoras: " + error.response.data.message)
    console.info(error)
  }
}
