import { api } from "@/lib/axios"

export async function removeBudgetExpense(budget_expense_id: string) {
  try {
    const { data } = await api.delete(`/budget-expense/${budget_expense_id}`)

    return data.message
  } catch (error) {
    console.info(error)
  }
}
