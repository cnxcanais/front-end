import { bffApi } from "@/lib/axios"
import { AxiosError } from "axios"
import { toast } from "sonner"

export async function forgotPassword(email: string) {
  try {
    await bffApi.post("/auth/recuperar-senha", { email })
    toast.success("Email de recuperação de senha enviado com sucesso!")
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        error.response?.data?.message ||
          "Erro ao enviar email de recuperação de senha."
      )
      return
    }
    toast.error("Erro ao enviar email de recuperação de senha.")
  }
}
