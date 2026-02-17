import { useQuery } from "@tanstack/react-query"
import { getRepasses } from "../remote"

export function useRepasseQuery(
  page: number,
  limit: number,
  filters?: Record<string, string>
) {
  return useQuery({
    queryKey: ["repasses", page, limit, filters],
    queryFn: () => getRepasses(page, limit, filters),
  })
}
