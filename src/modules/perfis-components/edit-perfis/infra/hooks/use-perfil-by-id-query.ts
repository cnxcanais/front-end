import { useQuery } from "@tanstack/react-query"
import { getPerfilById } from "../remote"

export function usePerfilByIdQuery(id: string) {
  return useQuery({
    queryKey: ["perfil", id],
    queryFn: () => getPerfilById(id),
    enabled: !!id,
  })
}
