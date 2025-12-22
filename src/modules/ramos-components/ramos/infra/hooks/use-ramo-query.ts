import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getRamos } from "../remote"

export function useRamoQuery(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  try {
    return useQuery({
      queryKey: ["ramos", page, limit, filters],
      queryFn: () => getRamos(page, limit, filters),
      staleTime: 1000 * 60 * 5, // 5 minutes
    })
  } catch (error) {
    console.error("Erro ao buscar ramos:", error)
    toast.error("Erro ao buscar ramos")
  }
}
