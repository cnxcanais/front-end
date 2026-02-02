import { useQuery } from "@tanstack/react-query"
import { getSeguradoras } from "../remote"

export function useSeguradoraQuery(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  return useQuery({
    queryKey: ["seguradora", page, limit, filters],
    queryFn: () => getSeguradoras(page, limit, filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
