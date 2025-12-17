import { Perfil } from "@/@types/perfil"
import { bffApi } from "@/lib/axios"
import { toast } from "sonner"

export async function createPerfil(data: Perfil.CreateRequest) {
  try {
    const response = await bffApi.post("/perfis", data)
    return response.data
  } catch (error) {
    toast.error("Erro ao criar perfil: " + error)
    throw error
  }
}
