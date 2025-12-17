import { bffApi } from "@/lib/axios"

export async function blockUsuario(id: string) {
  const response = await bffApi.post(`/usuarios/${id}/bloquear`)
  return response.data
}

export async function unblockUsuario(id: string) {
  const response = await bffApi.post(`/usuarios/${id}/desbloquear`)
  return response.data
}
