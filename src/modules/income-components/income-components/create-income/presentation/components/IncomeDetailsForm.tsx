"use client"

import { SearchArray } from "@/@types/search-array"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { addMonthsToDate } from "@/core/utils/dateFunctions"
import { usePermissions } from "@/core/utils/hooks/use-permission"
import { ArrayConfig, populateArrays } from "@/core/utils/populateArrays"
import { getBankAccounts } from "@/modules/bank-accounts-components/bank-accounts/infra/remote"
import { FormType } from "@/modules/income-components/income-components/create-income/presentation/components/CreateIncomeForm"
import { IncomeDetailsInfo } from "@/modules/income-components/income-components/create-income/presentation/components/IncomeDetailsInfo"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"

type IncomeDetailFormProps = {
  account_id: string
  setSecondPage: Dispatch<SetStateAction<boolean>>
}

/**
 * @component IncomeDetailForm
 * @description A form component for handling income details including total amount, installment parts, and bank account selection.
 *
 * @param {string} props.account_id - The ID of the current account
 * @param {Dispatch<SetStateAction<boolean>>} props.setSecondPage - State setter for managing form page navigation
 *
 * @state {SearchArray} bankAccounts - Array of available bank accounts
 * @state {number | null} initialIndividualValue - Initial value for each installment
 * @state {Object} detailsInfo - Object containing form state
 * @state {number} detailsInfo.totalAmount - Total amount of the income
 * @state {number} detailsInfo.partsQty - Number of installments
 * @state {string} detailsInfo.bankAccountId - Selected bank account ID
 *
 */
export function IncomeDetailForm({
  account_id,
  setSecondPage,
}: IncomeDetailFormProps) {
  const {
    watch,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext<FormType>()

  const permissions = ["income_input_fields_bank_account_id "]

  const { income_input_fields_bank_account_id } = usePermissions(permissions)

  const [bankAccounts, setBankAccounts] = useState<SearchArray>([])
  const [initialIndividualValue, setInitialIndividualValue] = useState<
    number | null
  >(null)

  const [detailsInfo, setDetailsInfo] = useState<{
    totalAmount: number
    partsQty: number
    bankAccountId: string
  }>({
    totalAmount: null,
    partsQty: null,
    bankAccountId: null,
  })

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

  const detailsArray = watch("incomeDetailsArray")
  const { bankAccountId } = detailsInfo

  const totalAmount = detailsArray.reduce((acc, curr) => {
    return acc + (curr.amount || 0)
  }, 0)

  const renderDetailsInfo = () => {
    return Array(detailsInfo.partsQty)
      .fill(null)
      .map((_, index) => <IncomeDetailsInfo key={index} index={index} />)
  }

  // Used to simulate a dirty state on first installment amount, after first value is adjusted to match total amount the
  // effect is shut off so the user can modify the first installment amount manually.
  const adjustmentMadeRef = useRef(false)

  // Initial setup effect: Populates bank accounts and sets initial details if available
  useEffect(() => {
    populateArrays(arrayConfigs, account_id)
    if (detailsArray.length > 0) {
      setDetailsInfo({
        totalAmount: totalAmount,
        partsQty: detailsArray.length,
        bankAccountId: detailsArray[0].bank_account_id,
      })
    }
  }, [])

  // Sets the bank_account_id for each installment when select from input
  useEffect(() => {
    if (detailsArray?.length && bankAccountId) {
      detailsArray.forEach((item, index) => {
        setValue(`incomeDetailsArray.${index}.bank_account_id`, bankAccountId, {
          shouldValidate: true,
        })
      })
    }
  }, [detailsArray.length, bankAccountId, setValue])

  // Sets up part numbers, account IDs, and due dates for each installment
  useEffect(() => {
    if (detailsArray?.length) {
      detailsArray.forEach((item, index) => {
        setValue(`incomeDetailsArray.${index}.part`, index + 1)
        setValue(`incomeDetailsArray.${index}.account_id`, account_id)
        setValue(
          `incomeDetailsArray.${index}.due_date`,
          addMonthsToDate(getValues("date"), index + 1)
        )
      })
    }
  }, [detailsArray.length])

  // Calculates individual installment value when total amount or parts quantity changes
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

  // Adjusts the first installment amount to match total when there's a difference
  useEffect(() => {
    //Adjusts for when sum of parts amount is higher than total amount input
    if (
      totalAmount < detailsInfo.totalAmount &&
      !adjustmentMadeRef.current &&
      totalAmount > 0
    ) {
      const firstAmount = getValues("incomeDetailsArray.0.amount")
      const adjustment = detailsInfo.totalAmount - totalAmount

      setValue("incomeDetailsArray.0.amount", firstAmount + adjustment)

      adjustmentMadeRef.current = true // shuts off effect until manually reset
    }

    //Adjusts for when sum of parts amount is lower than total amount input
    if (
      totalAmount > detailsInfo.totalAmount &&
      !adjustmentMadeRef.current &&
      totalAmount > 0
    ) {
      const firstAmount = getValues("incomeDetailsArray.0.amount")
      const adjustment = totalAmount - detailsInfo.totalAmount

      setValue("incomeDetailsArray.0.amount", firstAmount - adjustment)

      adjustmentMadeRef.current = true // shuts off effect until manually reset
    }

    //Adjusts for when parts quantity are reduced from greater than one to one
    if (detailsArray.length === 1) {
      setValue("incomeDetailsArray.0.amount", detailsInfo.totalAmount)

      adjustmentMadeRef.current = true // shuts off effect until manually reset
    }
  }, [
    detailsInfo.totalAmount,
    totalAmount,
    getValues,
    setValue,
    detailsArray.length,
  ])

  // Trims the details array when number of parts is reduced
  useEffect(() => {
    const currentArray = getValues("incomeDetailsArray")

    if (currentArray?.length > detailsInfo?.partsQty) {
      const newArray = currentArray.slice(0, detailsInfo.partsQty)

      setValue("incomeDetailsArray", newArray)
    }
  }, [detailsInfo.partsQty])

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
              onChange={(value: number) => {
                setDetailsInfo({ ...detailsInfo, totalAmount: value })
                adjustmentMadeRef.current = false
              }}
              value={detailsInfo.totalAmount}
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
                adjustmentMadeRef.current = false
              }}
              value={detailsInfo.partsQty}
            />
          </Input.Root>
        </div>

        <div className="flex min-w-[500px] flex-col gap-4">
          <label htmlFor="income_bank_account_id">Conta Bancária</label>
          <Input.Root
            variant={
              errors?.incomeDetailsArray?.[0]?.bank_account_id ?
                "error"
              : "primary"
            }>
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
            <span className="mt-1 text-xs text-red-500">
              {errors.incomeDetailsArray[0]?.bank_account_id.message}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <Button
          type="button"
          onClick={() => setSecondPage(false)}
          variant="tertiary">
          Voltar
        </Button>
        <Button variant="primary" type="submit">
          Salvar
        </Button>
      </div>
      <div className="mt-4">
        {detailsInfo.partsQty > 0 && renderDetailsInfo()}
      </div>
    </>
  )
}
