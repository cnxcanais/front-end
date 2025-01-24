"use client"

import { IncomeGroup } from "@/@types/income-group"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { getCookie } from "@/lib/cookies"
import {
  CreateIncomeGroupSchema,
  createIncomeGroupSchema,
} from "@/modules/income-groups-components/create-income-group/presentation/validation/schema"
import { createIncomeGroup } from "@/modules/income-groups-components/remote/incomeGroup"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateIncomeGroupForm() {
  const { push } = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateIncomeGroupSchema>({
    resolver: zodResolver(createIncomeGroupSchema),
    values: {
      account_id: getCookie("accountId"),
    },
  })

  async function onSubmit(data: IncomeGroup.Request) {
    try {
      const response = await createIncomeGroup(data)
      toast.success(response)
      setTimeout(() => push("/income-groups"), 2000)
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
          <Input.Control {...register("group_name")} type="text" />
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
