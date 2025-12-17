import { bffApi } from "@/lib/axios"

export async function getPerfis() {
  const response = await bffApi.get("/perfis")
  return response.data
}

export async function removePerfil(id: string) {
  const response = await bffApi.delete(`/perfis/${id}`)
  return response.data
}
