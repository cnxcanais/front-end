"use client"

import { Income } from "@/@types/income"
import { IncomeDetails } from "@/@types/income-details"
import { getCookie } from "@/lib/cookies"
import { createIncomeFormSchema } from "@/modules/income-components/income-components/income/create-income/presentation/validation/schema"
import { createIncome } from "@/modules/income-components/income-components/income/remote/create-income"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { IncomeDetailForm } from "./IncomeDetailsForm"
import { IncomeForm } from "./IncomeForm"

type IncomeDetailsArray = {
  incomeDetailsArray: IncomeDetails.CreateRequest[]
}

export type FormType = Income.CreateResquest & IncomeDetailsArray

export function CreateIncomeForm() {
  const { push } = useRouter()

  const account_id = getCookie("accountId")

  const [secondPage, setSecondPage] = useState<boolean>(true)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
    trigger,
    setValue,
    getValues,
    watch,
  } = useForm<FormType>({
    resolver: zodResolver(createIncomeFormSchema),
    values: {
      //Income
      account_id,
      date: null,
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

  async function onSubmit(data: Income.CreateResquest) {
    try {
      const response = await createIncome(data)
      toast.success(response)
      setTimeout(() => push("/incomes"), 2000)
    } catch (error) {
      toast.error("Erro ao criar fonte de receita: " + error)
    }
  }

  return (
    <>
      <form
        className="mt-6 flex max-w-[1000px] flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}>
        {!secondPage && (
          <IncomeForm
            account_id={account_id}
            errors={errors}
            control={control}
            register={register}
            setSecondPage={setSecondPage}
            trigger={trigger}
          />
        )}
        {secondPage && (
          <IncomeDetailForm
            account_id={account_id}
            errors={errors}
            control={control}
            register={register}
            setSecondPage={setSecondPage}
            trigger={trigger}
            getValues={getValues}
            setValue={setValue}
            watch={watch}
          />
        )}
      </form>
      {process.env.NODE_ENV === "development" && <DevTool control={control} />}
    </>
  )
}
