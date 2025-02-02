"use client"

import { Income } from "@/@types/income"
import { IncomeDetails } from "@/@types/income-details"
import { getCookie } from "@/lib/cookies"
import { createIncomeFormSchema } from "@/modules/income-components/income-components/income/create-income/presentation/validation/schema"
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
  const account_id = getCookie("accountId")

  const [secondPage, setSecondPage] = useState<boolean>(false)

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
    mode: "onChange",
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

  console.log(errors)

  const { push } = useRouter()

  async function onSubmit(data: FormType) {
    if (data.incomeDetailsArray.length === 0) {
      toast.error("É necessário adicionar pelo menos uma parcela da receita")
      return
    }

    if (!data.incomeDetailsArray[0].bank_account_id) {
      toast.error("Insira uma conta bancária")
      return
    }

    console.log(data)
    toast.success("Submit enviado")

    // try {
    //   const { incomeDetailsArray, ...incomeData } = data

    //   const response = await createIncome(incomeData)
    //   const income_id = response.income.income_id

    //   setValue(
    //     "incomeDetailsArray",
    //     incomeDetailsArray.map((detail) => ({ ...detail, income_id }))
    //   )
    //   await createIncomeDetails(getValues("incomeDetailsArray"))
    //   toast.success("Receita criada com sucesso!")
    //   setTimeout(() => push("/incomes"), 2000)
    // } catch (error) {
    //   toast.error("Erro ao criar fonte de receita: " + error)
    // }
  }

  console.log(errors)

  return (
    <>
      <form
        className="mt-6 flex max-w-[1000px] flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}>
        <div className={secondPage ? "hidden" : "block"}>
          <IncomeForm
            account_id={account_id}
            errors={errors}
            control={control}
            register={register}
            setSecondPage={setSecondPage}
            trigger={trigger}
          />
        </div>

        <div className={secondPage ? "block" : "hidden"}>
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
        </div>
      </form>
    </>
  )
}
