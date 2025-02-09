import { ExpenseDetails } from "@/@types/expense-details"
import { api } from "@/lib/axios"
import { AxiosError } from "axios"

export async function editExpenseDetails({
  amount,
  bank_account_id,
  part,
  due_date,
  expense_id,
  is_paid,
  expense_details_id,
}: ExpenseDetails.UpdateRequest) {
  try {
    await api.put(`/expense-details/${expense_details_id}`, {
      amount,
      bank_account_id,
      part,
      due_date,
      expense_id,
      is_paid,
    })
  } catch (error) {
    // all errors will return in a message property inside data
    if (error instanceof AxiosError) throw error.response.data.message
    throw error
  }
}
