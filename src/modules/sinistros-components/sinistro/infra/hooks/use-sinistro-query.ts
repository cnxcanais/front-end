import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getSinistros } from "../remote"

export function useSinistroQuery(
  page = 1,
  limit = -1,
  filters?: Record<string, string>
) {
  try {
    return useQuery({
      queryKey: ["sinistro", page, limit, filters],
      queryFn: () => getSinistros(page, limit, filters),
      staleTime: 1000 * 60 * 5, // 5 minutes
    })
  } catch (error) {
    console.error("Erro ao buscar sinistros:", error)
    toast.error("Erro ao buscar sinistros")
  }
}
