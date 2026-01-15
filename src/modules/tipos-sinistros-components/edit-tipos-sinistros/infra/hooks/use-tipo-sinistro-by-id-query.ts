import { useQuery } from "@tanstack/react-query"
import { getTipoSinistroById } from "../remote"

export function useTipoSinistroByIdQuery(id: string) {
  return useQuery({
    queryKey: ["tipos-sinistros", id],
    queryFn: () => getTipoSinistroById(id),
    enabled: !!id,
  })
}
