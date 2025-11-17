import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getSeguradoras } from "../remote"

export function useSeguradoraQuery(page = 1, limit = 10) {
  try {
    return useQuery({
      queryKey: ["seguradora", page, limit],
      queryFn: () => getSeguradoras(page, limit),
    })
  } catch (error) {
    console.error("Error in useSeguradoraQuery:", error)
    toast.error("Erro ao carregar seguradoras.")
  }
}
