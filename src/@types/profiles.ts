export namespace Profile {
  export interface Entity {
    entity_id: string
    entity: string
    created_at: string
    updated_at: string
  }

  export interface EntityAccess {
    entity_access_id: string
    profile_id: string
    entity_id: string
    access: boolean
    created_at: string
    updated_at: string
    entity: Entity
  }

  export interface Path {
    path_id: string
    url: string
    created_at: string
    updated_at: string
  }

  export interface PathAccess {
    path_access_id: string
    profile_id: string
    created_at: string
    updated_at: string
    path_id: string
    access: boolean
    path: Path
  }

  export interface User {
    user_id: string
    name: string
    email: string
    password: string
    is_verified: boolean
    email_verification_token: string
    profile_id: string
    created_at: string
    updated_at: string
    account_id: string
  }

  export type Type = {
    profile_id: string
    name: string
    created_at: Date
    updated_at: Date
    account_id: string
    entities_access: EntityAccess[]
    paths_access: PathAccess[]
    user: User[]
  }

  export type GetResponse = {
    profiles: Type[]
  }

  export type GetByIdResponse = {
    profile: Type
  }

  export type CreateRequest = {
    name: string
    account_id: string
  }

  export type UpdateRequest = {
    profile_id: string
    name?: string
  }
}
