import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { getPerfilById } from "../remote"

export function usePerfilByIdQuery(id: string) {
  try {
    return useQuery({
      queryKey: ["perfil", id],
      queryFn: () => getPerfilById(id),
      enabled: !!id,
    })
  } catch (error) {
    console.error("Erro ao buscar perfil:", error?.response.data?.message)
    toast.error("Erro ao buscar perfil")
    throw error
  }
}
