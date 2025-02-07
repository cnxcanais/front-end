"use client"

import { IncomeDetails } from "@/@types/income-details"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { usePermissions } from "@/core/utils/hooks/use-permission"
import { getCookie } from "@/lib/cookies"
import { useBankAccountsQuery } from "@/modules/bank-accounts-components/bank-accounts/infra/hooks/use-bank-account-query"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { createIncomeDetails } from "../../remote"
import { createIncomeDetailsSchema } from "../validation/schema"

export function CreateIncomeDetailsForm() {
  const { push } = useRouter()

  const account_id = getCookie("accountId")
  const params = useParams()
  const income_id = params.id as string

  const { data: bankAccounts, isLoading: bankAccountIsLoading } =
    useBankAccountsQuery(account_id)

  const permissions = [
    "income_details_input_fields_amount",
    "income_details_input_fields_abservation",
    "income_details_input_fields_part",
    "income_details_input_fields_date",
    "income_details_input_fields_bank_account",
  ]

  const {
    income_details_input_fields_amount,
    income_details_input_fields_abservation,
    income_details_input_fields_part,
    income_details_input_fields_date,
    income_details_input_fields_bank_account,
  } = usePermissions(permissions)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
    setValue,
  } = useForm<IncomeDetails.CreateRequest>({
    resolver: zodResolver(createIncomeDetailsSchema),
    defaultValues: {
      income_id: income_id,
    },
  })

  useEffect(() => {
    const accountId = getCookie("accountId")
    if (accountId) {
      setValue("account_id", accountId)
    }
  }, [setValue])

  async function onSubmit(data: IncomeDetails.CreateRequest) {
    try {
      await createIncomeDetails(Array(data))
      toast.success("Parcela criada com sucesso!")
      setTimeout(
        () => push(`/income-details?income_id=${income_id ? income_id : ""}`),
        2000
      )
    } catch (error) {
      toast.error("Erro ao criar parcela: " + error)
    }
  }

  if (!bankAccounts || bankAccountIsLoading) return <LoadingScreen />

  return (
    <>
      <form
        className="mt-6 flex max-w-[1000px] flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex min-w-[500px] flex-col gap-2">
              <label className="text-lg" htmlFor="income_source_id">
                Conta Bancária
              </label>
              <Input.Root
                variant={errors.bank_account_id ? "error" : "primary"}>
                <Input.SelectInput
                  name="bank_account_id"
                  control={control}
                  disabled={!income_details_input_fields_bank_account}
                  options={[{ label: "", value: "" }].concat(
                    bankAccounts.map((account) => {
                      return {
                        label: `Ag: ${account.agency} | Cc: ${account.account_number}`,
                        value: account.bank_account_id,
                      }
                    })
                  )}
                  placeholder="Digite..."
                />
              </Input.Root>
              {errors.bank_account_id && (
                <span className="text-xs text-red-500">
                  {errors.bank_account_id.message}
                </span>
              )}
            </div>

            <div className="flex max-w-[150px] flex-1 flex-col gap-2">
              <label className="text-lg" htmlFor="cpf_cnpj">
                Data
              </label>
              <Input.Root variant={errors.due_date ? "error" : "primary"}>
                <Input.Control
                  disabled={!income_details_input_fields_date}
                  {...register("due_date")}
                  type="date"
                />
              </Input.Root>
              {errors.due_date && (
                <span className="text-xs text-red-500">
                  {errors.due_date.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex max-w-[300px] gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <label className="min-w-[600px] text-lg" htmlFor="address_1">
                Observação
              </label>
              <Input.Root>
                <Input.Control
                  disabled={!income_details_input_fields_abservation}
                  {...register("observation")}
                  type="text"
                />
              </Input.Root>
            </div>

            <div className="flex max-w-[50px] flex-1 flex-col gap-2">
              <label className="text-lg" htmlFor="phone">
                Parte
              </label>
              <Input.Root variant={errors.part ? "error" : "primary"}>
                <Input.Control
                  disabled={!income_details_input_fields_part}
                  {...register("part")}
                  type="text"
                />
              </Input.Root>
              {errors.part && (
                <span className="text-xs text-red-500">
                  {errors.part.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex max-w-[150px] flex-1 flex-col gap-2">
            <label className="text-lg" htmlFor="income_percentage">
              Valor
            </label>
            <Input.Root variant={errors.amount ? "error" : "primary"}>
              <Input.Currency
                disabled={!income_details_input_fields_amount}
                control={control}
                name="amount"
                type="text"
              />
            </Input.Root>
            {errors.amount && (
              <span className="text-xs text-red-500">
                {errors.amount.message}
              </span>
            )}
          </div>
        </div>

        <div className="my-2 flex gap-4">
          <Button type="submit" disabled={isSubmitting} variant="primary">
            Salvar
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={() => push(`/income-details?income_id=${income_id}`)}
            variant="tertiary">
            Voltar
          </Button>
        </div>
      </form>
      {process.env.NODE_ENV === "development" && <DevTool control={control} />}
    </>
  )
}
