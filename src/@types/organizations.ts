export namespace Organization {
  export type GetRequest = {
    accountId: string
  }

  export type GetRequestParams = {
    organization_id: string
    name: string
    cnpj: string
    email: string
    address: string
  }

  export type GetResponse = {
    organizations: {
      organization_id: string
      name: string
      cnpj: string
      email: string
      address: string
      phone: string
      created_at: Date
      updated_at: Date
      account_id: string
    }[]
  }

  export type GetByIdRequest = {
    organization_id: string
  }

  export type GetByIdResponse = {
    organization: {
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
  }

  export type CreateRequest = {
    name: string
    cnpj: string
    address: string
    phone: string
    email: string
    accountId: string
  }

  export type DeleteRequest = {
    organization_id: string
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
