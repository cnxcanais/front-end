import { Permission } from "@/@types/permissions"
import { api } from "@/lib/axios"

export async function clonePermissions(
  permissions: Permission.UpdatePermissionRequest
) {
  try {
    const { data } = await api.post<Permission.UpdatePermissionResponse>(
      `/permissions`,
      permissions
    )

    return data.permissionData
  } catch (error) {
    console.info(error)
  }
}
