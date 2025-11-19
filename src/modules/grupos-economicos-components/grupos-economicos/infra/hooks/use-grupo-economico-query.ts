import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getGruposEconomicos } from "../remote"

export function useGrupoEconomicoQuery(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  try {
    return useQuery({
      queryKey: ["grupos-economicos", page, limit, filters],
      queryFn: () => getGruposEconomicos(page, limit, filters),
    })
  } catch (error) {
    console.error("Erro ao buscar grupos econômicos:", error)
    toast.error("Erro ao buscar grupos econômicos")
  }
}
