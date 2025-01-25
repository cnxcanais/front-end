import { ExpenseGroup } from "@/@types/expense-group"
import { api } from "@/lib/axios"

export const createExpenseGroup = async (
  expenseGroup: ExpenseGroup.CreateRequest
) => {
  const response = await api.post("/expenses-groups", expenseGroup)
  return response.data.message
}

export const getAllExpenseGroups = async (accountId: string) => {
  const response = await api.get<ExpenseGroup.GetResponse>(
    `/expenses-groups/account/${accountId}`
  )
  return response.data.expenseGroups
}

export const getExpenseGroupById = async (id: string) => {
  const response = await api.get(`/expenses-groups/${id}`)
  return response.data
}

export const updateExpenseGroup = async (
  id: string,
  expenseGroup: ExpenseGroup.UpdateRequest
) => {
  const response = await api.put(`/expenses-groups/${id}`, expenseGroup)
  return response
}

export const deleteExpenseGroup = async (id: string) => {
  const response = await api.delete(`/expenses-groups/${id}`)
  return response.data
}
