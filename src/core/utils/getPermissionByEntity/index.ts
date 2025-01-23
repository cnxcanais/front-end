import { getCookie } from "@/lib/cookies"

export const getPermissionByEntity = (entity: string) => {
  if (getCookie("permissions")) {
    const permissions = JSON.parse(getCookie("permissions"))
    return permissions.componentAccess[entity]
  }
}
