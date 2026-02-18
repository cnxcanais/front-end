import { Repasse } from "@/@types/repasse"
import { bffApi } from "@/lib/axios"

export async function getRepasses(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
): Promise<Repasse.GetResponse> {
  const { data } = await bffApi.get("/repasses", {
    params: { page, limit, ...filters },
  })
  return data
}

export async function getRepassesByApolice(apoliceId: string): Promise<Repasse.Type[]> {
  const { data } = await bffApi.get(`/repasses/apolice/${apoliceId}`)
  return data
}

export async function updateRepasseValor(id: string, novoValor: number): Promise<void> {
  await bffApi.patch(`/repasses/${id}/valor`, { novoValor })
}

export async function markRepasseAsPago(id: string, dataPagamento: string): Promise<void> {
  await bffApi.post(`/repasses/${id}/pagamento`, { dataPagamento })
}

export async function estornarRepasse(registros: Array<{ registroOriginalId: string; valorEstorno: number }>, motivo: string): Promise<void> {
  await bffApi.post("/estornos/repasses", { registros, motivo })
}

export async function reverterEstornoRepasse(estornoIds: string[], motivo: string): Promise<void> {
  await bffApi.post("/estornos/repasses/reverter", { estornoIds, motivo })
}
