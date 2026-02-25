import { useQuery } from "@tanstack/react-query"
import { getRamos } from "../remote"

export function useRamoQuery(
  page = 1,
  limit = -1,
  filters?: Record<string, string>
) {
  return useQuery({
    queryKey: ["ramos", page, limit, filters],
    queryFn: () => getRamos(page, limit, filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
