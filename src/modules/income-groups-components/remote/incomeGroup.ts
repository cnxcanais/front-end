import { IncomeGroup } from "@/@types/income-group"
import { api } from "@/lib/axios"

export const createIncomeGroup = async (incomeGroup: IncomeGroup.Request) => {
  const response = await api.post("/income-groups", incomeGroup)
  return response.data.message
}

export const getAllIncomeGroups = async (accountId: string) => {
  const response: { data: IncomeGroup.Response } = await api.get(
    `/income-groups/account/${accountId}`
  )
  return response.data.incomeGroups
}

export const getIncomeGroupById = async (id: string) => {
  const response = await api.get(`/income-groups/${id}`)
  return response.data
}

export const updateIncomeGroup = async (
  id: string,
  grupoReceitas: IncomeGroup.Update
) => {
  const response = await api.put(`/income-groups/${id}`, grupoReceitas)
  return response.data
}

export const deleteIncomeGroup = async (id: string) => {
  const response = await api.delete(`/income-groups/${id}`)
  return response.data
}
