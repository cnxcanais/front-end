import { Usuario } from "@/@types/usuario"
import { bffApi } from "@/lib/axios"

export async function editUsuario(id: string, data: Usuario.UpdateRequest) {
  const response = await bffApi.patch(`/usuarios/${id}`, data)
  return response.data
}
