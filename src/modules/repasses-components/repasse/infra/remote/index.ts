import { Repasse } from "@/@types/repasse"
import { bffApi } from "@/lib/axios"

export const getRepasses = async (
  page: number,
  limit: number,
  filters?: Record<string, string>
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters,
  })
  const response = await bffApi.get<Repasse.GetResponse>(
    `/repasses?${params.toString()}`
  )
  return response.data
}

export const getRepasseById = async (id: string) => {
  const response = await bffApi.get<Repasse.Type>(`/repasses/${id}`)
  return response.data
}

export const baixarRepasse = async (data: Repasse.BaixaRequest) => {
  const response = await bffApi.post(`/repasses/baixar`, data)
  return response.data
}

export const baixarRepasseLote = async (data: Repasse.BaixaLoteRequest) => {
  const response = await bffApi.post(`/repasses/baixar-lote`, data)
  return response.data
}

export const estornarRepasse = async (data: Repasse.EstornoRequest) => {
  const response = await bffApi.post(`/repasses/estornar`, data)
  return response.data
}

export const getRepasseHistorico = async (repasseId: string) => {
  const response = await bffApi.get<{ data: Repasse.HistoricoItem[] }>(
    `/repasses/${repasseId}/historico`
  )
  return response.data
}

export const getRepasseCadeia = async (
  apoliceId: string,
  parcelaId: string
) => {
  const response = await bffApi.get<{ data: Repasse.CadeiaItem[] }>(
    `/repasses/cadeia?apoliceId=${apoliceId}&parcelaId=${parcelaId}`
  )
  return response.data
}

export const getIndicadores = async (filters?: Record<string, string>) => {
  const params = new URLSearchParams(filters)
  const response = await bffApi.get<Repasse.Indicadores>(
    `/repasses/indicadores?${params.toString()}`
  )
  return response.data
}
