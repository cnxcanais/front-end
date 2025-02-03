export namespace Organization {
  export type Type = {
    organization_id: string
    name: string
    cnpj: string
    email: string
    address: string
    phone: string
    created_at: Date
    updated_at: Date
    account_id: string
  }

  export type GetRequestQueryParams = {
    organization_id: string
    name: string
    cnpj: string
    email: string
    address: string
  }

  export type GetResponse = {
    organizations: Type[]
  }

  export type GetByIdResponse = {
    organization: Type
  }

  export type CreateRequest = {
    name: string
    cnpj: string
    address: string
    phone: string
    email: string
    account_id: string
  }

  export type UpdateRequest = {
    organization_id: string
    name?: string
    cnpj?: string
    address?: string
    phone?: string
    email?: string
  }
}
