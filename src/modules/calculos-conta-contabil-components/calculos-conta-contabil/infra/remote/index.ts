import { bffApi } from "@/lib/axios"
import { CalculoContaContabil } from "@/modules/calculos-conta-contabil-components/types"

export async function getCalculosContaContabil(
  filters: CalculoContaContabil.Filters
) {
  const response = await bffApi.get<CalculoContaContabil.Response>(
    "/calculos-conta-contabil",
    { params: filters }
  )
  return response.data
}

export async function calcularContaContabil(ano: number, mes: number) {
  const response = await bffApi.post("/calculos-conta-contabil", { ano, mes })
  return response.data
}
