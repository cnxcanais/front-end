import { bffApi } from "@/lib/axios"
import { Produto } from "../../../produtos/infra/remote"

export async function getProdutoById(id: string) {
  const response = await bffApi.get<Produto>(`/produtos/${id}`)
  return response.data
}

export async function editProduto(data: { id: string; descricao: string }) {
  const response = await bffApi.patch(`/produtos/${data.id}`, {
    descricao: data.descricao,
  })
  return response.data
}
