"use client"

import { IncomeGroup } from "@/@types/income-group"
import { SearchArray } from "@/@types/search-array"
import { Button } from "@/core/components/Button"
import * as Input from "@/core/components/Input"
import { getAccountId } from "@/core/utils/get-account-id"
import { usePermissions } from "@/core/utils/hooks/use-permission"
import { ArrayConfig, populateArrays } from "@/core/utils/populateArrays"
import { getAllIncomeCategories } from "@/modules/income-components/income-categories-components/remote/income-categories-methods"
import {
  CreateIncomeGroupSchema,
  createIncomeGroupSchema,
} from "@/modules/income-components/income-groups-components/create-income-group/presentation/validation/schema"
import { createIncomeGroup } from "@/modules/income-components/income-groups-components/remote/income-group"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateIncomeGroupForm() {
  const { push } = useRouter()

  const account_id = getAccountId()

  const permissions = [
    "income_group_input_fields_group_name",
    "income_group_input_fields_income_category_id",
  ]

  const {
    income_group_input_fields_group_name,
    income_group_input_fields_income_category_id,
  } = usePermissions(permissions)

  const [incomeCategories, setIncomeCategories] = useState<SearchArray>([])
  const [arrayPlaceHolder, setArrayPlaceHolder] = useState("Carregando...")

  const arrayConfigs: ArrayConfig<any>[] = [
    {
      fetchFn: getAllIncomeCategories,
      mapFn: (category) => ({
        label: category.name,
        value: category.income_category_id,
      }),
      setState: setIncomeCategories,
    },
  ]

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
  } = useForm<CreateIncomeGroupSchema>({
    resolver: zodResolver(createIncomeGroupSchema),
    values: {
      account_id,
    },
  })

  async function onSubmit(data: IncomeGroup.CreateRequest) {
    try {
      const response = await createIncomeGroup(data)
      toast.success(response)
      setTimeout(() => push("/income-groups"), 2000)
    } catch (error) {
      toast.error("Erro ao criar grupo de receita: " + error)
    }
  }

  useEffect(() => {
    populateArrays(
      arrayConfigs,
      account_id,
      () => setArrayPlaceHolder("Digite..."),
      (error) => {
        toast.error("Erro ao buscar dados: " + error.message)
        setArrayPlaceHolder("Erro ao carregar...")
      }
    )
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-8 flex max-w-96 flex-col gap-2">
        <label htmlFor="name">Nome</label>
        <Input.Root>
          <Input.Control
            disabled={!income_group_input_fields_group_name}
            {...register("group_name")}
            type="text"
          />
        </Input.Root>
        {errors.group_name && (
          <span className="text-xs text-red-500">
            {errors.group_name.message}
          </span>
        )}

        <div className="mt-8 flex max-w-96 flex-col gap-2">
          <label htmlFor="name">Categoria de Receita</label>
          <Input.Root variant={errors.income_category_id ? "error" : "primary"}>
            <Input.SelectInput
              name="income_category_id"
              control={control}
              disabled={!income_group_input_fields_income_category_id}
              options={incomeCategories}
              placeholder={arrayPlaceHolder}
            />
          </Input.Root>
          {errors.income_category_id && (
            <span className="text-xs text-red-500">
              {errors.income_category_id.message}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <Button type="submit" disabled={isSubmitting} variant="secondary">
          Salvar
        </Button>
        <Button
          type="button"
          disabled={isSubmitting}
          onClick={() => push("/income-groups")}
          variant="tertiary">
          Voltar
        </Button>
      </div>
    </form>
  )
}
