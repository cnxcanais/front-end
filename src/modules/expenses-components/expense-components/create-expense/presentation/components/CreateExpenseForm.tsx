"use client"

import { Expense } from "@/@types/expense"
import { ExpenseDetails } from "@/@types/expense-details"
import { getAccountId } from "@/core/utils/get-account-id"
import { ExpenseDetailForm } from "@/modules/expenses-components/expense-components/create-expense/presentation/components/ExpenseDetailsForm"
import { ExpenseForm } from "@/modules/expenses-components/expense-components/create-expense/presentation/components/ExpenseForm"
import {
  createExpenseFormSchema,
  ExpenseSchema,
} from "@/modules/expenses-components/expense-components/create-expense/presentation/validation/schema"
import { createExpense } from "@/modules/expenses-components/expense-components/remote/create-expense"
import { createExpenseDetails } from "@/modules/expenses-components/expense-details-components/remote"
import { createIncome } from "@/modules/income-components/income-components/remote"
import { createIncomeDetails } from "@/modules/income-components/income-details-components/remote"
import { getAllIncomeGroups } from "@/modules/income-components/income-groups-components/remote/income-group"
import { getIncomeSources } from "@/modules/income-components/income-source-components/income-sources/infra/remote"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

type ExpenseDetailsArray = {
  expenseDetailsArray: ExpenseDetails.CreateRequest[]
}

export type FormType = Expense.CreateRequest &
  ExpenseDetailsArray & {
    destinyFranchiseId?: string
    destinyFranchiseBankId?: string
    destinyFranchiseOrganizationId?: string
  }

export function CreateExpenseForm() {
  const account_id = getAccountId()

  const [secondPage, setSecondPage] = useState<boolean>(false)

  const methods = useForm<ExpenseSchema>({
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
      //Franchise
      destinyFranchiseId: "",
      destinyFranchiseBankId: "",
      destinyFranchiseOrganizationId: "",
    },
  })

  const { push } = useRouter()

  async function onSubmit(data: FormType) {
    if (data.expenseDetailsArray.length === 0) {
      toast.error("É necessário adicionar pelo menos uma parcela da despesa")
      return
    }

    try {
      const {
        expenseDetailsArray,
        destinyFranchiseBankId,
        destinyFranchiseId,
        destinyFranchiseOrganizationId,
        ...expenseData
      } = data

      const response = await createExpense(expenseData)
      if (response?.expense.expense_id) {
        const expense_id = response.expense.expense_id
        const updatedExpenseDetailsArray = expenseDetailsArray.map(
          (detail) => ({
            ...detail,
            expense_id,
          })
        )
        methods.setValue("expenseDetailsArray", updatedExpenseDetailsArray)
        await createExpenseDetails(updatedExpenseDetailsArray)

        toast.success("Despesa criada com sucesso!")
      }

      if (
        destinyFranchiseId &&
        destinyFranchiseBankId &&
        destinyFranchiseOrganizationId
      ) {
        const franchiseIncomeGroup = await getAllIncomeGroups(
          destinyFranchiseId,
          {
            group_name: "REPASSES PIASEG",
          }
        )
        const franchiseIncomeSource = await getIncomeSources(
          destinyFranchiseId,
          {
            name: "PIASEG",
          }
        )

        if (
          franchiseIncomeGroup.length !== 0 ||
          franchiseIncomeSource.length !== 0
        ) {
          const franchiseIncome = await createIncome({
            account_id: destinyFranchiseId,
            date: expenseData.date,
            description: expenseData.description,
            document: expenseData.document,
            income_group_id: franchiseIncomeGroup[0]?.income_group_id,
            income_percentage: 100,
            income_source_id: franchiseIncomeSource[0]?.income_source_id,
            organization_id: destinyFranchiseOrganizationId,
          })

          const franchiseIncomeDetails = expenseDetailsArray.map((detail) => {
            const { account_id, bank_account_id, expense_id, ...rest } = detail
            const incomeDetails = {
              ...rest,
              income_id: franchiseIncome.income.income_id,
              bank_account_id: destinyFranchiseBankId,
              account_id: destinyFranchiseId,
            }
            return incomeDetails
          })

          const response = await createIncomeDetails(franchiseIncomeDetails)
          if (response) {
            setTimeout(
              () => toast.success("Repasses criados com sucesso!"),
              2000
            )
          } else {
            setTimeout(() => toast.error("Erro ao criar repasses"), 2000)
          }
        } else {
          toast.error(
            "Erro ao criar repasses: Grupo de receitas ou cliente não encontrado"
          )
        }
      }

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
