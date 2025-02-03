import { User } from "@/@types/users"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"
import bcrypt from "bcryptjs"

export async function createUser({
  name,
  account_id,
  email,
  password,
  profile_id,
}: User.CreateRequest) {
  try {
    const hashed_password = await bcrypt.hash(password, 6)

    const { data } = await api.post("/user", {
      name,
      account_id,
      email,
      password: hashed_password,
      profile_id,
    })

    return data.message
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
