import { useQuery } from "@tanstack/react-query"
import { getProdutoById } from "../remote"

export function useProdutoByIdQuery(id: string) {
  return useQuery({
    queryKey: ["produto", id],
    queryFn: () => getProdutoById(id),
    enabled: !!id,
  })
}
