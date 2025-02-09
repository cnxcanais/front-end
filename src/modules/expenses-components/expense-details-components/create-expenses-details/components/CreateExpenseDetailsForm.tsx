"use client"

import { ExpenseDetails } from "@/@types/expense-details"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { getAccountId } from "@/core/utils/get-account-id"
import { useBankAccountsQuery } from "@/modules/bank-accounts-components/bank-accounts/infra/hooks/use-bank-account-query"
import { useExpenseByIdQuery } from "@/modules/expenses-components/expense-components/infra/use-expense-by-id-query"
import { createExpenseDetailsSchema } from "@/modules/expenses-components/expense-details-components/create-expenses-details/validation/schema"
import { createExpenseDetails } from "@/modules/expenses-components/expense-details-components/remote"
import { usePermissionQuery } from "@/modules/login-components/login/infra/hooks/use-permissions-query"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateExpenseDetailsForm({
  expense_id,
}: {
  expense_id: string
}) {
  const { push } = useRouter()

  const account_id = getAccountId()

  const { data: permissions, isLoading: permissionLoading } =
    usePermissionQuery()

  const { data: bankAccounts, isLoading: bankAccountIsLoading } =
    useBankAccountsQuery(account_id)

  const { data: expenseData, isLoading: isExpenseLoading } =
    useExpenseByIdQuery(expense_id)

  const expense_details_input_fields_amount =
    permissions?.["expense_details_input_fields_amount"]
  const expense_details_input_fields_abservation =
    permissions?.["expense_details_input_fields_abservation"]
  const expense_details_input_fields_date =
    permissions?.["expense_details_input_fields_date"]
  const expense_details_input_fields_bank_account =
    permissions?.["expense_details_input_fields_bank_account"]

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
    setValue,
  } = useForm<ExpenseDetails.CreateRequest>({
    resolver: zodResolver(createExpenseDetailsSchema),
    defaultValues: {
      expense_id: expense_id,
      account_id,
    },
  })

  async function onSubmit(data: ExpenseDetails.CreateRequest) {
    try {
      await createExpenseDetails(Array(data))
      toast.success("Parcela criada com sucesso!")
      setTimeout(
        () =>
          push(`/expense-details?expense_id=${expense_id ? expense_id : ""}`),
        2000
      )
    } catch (error) {
      toast.error("Erro ao criar parcela: " + error)
    }
  }

  useEffect(() => {
    if (expenseData) {
      setValue("part", expenseData.expense_details.length + 1)
    }
  }, [expenseData])

  if (
    !bankAccounts ||
    bankAccountIsLoading ||
    permissionLoading ||
    !permissions ||
    !expenseData ||
    isExpenseLoading
  )
    return <LoadingScreen />

  return (
    <>
      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex min-w-[500px] flex-col gap-2">
              <label htmlFor="expense_source_id">Conta Bancária</label>
              <Input.Root
                variant={errors.bank_account_id ? "error" : "primary"}>
                <Input.SelectInput
                  name="bank_account_id"
                  control={control}
                  disabled={!expense_details_input_fields_bank_account}
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
                  disabled={!expense_details_input_fields_date}
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
              <label className="min-w-[600px]" htmlFor="address_1">
                Observação
              </label>
              <Input.Root>
                <Input.Control
                  disabled={!expense_details_input_fields_abservation}
                  {...register("observation")}
                  type="text"
                />
              </Input.Root>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex max-w-[150px] flex-1 flex-col gap-2">
            <label htmlFor="expense_percentage">Valor</label>
            <Input.Root variant={errors.amount ? "error" : "primary"}>
              <Input.Currency
                disabled={!expense_details_input_fields_amount}
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
            onClick={() => push(`/expense-details?expense_id=${expense_id}`)}
            variant="tertiary">
            Voltar
          </Button>
        </div>
      </form>
      {process.env.NODE_ENV === "development" && <DevTool control={control} />}
    </>
  )
}
