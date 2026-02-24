import { useQuery } from "@tanstack/react-query"
import { CalculoContaContabil } from "../../../types"
import { getCalculosContaContabil } from "../remote"

export function useCalculosContaContabilQuery(
  filters: CalculoContaContabil.Filters,
  enabled = false
) {
  return useQuery({
    queryKey: ["calculos-conta-contabil", filters],
    queryFn: () => getCalculosContaContabil(filters),
    enabled,
  })
}
