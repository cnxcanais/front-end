import { getCookie } from "@/lib/cookies"

export function getPermissionByEntity(entity: string) {
  if (getCookie("permissions")) {
    const permissions = JSON.parse(getCookie("permissions"))
    return permissions.componentAccess[entity] as boolean
  }
}
