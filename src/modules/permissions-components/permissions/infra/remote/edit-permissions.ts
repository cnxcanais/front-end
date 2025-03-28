import { Permission } from "@/@types/permissions"
import { api } from "@/lib/axios"

export async function editPermissions(
  permissions: Permission.UpdatePermissionRequest
) {
  try {
    const { data } = await api.put<Permission.UpdatePermissionResponse>(
      `/permissions`,
      permissions
    )

    return data.permissionData
  } catch (error) {
    console.error(error)
  }
}
