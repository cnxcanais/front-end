"use client"

import { BankAccount } from "@/@types/bank-accounts"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import SelectInput from "@/core/components/SelectInput"
import { getAccountId } from "@/core/utils/get-account-id"
import { createBankAccount } from "@/modules/bank-accounts-components/create-bank-account/infra/remote/create-bank-account"
import {
  CreateBankAccountFormSchema,
  createBankAccountSchema,
} from "@/modules/bank-accounts-components/create-bank-account/presentation/validation/schema"
import { getBanks } from "@/modules/banks-components/banks/infra/remote"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateBankAccountForm() {
  const { push } = useRouter()

  const account_id = getAccountId()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<CreateBankAccountFormSchema>({
    resolver: zodResolver(createBankAccountSchema),
  })

  const { data: banks } = useQuery({
    queryKey: ["banks"],
    queryFn: () => getBanks(account_id),
  })

  async function onSubmit(data: BankAccount.CreateRequest) {
    try {
      const response = await createBankAccount(data)
      toast.success(response)
      setTimeout(() => push("/banks/accounts"), 2000)
    } catch (error) {
      toast.error("Erro ao criar conta de banco: " + error)
    }
  }

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
              banks?.length > 0 ?
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
            register={register}
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

      <div className="mt-6 flex gap-4">
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
