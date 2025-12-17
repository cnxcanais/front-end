import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getPerfis } from "../remote"

export function usePerfilQuery() {
  try {
    return useQuery({
      queryKey: ["perfis"],
      queryFn: () => getPerfis(),
    })
  } catch (error) {
    console.error("Erro ao buscar perfis:", error)
    toast.error("Erro ao buscar perfis")
  }
}
