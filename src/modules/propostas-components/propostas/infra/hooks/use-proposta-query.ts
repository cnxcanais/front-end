import { useQuery } from "@tanstack/react-query"
import { getPropostas } from "../remote"

export function usePropostaQuery(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  return useQuery({
    queryKey: ["propostas", page, limit, filters],
    queryFn: () => getPropostas(page, limit, filters),
    retry: false,
  })
}
