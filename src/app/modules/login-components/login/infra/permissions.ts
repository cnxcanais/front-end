import { PermissionType } from "@/core/types/permissionTypes"
import mockPermissions from "@/core/utils/permission.json"
import { Permissions } from "../domain/entities/permissions"

export const fetchPermissionsByName = async (name: string) => {
  const getMockPermissions = async (): Promise<PermissionType> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockPermissions as PermissionType)
      }, 1000)
    })
  }
  const response: PermissionType = await getMockPermissions()
  return new Permissions(response)
}
