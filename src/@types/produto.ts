import { Ramo } from "./ramo"

export interface Produto {
  id: string
  ramoId: string
  ramo: Ramo
  seguroRenovavel: boolean
  descricao: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface ProdutosResponse {
  data: Produto[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
