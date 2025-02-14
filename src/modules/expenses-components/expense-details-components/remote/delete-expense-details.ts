import { api } from "@/lib/axios"

export const deleteExpenseDetails = async (id: string) => {
  try {
    await api.delete(`/expense-details/${id}`)
  } catch (error) {
    console.info("Erro ao deletar parcela de despesa:", error)
    throw error
  }
}
