import { ContasContabeisResponse } from "@/@types/conta-contabil"
import { bffApi } from "@/lib/axios"

export async function getContasContabeis(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  const response = await bffApi.get<ContasContabeisResponse>("/contas-contabeis", {
    params: { page, limit, ...filters },
  })
  return response.data
}

export async function removeContaContabil(id: string) {
  const response = await bffApi.delete(`/contas-contabeis/${id}`)
  return response.data
}
