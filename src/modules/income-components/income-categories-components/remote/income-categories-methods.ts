import { IncomeCategory } from "@/@types/income-category"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export const createIncomeCategory = async (
  incomeCategory: IncomeCategory.CreateRequest
) => {
  try {
    const response = await api.post("/incomes-categories", incomeCategory)
    return response.data.message
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}

export const getAllIncomeCategories = async (accountId: string) => {
  try {
    const response = await api.get<IncomeCategory.GetResponse>(
      `/incomes-categories/account/${accountId}`
    )
    return response.data.incomeCategories
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}

export const getIncomeCategoryById = async (id: string) => {
  try {
    const response = await api.get(`/incomes-categories/${id}`)
    return response.data.incomeCategory
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}

export const updateIncomeCategory = async (
  id: string,
  incomeCategory: IncomeCategory.UpdateRequest
) => {
  try {
    const response = await api.put(`/incomes-categories/${id}`, incomeCategory)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}

export const deleteIncomeCategory = async (id: string) => {
  try {
    const response = await api.delete(`/incomes-categories/${id}`)
    return response.data.message
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
