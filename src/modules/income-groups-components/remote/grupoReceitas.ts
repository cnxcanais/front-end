import { api } from "@/lib/axios"
import {
  IncomeGroup,
  IncomeGroupsRequest,
  IncomeGroupsResponse,
  IncomeGroupsUpdate,
} from "@/modules/income-groups-components/domain/grupoReceitasType"

export const createIncomeGroup = async (grupoReceitas: IncomeGroupsRequest) => {
  const response: { data: IncomeGroup } = await api.post(
    "/expenses-groups",
    grupoReceitas
  )
  return response.data
}

export const getAllIncomeGroups = async (accountId: string) => {
  const response: { data: IncomeGroupsResponse } = await api.get(
    `/income-groups/account/${accountId}`
  )
  return response.data.incomeGroups
}

export const getIncomeGroupById = async (id: string) => {
  const response: { data: IncomeGroup } = await api.get(`/income-groups/${id}`)
  return response.data
}

export const updateIncomeGroup = async (
  id: string,
  grupoReceitas: IncomeGroupsUpdate
) => {
  const response: { data: IncomeGroup } = await api.put(
    `/income-groups/${id}`,
    grupoReceitas
  )
  return response.data
}

export const deleteIncomeGroup = async (id: string) => {
  const response = await api.delete(`/income-groups/${id}`)
  return response.data
}
