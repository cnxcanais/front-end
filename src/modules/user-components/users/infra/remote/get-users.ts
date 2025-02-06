import { User } from "@/@types/users"
import { api } from "@/lib/axios"

export async function getUsers(account_id: string) {
  try {
    const { data } = await api.get<User.GetResponse>(
      `/user/account/${account_id}`
    )

    return data.users
  } catch (error) {
    console.error(error)
  }
}
