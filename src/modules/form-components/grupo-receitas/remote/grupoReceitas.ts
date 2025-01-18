import { IncomeSource } from "@/@types/income-sources"
import { api } from "@/lib/axios"

export const createGrupoReceitas = async (
  grupoReceitas: IncomeSource.CreateRequest
) => {
  const response = await api.post("/income-groups", grupoReceitas)
  return response.data
}

export const getAllGrupoReceitas = async (accountId: string) => {
  const response = await api.get<IncomeSource.GetRequest[]>(
    `/income-groups/account/${accountId}`
  )
  return response.data
}

export const getGrupoReceitasById = async (id: string) => {
  const response = await api.get<IncomeSource.GetRequest>(
    `/income-groups/${id}`
  )
  return response.data
}

export const updateGrupoReceitas = async (
  id: string,
  grupoReceitas: IncomeSource.UpdateRequest
) => {
  const response = await api.put(`/income-groups/${id}`, grupoReceitas)
  return response.data
}

export const deleteGrupoReceitas = async (id: string) => {
  const response = await api.delete(`/income-groups/${id}`)
  return response.data
}
