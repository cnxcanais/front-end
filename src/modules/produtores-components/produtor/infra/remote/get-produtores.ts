import { Produtor } from "@/@types/produtor"
import { bffApi } from "@/lib/axios"
import { toast } from "sonner"

export async function getProdutores(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  try {
    const { data } = await bffApi.get<Produtor.GetResponse>(`/produtores`, {
      params: { page, limit, ...filters },
    })
    return data
  } catch (error) {
    toast.error("Erro ao buscar produtores " + error.response.data.message)
    console.info(error)
  }
}
