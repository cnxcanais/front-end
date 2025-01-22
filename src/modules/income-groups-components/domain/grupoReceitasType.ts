export type IncomeGroupsResponse = {
  incomeGroups: IncomeGroup[]
}

export type IncomeGroup = {
  expense_group_id: string
  group_name: string
  created_at: Date
  updated_at: Date
  account_id: string
}

export type IncomeGroupsRequest = {
  group_name: string
  account_id: string
}

export type IncomeGroupsUpdate = {
  group_name: string
}
