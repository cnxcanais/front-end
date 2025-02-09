"use client"

import { Expense } from "@/@types/expense"
import { ExpenseDetails } from "@/@types/expense-details"
import { getAccountId } from "@/core/utils/get-account-id"
import { ExpenseDetailForm } from "@/modules/expenses-components/expense-components/create-expense/presentation/components/ExpenseDetailsForm"
import { ExpenseForm } from "@/modules/expenses-components/expense-components/create-expense/presentation/components/ExpenseForm"
import { createExpenseFormSchema } from "@/modules/expenses-components/expense-components/create-expense/presentation/validation/schema"
import { createExpense } from "@/modules/expenses-components/expense-components/remote/create-expense"
import { createExpenseDetails } from "@/modules/expenses-components/expense-details-components/remote"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

type ExpenseDetailsArray = {
  expenseDetailsArray: ExpenseDetails.CreateRequest[]
}

export type FormType = Expense.CreateRequest & ExpenseDetailsArray

export function CreateExpenseForm() {
  const account_id = getAccountId()

  const [secondPage, setSecondPage] = useState<boolean>(false)

  const methods = useForm<FormType>({
    resolver: zodResolver(createExpenseFormSchema),
    mode: "onChange",
    values: {
      //Expense
      account_id,
      date: undefined,
      description: "",
      document: "",
      expense_group_id: "",
      expense_percentage: 100,
      supplier_id: "",
      organization_id: "",
      is_operational: false,
      is_variable: false,
      //ExpenseDetails
      expenseDetailsArray: [],
    },
  })

  const { push } = useRouter()

  async function onSubmit(data: FormType) {
    if (data.expenseDetailsArray.length === 0) {
      toast.error("É necessário adicionar pelo menos uma parcela da despesa")
      return
    }

    try {
      const { expenseDetailsArray, ...expenseData } = data

      const response = await createExpense(expenseData)
      const expense_id = response.expense.expense_id

      methods.setValue(
        "expenseDetailsArray",
        expenseDetailsArray.map((detail) => ({ ...detail, expense_id }))
      )
      await createExpenseDetails(methods.getValues("expenseDetailsArray"))
      toast.success("Despesa criada com sucesso!")
      setTimeout(() => push("/expenses"), 2000)
    } catch (error) {
      toast.error("Erro ao criar despesa: " + error)
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        className="mt-6 flex max-w-[1000px] flex-col gap-4"
        onSubmit={methods.handleSubmit(onSubmit)}>
        <div className={secondPage ? "hidden" : "block"}>
          <ExpenseForm account_id={account_id} setSecondPage={setSecondPage} />
        </div>

        <div className={secondPage ? "block" : "hidden"}>
          <ExpenseDetailForm
            account_id={account_id}
            setSecondPage={setSecondPage}
          />
        </div>
      </form>
    </FormProvider>
  )
}
