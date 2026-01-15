import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getTiposSinistros } from "../remote"

export function useTipoSinistroQuery(
  page = 1,
  limit = -1,
  filters?: Record<string, string>
) {
  try {
    return useQuery({
      queryKey: ["tipos-sinistros", page, limit, filters],
      queryFn: () => getTiposSinistros(page, limit, filters),
      staleTime: 1000 * 60 * 5, // 5 minutes
    })
  } catch (error) {
    console.error("Erro ao buscar tipos de sinistros:", error)
    toast.error("Erro ao buscar tipos de sinistros")
  }
}
