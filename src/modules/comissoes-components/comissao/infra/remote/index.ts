import { Comissao } from "@/@types/comissao"
import { bffApi } from "@/lib/axios"

export const calcularComissoes = async (data: Comissao.CalcularRequest) => {
  const response = await bffApi.post("/comissoes/calcular", data)
  return response.data
}

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

export const getComissoesByApolice = async (propostaApoliceId: string) => {
  const response = await bffApi.get<Comissao.ApiType[]>(
    `/comissoes/apolice/${propostaApoliceId}`
  )
  return response.data
}

export const getComissaoByParcela = async (parcelaId: string) => {
  const response = await bffApi.get<Comissao.ApiType>(
    `/comissoes/parcela/${parcelaId}`
  )
  return response.data
}

export const atualizarValorComissao = async (
  id: string,
  data: Comissao.AtualizarValorRequest
) => {
  const response = await bffApi.patch(`/comissoes/${id}/valor`, data)
  return response.data
}

export const marcarComoPaga = async (
  id: string,
  data: Comissao.PagamentoRequest
) => {
  const response = await bffApi.post(`/comissoes/${id}/pagamento`, data)
  return response.data
}

export const reverterPagamento = async (id: string) => {
  const response = await bffApi.patch(`/comissoes/${id}/reverter-pagamento`)
  return response.data
}
