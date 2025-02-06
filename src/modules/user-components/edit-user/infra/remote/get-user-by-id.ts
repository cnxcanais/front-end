import { User } from "@/@types/users"
import { api } from "@/lib/axios"

export async function getUserById(user_id: string) {
  try {
    const { data } = await api.get<User.GetByIdResponse>(`/user/${user_id}`)

    return data.user
  } catch (error) {
    console.error(error)
    throw error
  }
}
