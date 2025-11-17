import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getGruposEconomicos } from "../remote"

export function useGrupoEconomicoQuery() {
  try {
    return useQuery({
      queryKey: ["grupos-economicos"],
      queryFn: getGruposEconomicos,
    })
  } catch (error) {
    console.error("Erro ao buscar grupos econômicos:", error)
    toast.error("Erro ao buscar grupos econômicos")
  }
}
