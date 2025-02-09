export namespace Files {
  export type Type = {
    file_id: string
    description: string
    file_url: string
    file_key: string
    supplier: any
    supplier_id: string
    income_source: any
    income_source_id: string
    created_at: Date
    updated_at: Date
    account: any
    account_id: string
  }

  export type CreateRequest = {
    files: File[]
    income_source_id?: string
    supplier_id?: string
    account_id: string
    expense_id?: string
    income_id?: string
  }

  export type GetRequest = {
    files: Type[]
  }

  export type GetByIdResponse = {
    file: Type
  }
}
