import { useQuery } from "@tanstack/react-query"
import { getProposta } from "../remote"

export function usePropostaByIdQuery(id: string) {
  return useQuery({
    queryKey: ["proposta", id],
    queryFn: () => getProposta(id),
    enabled: !!id,
  })
}
