import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getContasContabeis } from "../remote"

export function useContaContabilQuery(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  try {
    return useQuery({
      queryKey: ["contas-contabeis", page, limit, filters],
      queryFn: () => getContasContabeis(page, limit, filters),
      staleTime: 1000 * 60 * 5,
    })
  } catch (error) {
    console.error("Erro ao buscar contas contábeis:", error)
    toast.error("Erro ao buscar contas contábeis")
  }
}
