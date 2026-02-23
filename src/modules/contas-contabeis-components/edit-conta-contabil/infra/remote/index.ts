import { ContaContabil } from "@/@types/conta-contabil"
import { bffApi } from "@/lib/axios"

export async function getContaContabilById(id: string) {
  const response = await bffApi.get<ContaContabil>(`/contas-contabeis/${id}`)
  return response.data
}

export async function editContaContabil(data: {
  id: string
  codigo: string
  descricao: string
}) {
  const response = await bffApi.patch(`/contas-contabeis/${data.id}`, {
    codigo: data.codigo,
    descricao: data.descricao,
  })
  return response.data
}
