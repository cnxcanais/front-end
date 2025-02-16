"use client"

import { IncomeCategory } from "@/@types/income-category"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { getAccountId } from "@/core/utils/get-account-id"
import {
  CreateIncomecategorieschema,
  createIncomeCategorieschema,
} from "@/modules/income-components/income-categories-components/create-income-category/presentation/validation/schema"
import { createIncomeCategory } from "@/modules/income-components/income-categories-components/remote/income-categories-methods"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateIncomeCategoryForm() {
  const { push } = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateIncomecategorieschema>({
    resolver: zodResolver(createIncomeCategorieschema),
    values: {
      account_id: getAccountId(),
    },
  })

  async function onSubmit(data: IncomeCategory.CreateRequest) {
    try {
      const response = await createIncomeCategory(data)
      toast.success(response)
      setTimeout(() => push("/income-categories"), 2000)
    } catch (error) {
      toast.error("Erro ao criar categoria: " + error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-8 flex max-w-96 flex-col gap-2">
        <label htmlFor="name">Nome</label>
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
          onClick={() => push("/income-categories")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
