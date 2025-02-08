"use client"

import { Income } from "@/@types/income"
import { IncomeDetails } from "@/@types/income-details"
import { getAccountId } from "@/core/utils/get-account-id"
import { IncomeDetailForm } from "@/modules/income-components/income-components/create-income/presentation/components/IncomeDetailsForm"
import { IncomeForm } from "@/modules/income-components/income-components/create-income/presentation/components/IncomeForm"
import { createIncomeFormSchema } from "@/modules/income-components/income-components/create-income/presentation/validation/schema"
import { createIncome } from "@/modules/income-components/income-components/remote/create-income"
import { createIncomeDetails } from "@/modules/income-components/income-details-components/remote"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"

type IncomeDetailsArray = {
  incomeDetailsArray: IncomeDetails.CreateRequest[]
}

export type FormType = Income.CreateRequest & IncomeDetailsArray

export function CreateIncomeForm() {
  const account_id = getAccountId()

  const [secondPage, setSecondPage] = useState<boolean>(false)

  const methods = useForm<FormType>({
    resolver: zodResolver(createIncomeFormSchema),
    mode: "onChange",
    values: {
      //Income
      account_id,
      date: undefined,
      description: "",
      document: "",
      income_group_id: "",
      income_percentage: 100,
      income_source_id: "",
      organization_id: "",
      //IncomeDetails
      incomeDetailsArray: [],
    },
  })

  const { push } = useRouter()

  async function onSubmit(data: FormType) {
    if (data.incomeDetailsArray.length === 0) {
      toast.error("É necessário adicionar pelo menos uma parcela da receita")
      return
    }

    try {
      const { incomeDetailsArray, ...incomeData } = data

      const response = await createIncome(incomeData)
      const income_id = response.income.income_id

      methods.setValue(
        "incomeDetailsArray",
        incomeDetailsArray.map((detail) => ({ ...detail, income_id }))
      )
      await createIncomeDetails(methods.getValues("incomeDetailsArray"))
      toast.success("Receita criada com sucesso!")
      setTimeout(() => push("/incomes"), 2000)
    } catch (error) {
      toast.error("Erro ao criar fonte de receita: " + error)
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        className="mt-6 flex max-w-[1000px] flex-col gap-4"
        onSubmit={methods.handleSubmit(onSubmit)}>
        <div className={secondPage ? "hidden" : "block"}>
          <IncomeForm account_id={account_id} setSecondPage={setSecondPage} />
        </div>

        <div className={secondPage ? "block" : "hidden"}>
          <IncomeDetailForm
            account_id={account_id}
            setSecondPage={setSecondPage}
          />
        </div>
      </form>
    </FormProvider>
  )
}
