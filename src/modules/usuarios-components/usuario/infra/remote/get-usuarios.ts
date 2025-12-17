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

  const response = await bffApi.get<Usuario.GetResponse>(
    `/usuarios?${params.toString()}`
  )
  return response.data
}
