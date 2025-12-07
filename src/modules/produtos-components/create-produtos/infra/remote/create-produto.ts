import { bffApi } from "@/lib/axios"

export async function createProduto(data: {
  ramoId: string
  descricao: string
}) {
  const response = await bffApi.post("/produtos", data)
  return response.data
}
