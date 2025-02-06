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
      const permissionsCookie = getCookie("permissions")
      if (permissionsCookie) {
        const parsed = JSON.parse(permissionsCookie)
        setPermissions(parsed.componentAccess || permissions)
      }
    } catch (error) {
      console.error("Error parsing permissions:", error)
    }
  }, [])

  return permissions
}
