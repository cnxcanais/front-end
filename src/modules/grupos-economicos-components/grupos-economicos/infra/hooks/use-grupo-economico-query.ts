import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getGruposEconomicos } from "../remote"

export function useGrupoEconomicoQuery(page = 1, limit = 10) {
  try {
    return useQuery({
      queryKey: ["grupos-economicos", page, limit],
      queryFn: () => getGruposEconomicos(page, limit),
    })
  } catch (error) {
    console.error("Erro ao buscar grupos econômicos:", error)
    toast.error("Erro ao buscar grupos econômicos")
  }
}
