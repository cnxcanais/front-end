import { useQuery } from "@tanstack/react-query"
import { getCorretoras } from "../remote"

export function useCorretoraQuery(
  page = 1,
  limit = -1,
  filters?: Record<string, string>
) {
  return useQuery({
    queryKey: ["corretora", page, limit, filters],
    queryFn: () => getCorretoras(page, limit, filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
