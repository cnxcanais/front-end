"use client"

import { IncomeDetails } from "@/@types/income-details"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { getAccountId } from "@/core/utils/get-account-id"
import { useBankAccountsQuery } from "@/modules/bank-accounts-components/bank-accounts/infra/hooks/use-bank-account-query"
import { useIncomeByIdQuery } from "@/modules/income-components/income-components/infra/use-income-by-id-query"
import { createIncomeDetailsSchema } from "@/modules/income-components/income-details-components/create-income-details/validation/schema"
import { createIncomeDetails } from "@/modules/income-components/income-details-components/remote"
import { usePermissionQuery } from "@/modules/login-components/login/infra/hooks/use-permissions-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateIncomeDetailsForm({ income_id }: { income_id: string }) {
  const { push } = useRouter()

  const account_id = getAccountId()

  const { data: permissions, isLoading: permissionLoading } =
    usePermissionQuery()

  const { data: bankAccounts, isLoading: bankAccountIsLoading } =
    useBankAccountsQuery(account_id)

  const { data: incomeData, isLoading: isIncomeLoading } =
    useIncomeByIdQuery(income_id)

  const income_details_input_fields_amount =
    permissions?.["income_details_input_fields_amount"]
  const income_details_input_fields_abservation =
    permissions?.["income_details_input_fields_abservation"]
  const income_details_input_fields_date =
    permissions?.["income_details_input_fields_date"]
  const income_details_input_fields_bank_account =
    permissions?.["income_details_input_fields_bank_account"]

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
      account_id,
    },
  })

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

  useEffect(() => {
    if (incomeData) {
      setValue("part", incomeData.income_details.length + 1)
    }
  }, [incomeData])

  if (
    !bankAccounts ||
    bankAccountIsLoading ||
    permissionLoading ||
    !permissions ||
    !incomeData ||
    isIncomeLoading
  )
    return <LoadingScreen />

  return (
    <>
      <form
        className="mt-6 flex max-w-[1000px] flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex min-w-[500px] flex-col gap-2">
              <label htmlFor="income_source_id">Conta Bancária</label>
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
              <label htmlFor="cpf_cnpj">Data</label>
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
              <label htmlFor="address_1">Observação</label>
              <Input.Root>
                <Input.Control
                  disabled={!income_details_input_fields_abservation}
                  {...register("observation")}
                  type="text"
                />
              </Input.Root>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex max-w-[150px] flex-1 flex-col gap-2">
            <label htmlFor="income_percentage">Valor</label>
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
      {/* {process.env.NODE_ENV === "development" && <DevTool control={control} />} */}
    </>
  )
}
