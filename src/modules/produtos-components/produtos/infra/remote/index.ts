import { bffApi } from "@/lib/axios"

import { ProdutosResponse } from "@/@types/produto"

export async function getProdutos(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  try {
    const response = await bffApi.get<ProdutosResponse>("/produtos", {
      params: { page, limit, ...filters },
    })
    return response.data
  } catch (error) {
    console.error(
      "Erro ao buscar produtos:",
      error?.response?.data?.message || error.message
    )
  }
}

export async function removeProduto(id: string) {
  const response = await bffApi.delete(`/produtos/${id}`)
  return response.data
}
