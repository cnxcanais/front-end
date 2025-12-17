import { Usuario } from "@/@types/usuario"
import { bffApi } from "@/lib/axios"

export async function createUsuario(data: Usuario.CreateRequest) {
  const response = await bffApi.post("/usuarios", data)
  return response.data
}
