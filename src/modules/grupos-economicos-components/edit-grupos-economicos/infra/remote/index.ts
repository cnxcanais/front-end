import { bffApi } from "@/lib/axios"

export async function getGrupoEconomicoById(id: string) {
  const response = await bffApi.get(`/grupos-economicos/${id}`)
  return response.data.data
}

export async function editGrupoEconomico(data: { id: string; nome: string }) {
  const response = await bffApi.put(`/grupos-economicos/${data.id}`, { nome: data.nome })
  return response.data
}
