import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getProdutores } from "../remote"

export function useProdutorQuery() {
  try {
    return useQuery({
      queryKey: ["produtor"],
      queryFn: () => getProdutores(),
    })
  } catch (error) {
    console.error("Error in useProdutorQuery:", error)
    toast.error("Erro ao carregar produtores.")
  }
}
