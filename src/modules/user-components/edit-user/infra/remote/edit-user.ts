import { User } from "@/@types/users"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editUser({
  email,
  name,
  password,
  profile_id,
  user_id,
}: User.UpdateRequest) {
  try {
    await api.put(`/user/${user_id}`, {
      email,
      name,
      password,
      profile_id,
    })
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
