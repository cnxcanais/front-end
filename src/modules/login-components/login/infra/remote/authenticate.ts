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
    setCookie("accountId", process.env.NEXT_PUBLIC_ACCOUNT_ID)
  } catch (error) {
    console.error(error)
  }
}
