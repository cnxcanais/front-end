import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getProdutos } from "../remote"

export function useProdutoQuery(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  try {
    return useQuery({
      queryKey: ["produtos", page, limit, filters],
      queryFn: () => getProdutos(page, limit, filters),
    })
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    toast.error("Erro ao buscar produtos")
  }
}
