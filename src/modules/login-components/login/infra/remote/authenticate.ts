import { api } from "@/lib/axios"
import { LoginSchema } from "@/modules/login-components/login/infra/validation/schema"

export async function authenticate(formData: LoginSchema) {
  try {
    await api.post("/user/authenticate", {
      email: formData.email,
      password: formData.password,
    })
  } catch (error) {
    console.error(error)
  }
}
