// import { api } from "@/lib/axios"
// import { setCookie } from "@/lib/cookies"
import componentsPermissions from "@/core/utils/components_permission.json"
import urlPermissions from "@/core/utils/url_permissions.json"
import { setCookie } from "@/lib/cookies"
import { LoginSchema } from "@/modules/login-components/login/presentation/validation/schema"

export async function authenticate(formData: LoginSchema) {
  try {
    // const response = await api.post("/user/authenticate", {
    //   email: formData.email,
    //   password: formData.password,
    // })
    // setCookie("auth", JSON.stringify(response.data))

    setCookie("permissions", JSON.stringify(componentsPermissions))
    setCookie("accountId", process.env.NEXT_PUBLIC_ACCOUNT_ID)
    setCookie("path_permissions", JSON.stringify(urlPermissions))
  } catch (error) {
    console.info(error)
  }
}
