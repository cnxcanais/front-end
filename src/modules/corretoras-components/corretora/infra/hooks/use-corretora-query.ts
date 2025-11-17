import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getCorretoras } from "../remote"

export function useCorretoraQuery(page = 1, limit = 10) {
  try {
    return useQuery({
      queryKey: ["corretora", page, limit],
      queryFn: () => getCorretoras(page, limit),
    })
  } catch (error) {
    console.error("Error in useCorretoraQuery:", error)
    toast.error("Erro ao carregar corretoras.")
  }
}
