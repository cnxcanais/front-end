import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getPropostas } from "../remote"

export function useProposaQuery(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  try {
    return useQuery({
      queryKey: ["propostas", page, limit, filters],
      queryFn: () => getPropostas(page, limit, filters),
    })
  } catch (error) {
    console.error("Erro ao buscar propostas:", error)
    toast.error("Erro ao buscar propostas")
  }
}
