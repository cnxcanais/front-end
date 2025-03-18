import { ExpenseDetails } from "@/@types/expense-details";
import { IncomeDetails } from "@/@types/income-details";
import { api } from "@/lib/axios";

export async function getDetailsData(
  account_id: string,
  queryParams: {
    start_date?: Date;
    end_date?: Date;
  }
) {
  try {
    const [{ data: incomeData }, { data: expenseData }] = await Promise.all([
      api.get<IncomeDetails.GetResponse>(`/income-details/account/${account_id}`, { params: queryParams }),
      api.get<ExpenseDetails.GetResponse>(`/expense-details/account/${account_id}`, { params: queryParams }),
    ]);

    const consolidatedArray = [
      ...incomeData.incomeDetails.map(item => ({
        details_id: item.income_details_id,
        source: item.income.income_source.name,
        document: item.income.document,
        amount: item.amount,
        part: item.part,
        due_date: item.due_date,
        is_paid: item.is_paid,
        type: "income",
        data: item.income,
      })),
      ...expenseData.expenseDetails.map(item => ({
        details_id: item.expense_details_id,
        source: item.expense.supplier.name,
        document: item.expense.document,
        amount: item.amount,
        part: item.part,
        due_date: item.due_date,
        is_paid: item.is_paid,
        type: "expense",
        data: item.expense,
      })),
    ];

    // filtrar apenas os itens pagos (realizado)
    return consolidatedArray.filter(item => !item.is_paid);
  } catch (error) {
    console.error("Erro ao buscar detalhes:", error);
    return [];
  }
}
