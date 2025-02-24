import { IncomeGroup } from "@/@types/income-group"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export const createIncomeGroup = async (
  incomeGroup: IncomeGroup.CreateRequest
) => {
  try {
    const response = await api.post("/income-groups", incomeGroup)
    return response.data.message
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}

export const getAllIncomeGroups = async (
  account_id: string,
  queryParams?: IncomeGroup.GetRequest
) => {
  try {
    const response: { data: IncomeGroup.GetResponse } = await api.get(
      `/income-groups/account/${account_id}`,
      {
        params: queryParams,
      }
    )
    return response.data.incomeGroups
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}

export const getIncomeGroupById = async (id: string) => {
  try {
    const response = await api.get(`/income-groups/${id}`)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}

export const updateIncomeGroup = async (
  id: string,
  incomeGroup: IncomeGroup.UpdateRequest
) => {
  try {
    const response = await api.put(`/income-groups/${id}`, incomeGroup)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}

export const deleteIncomeGroup = async (id: string) => {
  try {
    const response = await api.delete(`/income-groups/${id}`)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
