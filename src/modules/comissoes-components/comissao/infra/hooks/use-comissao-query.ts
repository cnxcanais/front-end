import { useQuery } from "@tanstack/react-query"
import { getComissoes } from "../remote"

export function useComissaoQuery(
  page: number,
  limit: number,
  filters?: Record<string, string>
) {
  return useQuery({
    queryKey: ["comissoes", page, limit, filters],
    queryFn: () => getComissoes(page, limit, filters),
  })
}
