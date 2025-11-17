import { bffApi } from "@/lib/axios"

export async function getGruposEconomicos() {
  const response = await bffApi.get("/grupos-economicos")
  return response.data.data
}

export async function removeGrupoEconomico(id: string) {
  const response = await bffApi.delete(`/grupos-economicos/${id}`)
  return response.data
}
