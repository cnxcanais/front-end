import { ExpenseGroup } from "@/@types/expense-group"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export const createExpenseGroup = async (
  expenseGroup: ExpenseGroup.CreateRequest
) => {
  try {
    const response = await api.post("/expenses-groups", expenseGroup)
    return response.data.message
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}

export const getAllExpenseGroups = async (accountId: string) => {
  try {
    const response = await api.get<ExpenseGroup.GetResponse>(
      `/expenses-groups/account/${accountId}`
    )
    return response.data.expenseGroups
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}

export const getExpenseGroupById = async (id: string) => {
  try {
    const response = await api.get(`/expenses-groups/${id}`)
    return response.data.expenseGroup
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}

export const updateExpenseGroup = async (
  id: string,
  expenseGroup: ExpenseGroup.UpdateRequest
) => {
  try {
    const response = await api.put(`/expenses-groups/${id}`, expenseGroup)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}

export const deleteExpenseGroup = async (id: string) => {
  try {
    const response = await api.delete(`/expenses-groups/${id}`)
    return response.data.message
  } catch (error) {
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
