import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getProdutores } from "../remote"

export function useProdutorQuery(page = 1, limit = 10) {
  try {
    return useQuery({
      queryKey: ["produtor", page, limit],
      queryFn: () => getProdutores(page, limit),
    })
  } catch (error) {
    console.error("Error in useProdutorQuery:", error)
    toast.error("Erro ao carregar produtores.")
  }
}
