import { ExpenseDetails } from "@/@types/expense-details"
import { api } from "@/lib/axios"

export const deleteExpenseDetails = async (
  id: ExpenseDetails.DeleteRequest
) => {
  try {
    const response = await api.delete(`/expense-details/${id}`)
    return response.data
  } catch (error) {
    console.error("Erro ao deletar parcela de despesa:", error)
    throw error
  }
}
