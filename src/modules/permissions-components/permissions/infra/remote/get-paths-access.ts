import { Permission } from "@/@types/permissions"
import { api } from "@/lib/axios"

export async function getPathsAccess(profile_id: string) {
  try {
    const { data } = await api.get<Permission.GetPathsResponse>(
      "/path-access",
      {
        params: {
          profile_id,
        },
      }
    )

    return data.pathAccess
  } catch (error) {
    console.info(error)
  }
}
