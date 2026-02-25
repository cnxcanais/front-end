import { bffApi } from "@/lib/axios"

export interface TipoSinistro {
  id: string
  descricao: string
  ramo: {
    id: string
    descricao: string
  }
  createdAt: string
  updatedAt: string
}

export interface TiposSinistrosResponse {
  data: TipoSinistro[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export async function getTiposSinistros(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  try {
    const response = await bffApi.get<TiposSinistrosResponse>(
      "/tipos-sinistros",
      {
        params: { page, limit, ...filters },
      }
    )
    return response.data
  } catch (error) {
    console.error(
      "Erro ao buscar tipos de sinistros:",
      error?.response?.data?.message || error.message
    )
  }
}

export async function removeTipoSinistro(id: string) {
  const response = await bffApi.delete(`/tipos-sinistros/${id}`)
  return response.data
}
