import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getCorretoras } from "../remote"

export function useCorretoraQuery() {
  try {
    return useQuery({
      queryKey: ["corretora"],
      queryFn: () => getCorretoras(),
    })
  } catch (error) {
    console.error("Error in useCorretoraQuery:", error)
    toast.error("Erro ao carregar corretoras.")
  }
}
