import { AccessType } from "@/core/types/permissionTypes"

export class Permissions {
  public readonly id: string
  public readonly name: string
  public readonly urlAccess: AccessType
  public readonly componentAccess: AccessType

  constructor(data: Permissions.Data) {
    this.id = data.id
    this.name = data.name
    this.urlAccess = data.urlAccess
    this.componentAccess = data.componentAccess
  }
}

export namespace Permissions {
  export type Data = {
    id: string
    name: string
    urlAccess: AccessType
    componentAccess: AccessType
  }
}
