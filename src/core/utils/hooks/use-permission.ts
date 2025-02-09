import permissionsJson from "@/core/utils/components_permission.json"
import { getCookie } from "@/lib/cookies"
import { useEffect, useState } from "react"

type Permissions = Record<string, boolean>

export function usePermissions(fieldNames: string[]): Permissions {
  const [permissions, setPermissions] = useState<Permissions>(() =>
    fieldNames.reduce((acc, fieldName) => {
      acc[fieldName] = false
      return acc
    }, {} as Permissions)
  )

  useEffect(() => {
    try {
      const permissionsCookie =
        getCookie("permissions") || JSON.stringify(permissionsJson)
      if (permissionsCookie) {
        const parsed = JSON.parse(permissionsCookie)
        setPermissions(parsed.componentAccess || permissions)
      }
    } catch (error) {
      console.info("Error parsing permissions:", error)
    }
  }, [])

  return permissions
}
