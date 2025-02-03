import { Profile } from "@/@types/profiles"
import { api } from "@/lib/axios"

export async function getProfiles(account_id: string) {
  try {
    const { data } = await api.get<Profile.GetResponse>(
      `/profile/account/${account_id}`
    )

    return data.profiles
  } catch (error) {
    console.error(error)
  }
}
