import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function removeUser(user_id: string) {
  try {
    await api.delete(`/user/${user_id}`)
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
