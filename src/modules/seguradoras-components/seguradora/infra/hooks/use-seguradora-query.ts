import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getSeguradoras } from "../remote"

export function useSeguradoraQuery() {
  try {
    return useQuery({
      queryKey: ["seguradora"],
      queryFn: () => getSeguradoras(),
    })
  } catch (error) {
    console.error("Error in useSeguradoraQuery:", error)
    toast.error("Erro ao carregar seguradoras.")
  }
}
