// import { api } from "@/lib/axios"
// import { setCookie } from "@/lib/cookies"
import { setCookie } from "@/lib/cookies"
import { fetchPermissionsByName } from "@/modules/login-components/login/infra/remote/permissions"
import { LoginSchema } from "@/modules/login-components/login/presentation/validation/schema"

export async function authenticate(formData: LoginSchema) {
  try {
    // const response = await api.post("/user/authenticate", {
    //   email: formData.email,
    //   password: formData.password,
    // })
    // setCookie("auth", JSON.stringify(response.data))
    const response = await fetchPermissionsByName("")
    setCookie("permissions", JSON.stringify(response))
    setCookie("accountId", "ec86dcb8-b6df-4a9f-890b-d9fec35ec8d1")
  } catch (error) {
    console.error(error)
  }
}
