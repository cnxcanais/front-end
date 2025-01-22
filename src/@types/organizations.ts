export namespace Organization {
  export type GetRequest = {
    accountId: string
  }

  export type GetRequestParams = {
    organizationId: string
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
    organizationId: string
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
    organizationId: string
  }

  export type UpdateRequest = {
    name: string
    cnpj: string
    address: string
    phone: string
    email: string
    organizationId: string
  }
}
