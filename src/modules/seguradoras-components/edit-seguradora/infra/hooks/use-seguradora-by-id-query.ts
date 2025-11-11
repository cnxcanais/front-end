import { useQuery } from "@tanstack/react-query"
import { getSeguradoraById } from "../remote"

export function useSeguradoraByIdQuery(id: string) {
  return useQuery({
    queryKey: ["seguradora", id],
    queryFn: () => getSeguradoraById(id),
    enabled: id !== "",
  })
}
