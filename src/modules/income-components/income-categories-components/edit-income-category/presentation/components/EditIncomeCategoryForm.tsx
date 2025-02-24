"use client"

import { IncomeCategory } from "@/@types/income-category"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import {
  editIncomeCategoryFormSchema,
  EditIncomeCategoryFormSchema,
} from "@/modules/income-components/income-categories-components/edit-income-category/presentation/validation/schema"
import {
  getIncomeCategoryById,
  updateIncomeCategory,
} from "@/modules/income-components/income-categories-components/remote/income-categories-methods"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function EditIncomeCategoryForm({ id }: { id: string }) {
  const { push } = useRouter()

  const { data: incomeCategory, isLoading } = useQuery({
    queryKey: ["income-category", id],
    queryFn: () => getIncomeCategoryById(id),
    enabled: id !== "",
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EditIncomeCategoryFormSchema>({
    resolver: zodResolver(editIncomeCategoryFormSchema),
    values: {
      name: incomeCategory?.name,
    },
  })

  async function onSubmit(data: IncomeCategory.UpdateRequest) {
    try {
      await updateIncomeCategory(id, data)
      toast.success("Grupo editado com sucesso!")
      setTimeout(() => push("/income-categories"), 2000)
    } catch (error) {
      toast.error("Erro ao editar grupo: " + error)
    }
  }

  if (!incomeCategory || isLoading) return <LoadingScreen />

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-8 flex max-w-96 flex-col gap-2">
        <label htmlFor="name">Nome</label>
        <Input.Root>
          <Input.Control {...register("name")} type="text" />
        </Input.Root>
        {errors.name && (
          <span className="text-xs text-red-500">{errors.name.message}</span>
        )}
      </div>

      <div className="mt-6 flex gap-4">
        <Button disabled={isSubmitting} onClick={() => {}} variant="secondary">
          Editar
        </Button>
        <Button
          disabled={isSubmitting}
          type="button"
          onClick={() => push("/income-categories")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
