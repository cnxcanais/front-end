"use client"

import { BankAccount } from "@/@types/bank-accounts"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import { SelectInput } from "@/core/components/SelectInput"
import { getAccountId } from "@/core/utils/get-account-id"
import {
  editBankAccount,
  getBankAccountById,
} from "@/modules/bank-accounts-components/edit-bank-account/infra/remote"
import {
  EditBankAccountFormSchema,
  editBankAccountSchema,
} from "@/modules/bank-accounts-components/edit-bank-account/presentation/validation/schema"
import { useGetBanksQuery } from "@/modules/banks-components/banks/infra/hooks/use-get-banks-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function EditBankAccountForm({ id }: { id: string }) {
  const { push } = useRouter()
  const account_id = getAccountId()

  const { data: bankAccount, isLoading } = useQuery({
    queryKey: ["bank-account", id],
    queryFn: () => getBankAccountById(id),
    enabled: !!id && id !== "",
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const { data: banks, isLoading: isBanksLoading } =
    useGetBanksQuery(account_id)

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EditBankAccountFormSchema>({
    resolver: zodResolver(editBankAccountSchema),
    values: {
      account_number: bankAccount?.account_number ?? "",
      agency: bankAccount?.agency ?? "",
      bank_id: bankAccount?.bank_id ?? null,
      observation: bankAccount?.observation ?? "",
    },
  })

  async function onSubmit(data: BankAccount.UpdateRequest) {
    try {
      await editBankAccount(id, data)
      toast.success("Banco editado com sucesso!")
      setTimeout(() => push("/banks"), 2000)
    } catch (error) {
      toast.error("Erro ao editar banco: " + error)
    }
  }

  if (!bankAccount || !banks || isLoading || isBanksLoading)
    return <LoadingScreen />

  return (
    <form className="max-w-[800px]" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-8">
        <div className="flex flex-1 flex-col">
          <div className="mt-8 flex flex-col gap-2">
            <label className="text-lg" htmlFor="agency">
              Agência
            </label>
            <Input.Root variant={errors.agency ? "error" : "primary"}>
              <Input.Control {...register("agency")} type="text" />
            </Input.Root>
            {errors.agency && (
              <span className="text-xs text-red-500">
                {errors.agency.message}
              </span>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-2">
            <label className="text-lg" htmlFor="account_number">
              Número
            </label>
            <Input.Root variant={errors.account_number ? "error" : "primary"}>
              <Input.Control {...register("account_number")} type="text" />
            </Input.Root>
            {errors.account_number && (
              <span className="text-xs text-red-500">
                {errors.account_number.message}
              </span>
            )}
          </div>

          <SelectInput
            options={
              banks.length > 0 ?
                banks.map((bank) => {
                  return {
                    text: bank.name,
                    value: bank.bank_id,
                  }
                })
              : []
            }
            field_name="bank_id"
            label="Banco"
            {...register("bank_id")}
          />
        </div>

        <div className="flex flex-1 flex-col">
          <div className="mt-8 flex flex-1 flex-col gap-2">
            <label className="text-lg" htmlFor="observation">
              Observação
            </label>
            <Input.Root
              className="flex-1"
              variant={errors.observation ? "error" : "primary"}>
              <textarea
                className="h-full w-full resize-none border-none p-0 text-sm"
                {...register("observation")}
              />
            </Input.Root>
          </div>
        </div>
      </div>

      <div className="my-2 flex gap-4">
        <Button type="submit" disabled={isSubmitting} variant="secondary">
          Salvar
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => push("/banks/accounts")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
