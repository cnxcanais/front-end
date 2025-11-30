import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getSegurados } from "../remote"

export function useSeguradoQuery(
  page = 1,
  limit = 10,
  filters?: Record<string, string>
) {
  try {
    return useQuery({
      queryKey: ["segurado", page, limit, filters],
      queryFn: () => getSegurados(page, limit, filters),
    })
  } catch (error) {
    console.error("Error in useSeguradoQuery:", error)
    toast.error("Erro ao carregar segurados.")
  }
}
