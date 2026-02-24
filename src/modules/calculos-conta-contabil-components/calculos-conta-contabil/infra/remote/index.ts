import { bffApi } from "@/lib/axios"
import { CalculoContaContabil } from "../../types"

export async function getCalculosContaContabil(
  filters: CalculoContaContabil.Filters
) {
  const response = await bffApi.get<CalculoContaContabil.Response>(
    "/calculos-conta-contabil",
    { params: filters }
  )
  return response.data
}
