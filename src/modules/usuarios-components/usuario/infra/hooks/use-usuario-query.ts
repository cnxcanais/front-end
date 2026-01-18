import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getUsuarios } from "../remote"

export function useUsuarioQuery(
  page = 1,
  limit = -1,
  filters?: Record<string, string>
) {
  try {
    return useQuery({
      queryKey: ["usuarios", page, limit, filters],
      queryFn: () => getUsuarios(page, limit, filters),
    })
  } catch (error) {
    console.error("Error in useUsuarioQuery:", error)
    toast.error("Erro ao carregar usuários.")
  }
}
