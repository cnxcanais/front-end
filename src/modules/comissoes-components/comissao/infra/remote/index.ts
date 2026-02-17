import { Comissao } from "@/@types/comissao"
import { bffApi } from "@/lib/axios"

export const getComissoes = async (
  page: number,
  limit: number,
  filters?: Record<string, string>
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters,
  })
  const response = await bffApi.get<Comissao.GetResponse>(
    `/comissoes?${params.toString()}`
  )
  return response.data
}

export const getComissaoById = async (id: string) => {
  const response = await bffApi.get<Comissao.Type>(`/comissoes/${id}`)
  return response.data
}

export const baixarComissao = async (data: Comissao.BaixaRequest) => {
  const response = await bffApi.post(`/comissoes/baixar`, data)
  return response.data
}

export const baixarComissaoLote = async (data: Comissao.BaixaLoteRequest) => {
  const response = await bffApi.post(`/comissoes/baixar-lote`, data)
  return response.data
}

export const getComissaoHistorico = async (comissaoId: string) => {
  const response = await bffApi.get<{ data: Comissao.HistoricoItem[] }>(
    `/comissoes/${comissaoId}/historico`
  )
  return response.data
}

export const getIndicadores = async (filters?: Record<string, string>) => {
  const params = new URLSearchParams(filters)
  const response = await bffApi.get<Comissao.Indicadores>(
    `/comissoes/indicadores?${params.toString()}`
  )
  return response.data
}
