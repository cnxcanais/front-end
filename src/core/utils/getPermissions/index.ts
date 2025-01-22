import { getCookie } from "@/lib/cookies"

export const getPermissionByEntity = (entity: string) => {
  const permissions = JSON.parse(getCookie("permissions"))
  return permissions.componentAccess[entity]
}
