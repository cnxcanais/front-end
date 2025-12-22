import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getProdutores } from "../remote"

export function useProdutorQuery(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  try {
    return useQuery({
      queryKey: ["produtor", page, limit, filters],
      queryFn: () => getProdutores(page, limit, filters),
      staleTime: 1000 * 60 * 5, // 5 minutes
    })
  } catch (error) {
    console.error("Error in useProdutorQuery:", error)
    toast.error("Erro ao carregar produtores.")
  }
}
