import { IncomeGroup } from "@/@types/income-group"
import { api } from "@/lib/axios"

export const createIncomeGroup = async (
  incomeGroup: IncomeGroup.CreateRequest
) => {
  const response = await api.post("/income-groups", incomeGroup)
  return response.data.message
}

export const getAllIncomeGroups = async (
  account_id: string,
  queryParams?: IncomeGroup.GetRequest
) => {
  const response: { data: IncomeGroup.GetResponse } = await api.get(
    `/income-groups/account/${account_id}`,
    {
      params: queryParams,
    }
  )
  return response.data.incomeGroups
}

export const getIncomeGroupById = async (id: string) => {
  const response = await api.get(`/income-groups/${id}`)
  return response.data
}

export const updateIncomeGroup = async (
  id: string,
  incomeGroup: IncomeGroup.UpdateRequest
) => {
  const response = await api.put(`/income-groups/${id}`, incomeGroup)
  return response.data
}

export const deleteIncomeGroup = async (id: string) => {
  const response = await api.delete(`/income-groups/${id}`)
  return response.data
}
