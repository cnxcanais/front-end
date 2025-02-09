import { api } from "@/lib/axios"

export async function removeBudgetIncome(budget_income_id: string) {
  try {
    const { data } = await api.delete(`/budget-income/${budget_income_id}`)

    return data.message
  } catch (error) {
    console.error(error)
  }
}
