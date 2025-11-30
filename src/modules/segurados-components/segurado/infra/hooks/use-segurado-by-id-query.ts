import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getSeguradoById } from "../remote/get-segurado-by-id"

export function useSeguradoByIdQuery(id: string) {
  try {
    return useQuery({
      queryKey: ["segurado", id],
      queryFn: () => getSeguradoById(id),
      enabled: !!id,
    })
  } catch (error) {
    console.error("Error in useSeguradoByIdQuery:", error)
    toast.error("Erro ao carregar segurado.")
  }
}
