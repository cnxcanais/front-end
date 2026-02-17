import { Estorno } from "@/@types/estorno"
import { bffApi } from "@/lib/axios"

export async function estornarComissoes(
  request: Estorno.EstornoComissaoRequest
) {
  const response = await bffApi.post("/estornos/comissoes", request)
  return response.data
}

export async function reverterEstornoComissoes(
  request: Estorno.ReverterEstornoRequest
) {
  const response = await bffApi.post("/estornos/comissoes/reverter", request)
  return response.data
}

export async function estornarRepasses(request: Estorno.EstornoRepasseRequest) {
  const response = await bffApi.post("/estornos/repasses", request)
  return response.data
}

export async function reverterEstornoRepasses(
  request: Estorno.ReverterEstornoRequest
) {
  const response = await bffApi.post("/estornos/repasses/reverter", request)
  return response.data
}
