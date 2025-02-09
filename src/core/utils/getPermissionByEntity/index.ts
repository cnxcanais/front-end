import permissionsJson from "@/core/utils/components_permission.json"
import { getCookie } from "@/lib/cookies"

export function getPermissionByEntity(entity: string): boolean {
  try {
    const permissionsCookie =
      getCookie("permissions") || JSON.stringify(permissionsJson)

    if (!permissionsCookie) {
      console.warn("No permissions cookie found")
      return false
    }

    const permissions = JSON.parse(permissionsCookie)

    if (!permissions?.componentAccess) {
      console.warn("Invalid permissions structure")
      return false
    }

    return Boolean(permissions.componentAccess[entity])
  } catch (error) {
    console.info("Error parsing permissions:", error)
    return false
  }
}
