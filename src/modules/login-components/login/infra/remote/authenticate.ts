// import { api } from "@/lib/axios"
// import { setCookie } from "@/lib/cookies"
import { LoginSchema } from "@/modules/login-components/login/presentation/validation/schema"

export async function authenticate(formData: LoginSchema) {
  try {
    // const response = await api.post("/user/authenticate", {
    //   email: formData.email,
    //   password: formData.password,
    // })
    // setCookie("auth", JSON.stringify(response.data))
  } catch (error) {
    console.error(error)
  }
}
