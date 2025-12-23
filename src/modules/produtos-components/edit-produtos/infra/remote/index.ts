import { Produto } from "@/@types/produto"
import { bffApi } from "@/lib/axios"

export async function getProdutoById(id: string) {
  const response = await bffApi.get<Produto>(`/produtos/${id}`)
  return response.data
}

export async function editProduto(data: {
  id: string
  descricao: string
  seguroRenovavel: boolean
}) {
  const response = await bffApi.patch(`/produtos/${data.id}`, {
    descricao: data.descricao,
    seguroRenovavel: data.seguroRenovavel,
  })
  return response.data
}
