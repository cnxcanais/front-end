import { api } from "@/lib/axios"
import {
  GrupoReceitas,
  GrupoReceitasRequest,
  GrupoReceitasUpdate,
} from "@/modules/form-components/grupo-receitas/domain/grupoReceitasType"

export const createGrupoReceitas = async (
  grupoReceitas: GrupoReceitasRequest
) => {
  const response: { data: GrupoReceitas } = await api.post(
    "/expenses-groups",
    grupoReceitas
  )
  return response.data
}

export const getAllGrupoReceitas = async () => {
  const response: { data: GrupoReceitas[] } = await api.get("/expenses-groups")
  return response.data
}

export const getGrupoReceitasById = async (id: string) => {
  const response: { data: GrupoReceitas } = await api.get(
    `/expenses-groups/${id}`
  )
  return response.data
}

export const updateGrupoReceitas = async (
  id: string,
  grupoReceitas: GrupoReceitasUpdate
) => {
  const response: { data: GrupoReceitas } = await api.put(
    `/expenses-groups/${id}`,
    grupoReceitas
  )
  return response.data
}

export const deleteGrupoReceitas = async (id: string) => {
  const response = await api.delete(`/expenses-groups/${id}`)
  return response.data
}
