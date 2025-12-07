import { bffApi } from "@/lib/axios"

export async function createRamo(data: { descricao: string }) {
  const response = await bffApi.post("/ramos", data)
  return response.data
}
