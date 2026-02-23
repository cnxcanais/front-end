import { bffApi } from "@/lib/axios"

export async function createContaContabil(data: {
  corretoraId: string
  codigo: string
  descricao: string
}) {
  const response = await bffApi.post("/contas-contabeis", data)
  return response.data
}
