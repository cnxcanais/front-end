import { Usuario } from "@/@types/usuario"
import { bffApi } from "@/lib/axios"

export async function getUsuarios(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...filters,
  })

  try {
    const response = await bffApi.get<Usuario.GetResponse>(
      `/usuarios?${params.toString()}`
    )
    return response.data
  } catch (error) {
    console.error(
      "Erro ao buscar usuários:",
      error?.response?.data?.message || error.message
    )
  }
}
