import { useQuery } from "@tanstack/react-query"
import { getGrupoEconomicoById } from "../remote"

export function useGrupoEconomicoByIdQuery(id: string) {
  return useQuery({
    queryKey: ["grupo-economico", id],
    queryFn: () => getGrupoEconomicoById(id),
  })
}
