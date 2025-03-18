import { Report } from "@/@types/reports"
import { api } from "@/lib/axios"

export async function getComparisonData(
  account_id: string,
  queryParams: {
    start_date?: string
    end_date?: string
  }
) {
  try {
    const { data } = await api.get<Report.ComparisonData>(
      `/reports/budget-comparison/${account_id}`,
      {
        params: queryParams,
      }
    )

    console.dir(data)

    return {
      incomes: data.incomes,
      expenses: data.expenses,
      budgetIncomes: data.budgetIncomes,
      budgetExpenses: data.budgetExpenses,
    }
  } catch (error) {
    console.info(error)
    return {
      incomes: [],
      expenses: [],
      budgetIncomes: [],
      budgetExpenses: [],
    }
  }
}
