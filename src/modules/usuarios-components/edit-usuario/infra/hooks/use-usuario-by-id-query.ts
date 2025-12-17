import { Usuario } from "@/@types/usuario"
import { bffApi } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

async function getUsuarioById(id: string) {
  const response = await bffApi.get<Usuario.Type>(`/usuarios/${id}`)
  return response.data
}

export function useUsuarioByIdQuery(id: string) {
  return useQuery({
    queryKey: ["usuario", id],
    queryFn: () => getUsuarioById(id),
    enabled: !!id,
  })
}
