import { User } from "./users"

export namespace Log {
  export type Type = {
    log_id: string
    user_id: string
    type: string
    table: string
    value: string
    timestamp: string
    account_id: string
    user: User.Type
  }

  export type GetResponse = {
    logs: Type[]
  }
}
