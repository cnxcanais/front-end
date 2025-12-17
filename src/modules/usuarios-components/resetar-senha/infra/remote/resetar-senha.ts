import { bffApi } from "@/lib/axios"

export async function resetarSenha(token: string, novaSenha: string) {
  const response = await bffApi.post("/auth/resetar-senha", { token, novaSenha })
  return response.data
}
