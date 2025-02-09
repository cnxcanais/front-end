export namespace Supplier {
  export type Type = {
    supplier_id: string
    name: string
    cpf_cnpj: string
    email: string
    address_1: string
    address_2: string
    address_3: string
    city: string
    state: string
    cep: string
    contact_name: string
    phone: string
    created_at: Date
    updated_at: Date
    account_id: string
  }

  export type GetResponse = {
    suppliers: Type[]
  }

  export type GetByIdResponse = {
    supplier: Type
  }

  export type CreateRequest = {
    name: string
    cpf_cnpj: string
    city: string
    state: string
    cep: string
    address_1: string
    address_2?: string
    address_3?: string
    phone: string
    contact_name: string
    email: string
    account_id: string
  }

  export type UpdateRequest = {
    supplier_id: string
    name: string
    cpf_cnpj: string
    city: string
    state: string
    cep: string
    address_1: string
    address_2: string
    address_3: string
    phone: string
    contact_name: string
    email: string
    account_id: string
  }
}
