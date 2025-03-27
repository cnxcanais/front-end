import { Permission } from "@/@types/permissions"
import { api } from "@/lib/axios"

export async function getEntitiesAccess(profile_id: string) {
  try {
    const { data } = await api.get<Permission.GetEntitiesResponse>(
      "/entity-access",
      {
        params: {
          profile_id,
        },
      }
    )

    return data.entityAccess
  } catch (error) {
    console.error(error)
  }
}
