import { Budget } from "@/@types/budgets"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

type CreateBudgetExpenseSchema = {
  data: Budget.CreateExpense[]
}

export async function createBudgetExpense({ data }: CreateBudgetExpenseSchema) {
  try {
    const response = await api.post("/budget-expense", data)

    return response.data.message
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
