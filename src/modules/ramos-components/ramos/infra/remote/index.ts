import { bffApi } from "@/lib/axios"

export interface Ramo {
  id: string
  descricao: string
  createdBy: string
  updatedBy: string
  deletedBy: string
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export interface RamosResponse {
  data: Ramo[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export async function getRamos(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  try {
    const response = await bffApi.get<RamosResponse>("/ramos", {
      params: { page, limit, ...filters },
    })
    return response.data
  } catch (error) {
    console.error(
      "Erro ao buscar ramos:",
      error?.response?.data?.message || error.message
    )
  }
}

export async function removeRamo(id: string) {
  const response = await bffApi.delete(`/ramos/${id}`)
  return response.data
}
