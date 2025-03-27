import { Permission } from "@/@types/permissions"
import { api } from "@/lib/axios"

export async function getPermissions(account_id: string, profile_name: string) {
  try {
    const { data } = await api.get<Permission.GetResponse>(
      `/permissions/${account_id}/${profile_name}`
    )

    return data.permissions
  } catch (error) {
    console.error(error)
  }
}
