import { useQuery } from "@tanstack/react-query"
import { getContaContabilById } from "../remote"

export function useContaContabilByIdQuery(id: string) {
  return useQuery({
    queryKey: ["conta-contabil", id],
    queryFn: () => getContaContabilById(id),
    enabled: !!id,
  })
}
