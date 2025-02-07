import { getCookie } from "@/lib/cookies"

export function getPermissionByEntity(entity: string): boolean {
  try {
    const permissionsCookie = getCookie("permissions")

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
    console.error("Error parsing permissions:", error)
    return false
  }
}
