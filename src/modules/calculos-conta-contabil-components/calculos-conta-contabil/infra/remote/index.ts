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
