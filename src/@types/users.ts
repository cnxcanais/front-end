import { Account } from "./accounts"
import { Profile } from "./profiles"

export namespace User {
  export type Type = {
    user_id: string
    name: string
    email: string
    is_verified: boolean
    profile_id: string
    created_at: Date
    updated_at: Date
    account_id: string
    account: Account.Type
    profile: Profile.Type
  }

  export type GetResponse = {
    users: Type[]
  }

  export type GetByIdResponse = {
    user: Type
  }

  export type CreateRequest = {
    name: string
    email: string
    password: string
    account_id: string
    account_name?: string
    profile_id: string
  }

  export type UpdateRequest = {
    user_id: string
    name?: string
    email?: string
    profile_id?: string
    password?: string
  }
}
