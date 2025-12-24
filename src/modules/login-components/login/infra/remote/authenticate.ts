import { Usuario } from "@/@types/usuario"
import { bffApi } from "@/lib/axios"
import { setCookie } from "@/lib/cookies"
import { LoginSchema } from "@/modules/login-components/login/presentation/validation/schema"
import { AxiosError } from "axios"

export async function authenticate(formData: LoginSchema) {
  try {
    const { data } = await bffApi.post<Usuario.AuthResponse>("/auth/login", {
      email: formData.email,
      senha: formData.password,
    })

    setCookie("userId", data.usuario.id)
    setCookie("token", data.accessToken)
    setCookie("perfilId", data.usuario.perfil.id)
    setCookie("corretoraId", data.usuario.corretora?.id || "admin")
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
