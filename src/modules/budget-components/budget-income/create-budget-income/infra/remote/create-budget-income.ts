import { Budget } from "@/@types/budgets"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

type CreateBudgetIncomeSchema = {
  data: Budget.CreateIncome[]
}

export async function createBudgetIncome({ data }: CreateBudgetIncomeSchema) {
  try {
    const response = await api.post("/budget-income", data)

    return response.data.message
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
