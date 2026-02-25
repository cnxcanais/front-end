import { useQuery } from "@tanstack/react-query"
import { getProdutores } from "../remote"

export function useProdutorQuery(
  page = 1,
  limit = -1,
  filters?: Record<string, string>
) {
  return useQuery({
    queryKey: ["produtor", page, limit, filters],
    queryFn: () => getProdutores(page, limit, filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
