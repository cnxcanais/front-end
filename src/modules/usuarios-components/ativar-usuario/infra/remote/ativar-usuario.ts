import { bffApi } from "@/lib/axios"

export async function ativarUsuario(token: string, senha: string) {
  const response = await bffApi.post("/auth/ativar", { token, senha })
  return response.data
}
