import { bffApi } from "@/lib/axios"

export async function createTipoSinistro(data: { descricao: string; ramoId: string }) {
  const response = await bffApi.post("/tipos-sinistros", data)
  return response.data
}
