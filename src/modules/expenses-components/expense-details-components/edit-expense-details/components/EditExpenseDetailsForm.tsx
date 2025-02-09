"use client"

import { ExpenseDetails } from "@/@types/expense-details"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { getAccountId } from "@/core/utils/get-account-id"
import { useBankAccountsQuery } from "@/modules/bank-accounts-components/bank-accounts/infra/hooks/use-bank-account-query"
import { editExpenseDetailsSchema } from "@/modules/expenses-components/expense-details-components/edit-expense-details/validation/schema"
import { useExpenseDetailsByIdQuery } from "@/modules/expenses-components/expense-details-components/infra/hooks/use-expense-details-by-id-query"
import { editExpenseDetails } from "@/modules/expenses-components/expense-details-components/remote/update-expense-details"
import { usePermissionQuery } from "@/modules/login-components/login/infra/hooks/use-permissions-query"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function EditExpenseDetailsForm({
  expense_details_id,
}: {
  expense_details_id: string
}) {
  const { push } = useRouter()

  const account_id = getAccountId()

  const { data: expenseDetails } =
    useExpenseDetailsByIdQuery(expense_details_id)

  const { data: bankAccounts, isLoading: bankAccountIsLoading } =
    useBankAccountsQuery(account_id)

  const { data: permissions } = usePermissionQuery()

  const expense_details_edit_input_fields_bank_account =
    permissions?.["expense_details_edit_input_fields_bank_account"]
  const expense_details_edit_input_fields_amount =
    permissions?.["expense_details_edit_input_fields_amount"]
  const expense_details_edit_input_fields_description =
    permissions?.["expense_details_edit_input_fields_description"]
  const expense_details_edit_input_fields_date =
    permissions?.[" expense_details_edit_input_fields_date"]

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    control,
  } = useForm<ExpenseDetails.UpdateRequest>({
    resolver: zodResolver(editExpenseDetailsSchema),
  })

  useEffect(() => {
    if (expenseDetails) {
      const {
        amount,
        bank_account_id,
        part,
        due_date,
        expense_id,
        observation,
        is_paid,
        expense_details_id,
      } = expenseDetails.expenseDetails
      reset({
        amount: Number(amount),
        bank_account_id: bank_account_id,
        part: part,
        due_date: String(due_date).substring(0, 10),
        expense_id: expense_id,
        observation: observation,
        is_paid: is_paid,
        expense_details_id: expense_details_id,
      })
    }
  }, [expenseDetails, reset])

  async function onSubmit(data: ExpenseDetails.UpdateRequest) {
    try {
      await editExpenseDetails(data)
      toast.success("Parcela editada com sucesso!")
      setTimeout(
        () =>
          push(
            `/expense-details?expense_id=${expenseDetails.expenseDetails.expense_id ? expenseDetails.expenseDetails.expense_id : ""}`
          ),
        2000
      )
    } catch (error) {
      toast.error("Erro ao editar parcela: " + error)
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
              <label htmlFor="expense_source_id">Conta Bancária</label>
              <Input.Root
                variant={errors.bank_account_id ? "error" : "primary"}>
                <Input.SelectInput
                  name="bank_account_id"
                  control={control}
                  disabled={!expense_details_edit_input_fields_bank_account}
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
              <label htmlFor="due_date">Data</label>
              <Input.Root variant={errors.due_date ? "error" : "primary"}>
                <Input.Control
                  disabled={!expense_details_edit_input_fields_date}
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
              <label htmlFor="observation">Observação</label>
              <Input.Root>
                <Input.Control
                  disabled={!expense_details_edit_input_fields_description}
                  {...register("observation")}
                  type="text"
                />
              </Input.Root>
            </div>

            <div className="flex max-w-[50px] flex-1 flex-col gap-2">
              <label htmlFor="part">Parte</label>
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
            <label htmlFor="amount">Valor</label>
            <Input.Root variant={errors.amount ? "error" : "primary"}>
              <Input.Currency
                disabled={!expense_details_edit_input_fields_amount}
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
            <label htmlFor="cep">Pago</label>

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
                `/expense-details?expense_id=${expenseDetails?.expenseDetails.expense_id}`
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
