import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getBancos } from "../remote/get-bancos"

export function useBancosQuery() {
  try {
    return useQuery({
      queryKey: ["bancos"],
      queryFn: () => getBancos(),
    })
  } catch (error) {
    console.error("Error in useProdutorQuery:", error)
    toast.error("Erro ao carregar produtores.")
  }
}
