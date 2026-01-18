import { Sinistro } from "@/@types/sinistro"
import { bffApi } from "@/lib/axios"

export async function getSinistros(
  page: number,
  limit: number,
  filters?: Record<string, string>
) {
  const response = await bffApi.get<Sinistro.GetResponse>("/sinistros", {
    params: { page, limit, ...filters },
  })
  return response.data
}

export async function getSinistroById(id: string) {
  const response = await bffApi.get<Sinistro.Type>(`/sinistros/${id}`)
  return response.data
}

export async function createSinistro(data: Sinistro.PostBody) {
  const response = await bffApi.post("/sinistros", data)
  return response.data
}

export async function editSinistro(id: string, data: Sinistro.PatchBody) {
  const response = await bffApi.patch(`/sinistros/${id}`, data)
  return response.data
}

export async function deleteSinistro(id: string) {
  const response = await bffApi.delete(`/sinistros/${id}`)
  return response.data
}

export async function changeSinistroStatus(
  id: string,
  data: Sinistro.PostStatusBody
) {
  const response = await bffApi.post(`/sinistros/${id}/status`, data)
  return response.data
}

export async function moveSinistroBackwards(id: string, observacao?: string) {
  const response = await bffApi.post(`/sinistros/${id}/reverter-status`, {
    observacao,
  })
  return response.data
}

export async function changeObservacaoSinistro(
  id: string,
  data: Sinistro.PostObservacaoBody
) {
  const response = await bffApi.post(`/sinistros/${id}/observacao`, data)
  return response.data
}

export async function getSinistroHistorico(id: string) {
  const response = await bffApi.get(`/sinistros/${id}/historico`)
  return response.data
}
