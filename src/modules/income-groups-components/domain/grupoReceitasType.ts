export type GrupoReceitas = {
  expense_group_id: string
  group_name: string
  created_at: Date
  updated_at: Date
  account_id: string
}

export type GrupoReceitasRequest = {
  group_name: string
  account_id: string
}

export type GrupoReceitasUpdate = {
  group_name: string
}
