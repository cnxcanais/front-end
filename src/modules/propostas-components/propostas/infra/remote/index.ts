import { bffApi } from "@/lib/axios"
import { Proposta, PropostasResponse } from "../../../types/proposta"

export async function getPropostas(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  const response = await bffApi.get<PropostasResponse>("/propostas-apolices", {
    params: { page, limit, ...filters },
  })
  return response.data
}

export async function getProposta(id: string) {
  const response = await bffApi.get<Proposta>(`/propostas-apolices/${id}`)
  return response.data
}

export async function removeProposta(id: string) {
  const response = await bffApi.delete(`/propostas-apolices/${id}`)
  return response.data
}
