import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getCorretoraById } from "../remote"

export function useCorretoraByIdQuery(id: string) {
  try {
    return useQuery({
      queryKey: ["corretora", id],
      queryFn: () => getCorretoraById(id),
      enabled: id !== "",
    })
  } catch (error) {
    console.log(error)
    toast.error("Erro ao carregar corretora.")
  }
}
