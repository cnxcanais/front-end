import { bffApi } from "@/lib/axios"
import { TipoSinistro } from "../../../tipos-sinistros/infra/remote"

export async function getTipoSinistroById(id: string) {
  const response = await bffApi.get<TipoSinistro>(`/tipos-sinistros/${id}`)
  return response.data
}

export async function editTipoSinistro(data: {
  id: string
  descricao: string
}) {
  const response = await bffApi.patch(`/tipos-sinistros/${data.id}`, {
    descricao: data.descricao,
  })
  return response.data
}
