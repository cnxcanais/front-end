"use client"

import { IncomeGroup } from "@/@types/income-group"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { LoadingScreen } from "@/core/components/LoadingScreen"
import {
  editIncomeGroupFormSchema,
  EditIncomeGroupFormSchema,
} from "@/modules/income-groups-components/edit-income-group/presentation/validation/schema"
import {
  getIncomeGroupById,
  updateIncomeGroup,
} from "@/modules/income-groups-components/remote/incomeGroup"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function EditIncomeGroupForm({ id }: { id: string }) {
  const { push } = useRouter()

  const { data: incomeGroup, isLoading } = useQuery({
    queryKey: ["income-group", id],
    queryFn: () => getIncomeGroupById(id),
    enabled: id !== "",
    refetchOnWindowFocus: false,
  })

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<EditIncomeGroupFormSchema>({
    resolver: zodResolver(editIncomeGroupFormSchema),
    values: {
      group_name: incomeGroup?.incomeGroup.group_name,
    },
  })

  async function onSubmit(data: IncomeGroup.Update) {
    try {
      await updateIncomeGroup(id, data)
      toast.success("Grupo editado com sucesso!")
      setTimeout(() => push("/income-groups"), 2000)
    } catch (error) {
      toast.error("Erro ao editar grupo: " + error)
    }
  }

  if (!incomeGroup || isLoading) return <LoadingScreen />

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-8 flex max-w-96 flex-col gap-2">
        <label className="text-lg" htmlFor="name">
          Nome
        </label>
        <Input.Root>
          <Input.Control {...register("group_name")} type="text" />
        </Input.Root>
        {errors.group_name && (
          <span className="text-xs text-red-500">
            {errors.group_name.message}
          </span>
        )}
      </div>

      <div className="mt-6 flex gap-4">
        <Button disabled={isSubmitting} onClick={() => {}} variant="secondary">
          Salvar
        </Button>
        <Button
          disabled={isSubmitting}
          onClick={() => push("/accounts")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
