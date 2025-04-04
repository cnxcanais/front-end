import { User } from "@/@types/users"
import { api } from "@/lib/axios"
import { setCookie } from "@/lib/cookies"
import { LoginSchema } from "@/modules/login-components/login/presentation/validation/schema"
import { AxiosError } from "axios"

type AuthenticateResponseProps = {
  user: User.Type
  token: string
}

export async function authenticate(formData: LoginSchema) {
  try {
    const { data } = await api.post<AuthenticateResponseProps>(
      "/user/authenticate",
      {
        email: formData.email,
        password: formData.password,
      }
    )

    setCookie("profile_name", data.user.profile.name)
    setCookie("accountId", data.user.account_id)
    setCookie("userId", data.user.user_id)
    setCookie("token", data.token)

    const { data: permissionsData } = await api.get(
      `/permissions/${data.user.account_id}/${data.user.profile.name}`
    )

    setCookie(
      "path_permissions",
      JSON.stringify(permissionsData.permissions.urlAccess)
    )
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
