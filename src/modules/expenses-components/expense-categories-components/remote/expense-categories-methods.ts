import { ExpenseCategory } from "@/@types/expense-category"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export const createExpenseCategory = async (
  expenseCategory: ExpenseCategory.CreateRequest
) => {
  try {
    const response = await api.post("/expenses-categories", expenseCategory)
    return response.data.message
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}

export const getAllExpenseCategories = async (accountId: string) => {
  try {
    const response = await api.get<ExpenseCategory.GetResponse>(
      `/expenses-categories/account/${accountId}`
    )
    return response.data.expenseCategories
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}

export const getExpenseCategoryById = async (id: string) => {
  try {
    const response = await api.get(`/expenses-categories/${id}`)
    return response.data.expenseCategory
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}

export const updateExpenseCategory = async (
  id: string,
  expenseCategory: ExpenseCategory.UpdateRequest
) => {
  try {
    const response = await api.put(
      `/expenses-categories/${id}`,
      expenseCategory
    )
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}

export const deleteExpenseCategory = async (id: string) => {
  try {
    const response = await api.delete(`/expenses-categories/${id}`)
    return response.data.message
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
