import { bffApi } from "@/lib/axios"

export async function createProduto(data: {
  ramoId: string
  descricao: string
  seguroRenovavel: boolean
}) {
  const response = await bffApi.post("/produtos", data)
  return response.data
}
