import { bffApi } from "@/lib/axios"

export async function getGruposEconomicos(page = 1, limit = 10) {
  const response = await bffApi.get("/grupos-economicos", {
    params: { page, limit }
  })
  return response.data
}

export async function removeGrupoEconomico(id: string) {
  const response = await bffApi.delete(`/grupos-economicos/${id}`)
  return response.data
}
