import { Usuario } from "@/@types/usuario"
import { bffApi } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

async function getUsuarioById(id: string) {
  try {
    const response = await bffApi.get<Usuario.Type>(`/usuarios/${id}`)
    return response.data
  } catch (error) {
    console.error("Erro ao buscar usuário:", error)
    toast.error("Erro ao buscar usuário", error?.response.data?.message)
    throw error
  }
}

export function useUsuarioByIdQuery(id: string) {
  return useQuery({
    queryKey: ["usuario", id],
    queryFn: () => getUsuarioById(id),
    enabled: !!id,
  })
}
