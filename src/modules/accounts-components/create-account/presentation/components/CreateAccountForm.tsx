"use client"

import { Account } from "@/@types/accounts"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { createAccount } from "@/modules/accounts-components/create-account/infra/remote/create-account"
import {
  CreateAccountSchema,
  createAccountSchema,
} from "@/modules/accounts-components/create-account/presentation/validation/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateAccountForm() {
  const { push } = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateAccountSchema>({
    resolver: zodResolver(createAccountSchema),
  })

  async function onSubmit(data: Account.CreateRequest) {
    try {
      const response = await createAccount(data)
      console.log(response)
      toast.success(response)
      setTimeout(() => push("/accounts"), 2000)
    } catch (error) {
      toast.error("Erro ao criar conta: " + error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-8 flex max-w-96 flex-col gap-2">
        <label className="text-lg" htmlFor="name">
          Nome
        </label>
        <Input.Root>
          <Input.Control {...register("name")} type="text" />
        </Input.Root>
      </div>
      <div className="mt-6 flex gap-4">
        <Button type="submit" disabled={isSubmitting} variant="secondary">
          Salvar
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => push("/accounts")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
