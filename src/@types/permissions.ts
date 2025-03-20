import { Profile } from "./profiles"

export namespace Permission {
  export type Type = {
    name: string
    urlAccess: Record<string, boolean>
    componentAccess: Record<string, boolean>
  }

  export type PathsAccess = {
    path_access_id: string
    profile_id: string
    created_at: string
    updated_at: string
    path_id: string
    path: Path
    profile: Profile.Type
    access: boolean
  }

  export type Entity = {
    entity_id: string
    entity: string
    created_at: string
    updated_at: string
    entities_access: EntityAccess[]
  }

  export type Path = {
    path_id: string
    url: string
    created_at: string
    updated_at: string
    paths_access: PathsAccess[]
  }

  export type EntityAccess = {
    entity_access_id: string
    profile_id: string
    entity_id: string
    created_at: string
    updated_at: string
    entity: Entity
    profile: Profile.Type
    access: boolean
  }

  export type GetResponse = {
    permissions: Type[]
  }

  export type GetPathsResponse = {
    pathAccess: PathsAccess[]
  }

  export type GetEntitiesResponse = {
    entityAccess: EntityAccess[]
  }
}
