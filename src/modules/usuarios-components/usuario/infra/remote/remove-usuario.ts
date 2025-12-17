import { bffApi } from "@/lib/axios"

export async function removeUsuario(id: string) {
  const response = await bffApi.delete(`/usuarios/${id}`)
  return response.data
}
