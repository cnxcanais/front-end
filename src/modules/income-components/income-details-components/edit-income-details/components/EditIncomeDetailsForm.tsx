"use client"

import { IncomeDetails } from "@/@types/income-details"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { getCookie } from "@/lib/cookies"
import { useBankAccountsQuery } from "@/modules/bank-accounts-components/bank-accounts/infra/hooks/use-bank-account-query"
import { editIncomeDetailsSchema } from "@/modules/income-components/income-details-components/edit-income-details/validation/schema"
import { useIncomeDetailsByIdQuery } from "@/modules/income-components/income-details-components/infra/hooks/use-income-details-by-id-query"
import { editIncomeDetails } from "@/modules/income-components/income-details-components/remote/update-income-details"
import { usePermissionQuery } from "@/modules/login-components/login/infra/hooks/use-permissions-query"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function EditIncomeDetailsForm() {
  const { push } = useRouter()

  const account_id = getCookie("accountId")
  const params = useParams()
  const income_details_id = params.id as string

  const { data: incomeDetails, refetch } =
    useIncomeDetailsByIdQuery(income_details_id)

  const { data: bankAccounts, isLoading: bankAccountIsLoading } =
    useBankAccountsQuery(account_id)

  const { data: permissions, isLoading: permissionLoading } =
    usePermissionQuery()

  const income_details_edit_input_fields_bank_account =
    permissions?.componentAccess[
      "income_details_edit_input_fields_bank_account"
    ]
  const income_details_edit_input_fields_amount =
    permissions?.componentAccess["income_details_edit_input_fields_amount"]
  const income_details_edit_input_fields_description =
    permissions?.componentAccess["income_details_edit_input_fields_description"]
  const income_details_edit_input_fields_date =
    permissions?.componentAccess[" income_details_edit_input_fields_date"]

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    setValue,
    control,
  } = useForm<IncomeDetails.UpdateRequest>({
    resolver: zodResolver(editIncomeDetailsSchema),
  })

  useEffect(() => {
    if (incomeDetails) {
      const {
        amount,
        bank_account_id,
        part,
        due_date,
        income_id,
        observation,
        is_paid,
        income_details_id,
      } = incomeDetails.incomeDetails
      reset({
        amount: Number(amount),
        bank_account_id: bank_account_id,
        part: part,
        due_date: String(due_date).substring(0, 10),
        income_id: income_id,
        observation: observation,
        is_paid: is_paid,
        income_details_id: income_details_id,
      })
    }
  }, [incomeDetails, reset])

  async function onSubmit(data: IncomeDetails.UpdateRequest) {
    try {
      await editIncomeDetails(data)
      toast.success("Parcela editada com sucesso!")
      setTimeout(
        () =>
          push(
            `/income-details?income_id=${incomeDetails.incomeDetails.income_id ? incomeDetails.incomeDetails.income_id : ""}`
          ),
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
                  disabled={!income_details_edit_input_fields_bank_account}
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
                  disabled={!income_details_edit_input_fields_date}
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
                  disabled={!income_details_edit_input_fields_description}
                  {...register("observation")}
                  type="text"
                />
              </Input.Root>
            </div>

            <div className="flex max-w-[50px] flex-1 flex-col gap-2">
              <label className="text-lg" htmlFor="phone">
                Parte
              </label>
              <Input.Root variant="primary">
                <Input.Control disabled {...register("part")} type="text" />
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
                disabled={!income_details_edit_input_fields_amount}
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

          <div className="flex flex-col items-center justify-around gap-2">
            <label className="text-lg" htmlFor="cep">
              Pago
            </label>

            <input
              {...register("is_paid")}
              type="checkbox"
              id="is_paid"
              className="h-[20px] w-[20px]"
            />

            {errors.is_paid && (
              <span className="text-xs text-red-500">
                {errors.is_paid.message}
              </span>
            )}
          </div>
        </div>

        <div className="my-2 flex gap-4">
          <Button type="submit" disabled={isSubmitting} variant="primary">
            Editar
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={() =>
              push(
                `/income-details?income_id=${incomeDetails?.incomeDetails.income_id}`
              )
            }
            variant="tertiary">
            Voltar
          </Button>
        </div>
      </form>
      {process.env.NODE_ENV === "development" && <DevTool control={control} />}
    </>
  )
}
