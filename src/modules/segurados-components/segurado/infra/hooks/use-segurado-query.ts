import { useQuery } from "@tanstack/react-query"
import { getSegurados } from "../remote"

export function useSeguradoQuery(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  return useQuery({
    queryKey: ["segurado", page, limit, filters],
    queryFn: () => getSegurados(page, limit, filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
