import { bffApi } from "@/lib/axios"
import { Ramo } from "../../../ramos/infra/remote"

export async function getRamoById(id: string) {
  const response = await bffApi.get<Ramo>(`/ramos/${id}`)
  return response.data
}

export async function editRamo(data: { id: string; descricao: string }) {
  const response = await bffApi.patch(`/ramos/${data.id}`, {
    descricao: data.descricao,
  })
  return response.data
}
