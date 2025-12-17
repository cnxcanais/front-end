import { Perfil } from "@/@types/perfil"
import { bffApi } from "@/lib/axios"

export async function getPerfilById(id: string) {
  const response = await bffApi.get(`/perfis/${id}`)
  return response.data
}

export async function editPerfil(id: string, data: Perfil.UpdateRequest) {
  const response = await bffApi.put(`/perfis/${id}`, data)
  return response.data
}
