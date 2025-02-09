import { api } from "@/lib/axios"
import { ResetPasswordSchema } from "@/modules/login-components/email-recovery/presentation/validation/schema"
import { AxiosError } from "axios"

export async function resetPassword(formData: ResetPasswordSchema) {
  try {
    const { data } = await api.post("/user/reset-password", {
      email: formData.email,
    })

    return data.message
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
