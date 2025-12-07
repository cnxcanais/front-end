import { bffApi } from "@/lib/axios"

export interface Ramo {
  id: string
  descricao: string
}

export interface Produto {
  id: string
  ramoId: string
  ramo: Ramo
  descricao: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface ProdutosResponse {
  data: Produto[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export async function getProdutos(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  const response = await bffApi.get<ProdutosResponse>("/produtos", {
    params: { page, limit, ...filters },
  })
  return response.data
}

export async function removeProduto(id: string) {
  const response = await bffApi.delete(`/produtos/${id}`)
  return response.data
}
