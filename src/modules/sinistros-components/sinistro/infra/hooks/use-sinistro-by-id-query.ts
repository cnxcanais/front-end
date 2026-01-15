import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getSinistroById } from "../remote"

export function useSinistroByIdQuery(id: string) {
  try {
    return useQuery({
      queryKey: ["sinistro", id],
      queryFn: () => getSinistroById(id),
      staleTime: 1000 * 60 * 5, // 5 minutes
    })
  } catch (error) {
    console.error("Erro ao buscar sinistros:", error)
    toast.error("Erro ao buscar sinistros")
  }
}
