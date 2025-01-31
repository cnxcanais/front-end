"use client"

import { SearchArray } from "@/@types/search-array"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { ArrayConfig, populateArrays } from "@/core/utils/populateArrays"
import { getCookie } from "@/lib/cookies"
import { getBankAccounts } from "@/modules/bank-accounts-components/bank-accounts/infra/remote"
import { FormType } from "@/modules/income-components/income-components/income/create-income/presentation/components/CreateIncomeForm"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form"
import { toast } from "sonner"
import { IncomeDetailsInfo } from "./IncomeDetailsInfo"

type Props = {
  account_id: string
  errors: FieldErrors<FormType>
  control: Control<FormType, any>
  register: UseFormRegister<FormType>
  setSecondPage: Dispatch<SetStateAction<boolean>>
  trigger: UseFormTrigger<FormType>
  setValue: UseFormSetValue<FormType>
  getValues: UseFormGetValues<FormType>
  watch: UseFormWatch<FormType>
}

const { income_input_fields_bank_account_id } = JSON.parse(
  getCookie("permissions")
).componentAccess

export function IncomeDetailForm({
  account_id,
  errors,
  control,
  register,
  setSecondPage,
  trigger,
  getValues,
  setValue,
  watch,
}: Props) {
  const { push } = useRouter()

  const [bankAccounts, setBankAccounts] = useState<SearchArray>([])
  const [initialIndividualValue, setInitialIndividualValue] = useState<
    number | null
  >(null)
  const [arrayPlaceHolder, setArrayPlaceHolder] = useState("Carregando...")
  const [detailsInfo, setDetailsInfo] = useState<{
    totalAmount: number
    partsQty: number
    bankAccountId: string
  }>({
    totalAmount: null,
    partsQty: null,
    bankAccountId: null,
  })

  const renderDetailsInfo = () => {
    return Array(detailsInfo.partsQty)
      .fill(null)
      .map((_, index) => (
        <IncomeDetailsInfo
          key={index}
          errors={errors}
          control={control}
          index={index}
          initialIndividualValue={initialIndividualValue}
          register={register}
        />
      ))
  }

  const detailsArray = watch("incomeDetailsArray")
  const { bankAccountId } = detailsInfo

  useEffect(() => {
    if (detailsArray?.length) {
      detailsArray.forEach((item, index) => {
        setValue(`incomeDetailsArray.${index}.part`, index + 1)
        setValue(`incomeDetailsArray.${index}.account_id`, account_id)
      })
    }
  }, [detailsArray.length])

  useEffect(() => {
    if (detailsInfo.partsQty > 0 && detailsInfo.totalAmount > 0) {
      setInitialIndividualValue(detailsInfo.totalAmount / detailsInfo.partsQty)
    }
  }, [detailsInfo.partsQty, detailsInfo.totalAmount])

  useEffect(() => {
    if (initialIndividualValue) {
      detailsArray.forEach((_, index) => {
        setValue(`incomeDetailsArray.${index}.amount`, initialIndividualValue)
      })
    }
  }, [initialIndividualValue, detailsArray.length])

  useEffect(() => {
    if (detailsArray?.length && bankAccountId) {
      detailsArray.forEach((item, index) => {
        setValue(`incomeDetailsArray.${index}.bank_account_id`, bankAccountId)
      })
    }
  }, [detailsArray.length, bankAccountId, setValue])

  console.log(detailsArray)
  const arrayConfigs: ArrayConfig<any>[] = [
    {
      fetchFn: getBankAccounts,
      mapFn: (acc) => ({
        label: `${acc.bank.name} - ${acc.account_number}`,
        value: acc.bank_account_id,
      }),
      setState: setBankAccounts,
    },
  ]

  useEffect(() => {
    populateArrays(
      arrayConfigs,
      { account_id },
      () => setArrayPlaceHolder("Digite..."),
      (error) => {
        toast.error("Erro ao buscar dados: " + error.message)
        setArrayPlaceHolder("Erro ao carregar...")
      }
    )
  }, [])

  return (
    <>
      <div className="flex gap-4">
        <div className="flex flex-col gap-4">
          <label className="text-md" htmlFor="income_total_amount">
            Valor Total
          </label>
          <Input.Root>
            <Input.Currency
              name="total_amount"
              onChange={(value: number) =>
                setDetailsInfo({ ...detailsInfo, totalAmount: value })
              }
            />
          </Input.Root>
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-md" htmlFor="income_total_amount">
            Qtd de Parcelas
          </label>
          <Input.Root>
            <Input.Control
              name="parts_qty"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const value = Number(event.target.value)
                setDetailsInfo({ ...detailsInfo, partsQty: value })
              }}
            />
          </Input.Root>
        </div>

        <div className="flex min-w-[500px] flex-col gap-2">
          <label className="text-lg" htmlFor="income_source_id">
            Conta Bancária
          </label>
          <Input.Root variant={errors.incomeDetailsArray ? "error" : "primary"}>
            <Input.SelectInput
              name={`incomeDetailsArray`}
              options={bankAccounts}
              disabled={!income_input_fields_bank_account_id}
              value={detailsInfo.bankAccountId}
              onChange={(value: string) =>
                setDetailsInfo({ ...detailsInfo, bankAccountId: value })
              }
            />
          </Input.Root>
          {errors.incomeDetailsArray && (
            <span className="text-xs text-red-500">
              {errors.incomeDetailsArray.message}
            </span>
          )}
        </div>
        {/* <div className="mt-auto flex justify-end gap-4">
          <Button type="button" variant="primary">
            Gerar Parcelas
          </Button>
        </div> */}
      </div>
      {detailsInfo.partsQty > 0 && renderDetailsInfo()}

      <div className="mt-6 flex gap-4">
        <Button
          type="button"
          onClick={() => setSecondPage(false)}
          variant="tertiary">
          Voltar
        </Button>
        <Button
          variant="primary"
          onClick={async () => {
            const isFormValid = await trigger([
              "income_source_id",
              "income_group_id",
              "date",
              "description",
              "document",
              "income_percentage",
              "organization_id",
            ])

            if (isFormValid) {
              setSecondPage(true)
            } else {
              toast.error("Preencha todos os campos obrigatórios")
            }
          }}>
          Salvar
        </Button>
      </div>
    </>
  )
}
