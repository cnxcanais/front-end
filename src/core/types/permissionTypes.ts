export type PermissionType = {
  id: string
  name: string
  urlAccess: AccessType
  componentAccess: AccessType
}

export type AccessType = {
  [key: string]: boolean
}
