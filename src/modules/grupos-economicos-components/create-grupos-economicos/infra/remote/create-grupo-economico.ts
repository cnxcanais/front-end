import { bffApi } from "@/lib/axios"

export async function createGrupoEconomico(data: { nome: string }) {
  const response = await bffApi.post("/grupos-economicos", data)
  return response.data
}
