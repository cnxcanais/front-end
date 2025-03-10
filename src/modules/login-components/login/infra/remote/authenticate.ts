import { Account } from "@/@types/accounts"
import { User } from "@/@types/users"
import urlPermissions from "@/core/utils/url_permissions.json"
import { api } from "@/lib/axios"
import { setCookie } from "@/lib/cookies"
import { LoginSchema } from "@/modules/login-components/login/presentation/validation/schema"
import { AxiosError } from "axios"

type AuthenticateResponseProps = {
  account: Account.Type
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

    setCookie("accountId", data.user.account_id)
    setCookie("token", data.token)
    setCookie("path_permissions", JSON.stringify(urlPermissions))
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
