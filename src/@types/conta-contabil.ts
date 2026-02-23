export interface ContaContabil {
  id: string
  corretoraId: string
  codigo: string
  descricao: string
  createdAt: string
  updatedAt: string
  corretora?: {
    id: string
    nomeFantasia: string
  }
}

export interface ContasContabeisResponse {
  data: ContaContabil[]
  total: number
  page: number
  limit: number
  totalPages: number
}
