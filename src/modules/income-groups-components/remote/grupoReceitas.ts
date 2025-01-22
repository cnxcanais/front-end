import { api } from "@/lib/axios"
import {
  GrupoReceitas,
  GrupoReceitasRequest,
  GrupoReceitasUpdate,
} from "@/modules/income-groups-components/domain/grupoReceitasType"

export const createIncomeGroup = async (
  grupoReceitas: GrupoReceitasRequest
) => {
  const response: { data: GrupoReceitas } = await api.post(
    "/expenses-groups",
    grupoReceitas
  )
  return response.data
}

export const getAllIncomeGroups = async (accountId: string) => {
  const response: { incomeGroups: GrupoReceitas[] } = await api.get(
    `/income-groups/account/${accountId}`
  )
  return response.incomeGroups
}

export const getIncomeGroupById = async (id: string) => {
  const response: { data: GrupoReceitas } = await api.get(
    `/income-groups/${id}`
  )
  return response.data
}

export const updateIncomeGroup = async (
  id: string,
  grupoReceitas: GrupoReceitasUpdate
) => {
  const response: { data: GrupoReceitas } = await api.put(
    `/income-groups/${id}`,
    grupoReceitas
  )
  return response.data
}

export const deleteIncomeGroup = async (id: string) => {
  const response = await api.delete(`/income-groups/${id}`)
  return response.data
}
